import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { fallbackAboutPage, fallbackBrandTiles, fallbackCars, fallbackCategoryTiles, fallbackHeroSlides, fallbackSignatureShowcase, fallbackSiteSettings, fallbackTrustItems } from './contentFallbacks'
import { FALLBACK_IMAGE } from './catalog'
import { activeSorted, normalizeCar, normalizeCmsCategory } from './cmsUtils'

const collections = ['heroSlides', 'categoryTiles', 'categories', 'cars', 'brandTiles', 'trustItems', 'brands', 'catalogs']
const fallbackMap = { heroSlides: fallbackHeroSlides, categoryTiles: fallbackCategoryTiles, categories: fallbackCategoryTiles, cars: fallbackCars, brandTiles: fallbackBrandTiles, trustItems: fallbackTrustItems, brands: [], catalogs: [] }
const text = (value, fallback = '') => String(value || fallback || '').trim()
const normalizeImage = (value) => text(value, FALLBACK_IMAGE)
const logFirestoreError = (collectionName, operation, error) => console.error(`[Firestore] ${collectionName} ${operation} failed`, { code: error?.code, message: error?.message })
const normalizeList = (name, docs) => {
  const normalizer = name === 'heroSlides' ? normalizeHeroSlide : name === 'cars' ? normalizeCar : name === 'categoryTiles' ? normalizeCmsCategory : normalizeTile
  return activeSorted(docs.map((d) => ({ id: d.id, ...d.data() }))).map(normalizer)
}

export const normalizeHeroSlide = (slide = {}) => ({ ...slide, title: text(slide.title, 'Haxon automotive'), eyebrow: text(slide.eyebrow, 'Haxon select'), subtitle: text(slide.subtitle, 'Premium automotive accessories with fitment support.'), backgroundWord: text(slide.backgroundWord, 'HAXON'), image: normalizeImage(slide.image), imageAlt: text(slide.imageAlt, slide.title || 'Haxon hero'), primaryCtaLabel: text(slide.primaryCtaLabel, 'Shop now'), primaryCtaLink: text(slide.primaryCtaLink, '/products'), secondaryCtaLabel: text(slide.secondaryCtaLabel, 'Fitment help'), secondaryCtaLink: text(slide.secondaryCtaLink, '/contact'), statOneLabel: text(slide.statOneLabel, 'Ready Dispatch'), statOneValue: text(slide.statOneValue, 'Fast'), statTwoLabel: text(slide.statTwoLabel, 'Fitment Checked'), statTwoValue: text(slide.statTwoValue, 'Verified'), statThreeLabel: text(slide.statThreeLabel, 'Premium Imports'), statThreeValue: text(slide.statThreeValue, 'Curated'), sortOrder: Number(slide.sortOrder || 0), active: slide.active !== false })
export const normalizeTile = (tile = {}) => ({ ...tile, title: text(tile.title || tile.name, 'Haxon Collection'), name: text(tile.name || tile.title, tile.title), description: text(tile.description, 'Curated premium accessories.'), image: normalizeImage(tile.image), imageAlt: text(tile.imageAlt, tile.title || tile.name), link: text(tile.link || tile.clickDestination || tile.externalUrl, tile.slug ? `/products?category=${encodeURIComponent(tile.title || tile.name)}` : '/products'), sortOrder: Number(tile.sortOrder || 0), featured: tile.featured !== false, active: tile.active !== false })
export const normalizeSignature = (item = {}) => ({ ...fallbackSignatureShowcase, ...item, image: normalizeImage(item.image), active: item.active !== false })

const readList = async (name) => {
  try { return normalizeList(name, (await getDocs(query(collection(db, name), orderBy('sortOrder', 'asc')))).docs) }
  catch (error) { logFirestoreError(name, 'read', error); throw error }
}
const readDoc = async (name, id) => {
  try { const snap = await getDoc(doc(db, name, id)); return snap.exists() ? { id: snap.id, ...snap.data() } : null }
  catch (error) { logFirestoreError(name, 'read', error); throw error }
}

export async function fetchStorefrontContent() {
  try {
    const [settings, signature, aboutPage, ...lists] = await Promise.all([
      readDoc('siteSettings', 'general'),
      readDoc('signatureShowcase', 'main'),
      readDoc('aboutPage', 'main'),
      ...storefrontCollections.map(readList),
    ])
    const normalizer = (name) => name === 'heroSlides' ? normalizeHeroSlide : name === 'cars' ? normalizeCar : name === 'categories' ? normalizeCmsCategory : normalizeTile
    const lists = Object.fromEntries(collections.map((name, i) => [name, activeSorted(listSnaps[i].docs.map((d) => ({ id: d.id, ...d.data() }))).map(normalizer(name))]))
    return {
      siteSettings: settingsSnap.exists() ? { ...fallbackSiteSettings, ...settingsSnap.data() } : fallbackSiteSettings,
      heroSlides: lists.heroSlides.length ? lists.heroSlides : fallbackHeroSlides,
      categoryTiles: lists.categoryTiles.length ? lists.categoryTiles : (lists.categories.length ? lists.categories : fallbackCategoryTiles),
      categories: lists.categories.length ? lists.categories : (lists.categoryTiles.length ? lists.categoryTiles : fallbackCategoryTiles),
      cars: lists.cars.length ? lists.cars : fallbackCars,
      signatureShowcase: signatureSnap.exists() ? normalizeSignature(signatureSnap.data()) : fallbackSignatureShowcase,
      aboutPage: (await getContentDoc('pages', 'about')) || fallbackAboutPage,
      brandTiles: lists.brandTiles.length ? lists.brandTiles : fallbackBrandTiles,
      trustItems: lists.trustItems.length ? lists.trustItems : fallbackTrustItems,
      usingFallback: false,
    }
  } catch (error) {
    return { siteSettings: fallbackSiteSettings, heroSlides: fallbackHeroSlides, categoryTiles: fallbackCategoryTiles, categories: fallbackCategoryTiles, cars: fallbackCars, aboutPage: fallbackAboutPage, signatureShowcase: fallbackSignatureShowcase, brandTiles: fallbackBrandTiles, trustItems: fallbackTrustItems, usingFallback: true }
  }
}

export const getContentDoc = readDoc
export const listContent = async (name) => readList(name)
const normalizeContentPayload = (payload = {}) => Object.fromEntries(Object.entries(payload).filter(([key, value]) => !key.endsWith('File') && key !== 'id' && value !== undefined))
export const saveContent = async (name, payload, id = null) => {
  try {
    const data = { ...normalizeContentPayload(payload), updatedAt: serverTimestamp() }
    if (id) { await setDoc(doc(db, name, id), data, { merge: true }); return id }
    const ref = await addDoc(collection(db, name), { ...data, createdAt: serverTimestamp() }); return ref.id
  } catch (error) { logFirestoreError(name, id ? 'update' : 'create', error); throw error }
}
export const deleteContent = async (name, id) => { try { return await deleteDoc(doc(db, name, id)) } catch (error) { logFirestoreError(name, 'delete', error); throw error } }
export const saveSiteSettings = (payload) => saveContent('siteSettings', payload, 'general')
export const saveSignatureShowcase = (payload) => saveContent('signatureShowcase', payload, 'main')
