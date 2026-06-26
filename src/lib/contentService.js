import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { fallbackBrandTiles, fallbackCategoryTiles, fallbackHeroSlides, fallbackSignatureShowcase, fallbackSiteSettings, fallbackTrustItems } from './contentFallbacks'
import { FALLBACK_IMAGE } from './catalog'

const collections = ['heroSlides', 'categoryTiles', 'brandTiles', 'trustItems', 'brands', 'catalogs']
const fallbackMap = { heroSlides: fallbackHeroSlides, categoryTiles: fallbackCategoryTiles, brandTiles: fallbackBrandTiles, trustItems: fallbackTrustItems, brands: [], catalogs: [] }
const text = (value, fallback = '') => String(value || fallback || '').trim()
const activeSorted = (items) => items.filter((item) => item.active !== false).sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
const normalizeImage = (value) => text(value, FALLBACK_IMAGE)

export const normalizeHeroSlide = (slide = {}) => ({ ...slide, title: text(slide.title, 'Haxon automotive'), eyebrow: text(slide.eyebrow, 'Haxon select'), subtitle: text(slide.subtitle, 'Premium automotive accessories with fitment support.'), backgroundWord: text(slide.backgroundWord, 'HAXON'), image: normalizeImage(slide.image), imageAlt: text(slide.imageAlt, slide.title || 'Haxon hero'), primaryCtaLabel: text(slide.primaryCtaLabel, 'Shop now'), primaryCtaLink: text(slide.primaryCtaLink, '/products'), secondaryCtaLabel: text(slide.secondaryCtaLabel, 'Fitment help'), secondaryCtaLink: text(slide.secondaryCtaLink, '/contact'), statOneLabel: text(slide.statOneLabel, 'Ready Dispatch'), statOneValue: text(slide.statOneValue, 'Fast'), statTwoLabel: text(slide.statTwoLabel, 'Fitment Checked'), statTwoValue: text(slide.statTwoValue, 'Verified'), statThreeLabel: text(slide.statThreeLabel, 'Premium Imports'), statThreeValue: text(slide.statThreeValue, 'Curated'), sortOrder: Number(slide.sortOrder || 0), active: slide.active !== false })
export const normalizeTile = (tile = {}) => ({ ...tile, title: text(tile.title || tile.name, 'Haxon Collection'), name: text(tile.name || tile.title, tile.title), description: text(tile.description, 'Curated premium accessories.'), image: normalizeImage(tile.image), imageAlt: text(tile.imageAlt, tile.title || tile.name), link: text(tile.link, tile.slug ? `/products?brand=${encodeURIComponent(tile.name || tile.title)}` : '/products'), sortOrder: Number(tile.sortOrder || 0), active: tile.active !== false })
export const normalizeSignature = (item = {}) => ({ ...fallbackSignatureShowcase, ...item, image: normalizeImage(item.image), active: item.active !== false })

export async function fetchStorefrontContent() {
  try {
    const [settingsSnap, signatureSnap, ...listSnaps] = await Promise.all([
      getDoc(doc(db, 'siteSettings', 'general')),
      getDoc(doc(db, 'signatureShowcase', 'main')),
      ...collections.map((name) => getDocs(query(collection(db, name), orderBy('sortOrder', 'asc')))),
    ])
    const lists = Object.fromEntries(collections.map((name, i) => [name, activeSorted(listSnaps[i].docs.map((d) => ({ id: d.id, ...d.data() }))).map(name === 'heroSlides' ? normalizeHeroSlide : normalizeTile)]))
    return {
      siteSettings: settingsSnap.exists() ? { ...fallbackSiteSettings, ...settingsSnap.data() } : fallbackSiteSettings,
      heroSlides: lists.heroSlides.length ? lists.heroSlides : fallbackHeroSlides,
      categoryTiles: lists.categoryTiles.length ? lists.categoryTiles : fallbackCategoryTiles,
      signatureShowcase: signatureSnap.exists() ? normalizeSignature(signatureSnap.data()) : fallbackSignatureShowcase,
      brandTiles: lists.brandTiles.length ? lists.brandTiles : fallbackBrandTiles,
      trustItems: lists.trustItems.length ? lists.trustItems : fallbackTrustItems,
      usingFallback: false,
    }
  } catch (error) {
    return { siteSettings: fallbackSiteSettings, heroSlides: fallbackHeroSlides, categoryTiles: fallbackCategoryTiles, signatureShowcase: fallbackSignatureShowcase, brandTiles: fallbackBrandTiles, trustItems: fallbackTrustItems, usingFallback: true }
  }
}

export const getContentDoc = async (name, id) => { const snap = await getDoc(doc(db, name, id)); return snap.exists() ? { id: snap.id, ...snap.data() } : null }
export const listContent = async (name) => (await getDocs(query(collection(db, name), orderBy('sortOrder', 'asc')))).docs.map((d) => ({ id: d.id, ...d.data() }))
const normalizeContentPayload = (payload = {}) => Object.fromEntries(Object.entries(payload).filter(([key, value]) => !key.endsWith('File') && key !== 'id' && value !== undefined))
export const saveContent = async (name, payload, id = null) => {
  const data = { ...normalizeContentPayload(payload), updatedAt: serverTimestamp() }
  if (id) { await updateDoc(doc(db, name, id), data); return id }
  const ref = await addDoc(collection(db, name), { ...data, createdAt: serverTimestamp() }); return ref.id
}
export const deleteContent = (name, id) => deleteDoc(doc(db, name, id))
export const saveSiteSettings = (payload) => setDoc(doc(db, 'siteSettings', 'general'), { ...payload, updatedAt: serverTimestamp() }, { merge: true })
export const saveSignatureShowcase = (payload) => setDoc(doc(db, 'signatureShowcase', 'main'), { ...payload, updatedAt: serverTimestamp() }, { merge: true })
