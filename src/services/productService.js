import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { db } from '../firebase/config'
import { cleanArray, normalizeProduct, normalizeSpecs, slugify, toNumber } from '../lib/catalog'
import { deleteProductImages } from './imageService'

const mapGallery = (items = []) => cleanArray(items).map((item) => typeof item === 'string' ? item : item.url).filter(Boolean).slice(0, 12)
const mapGalleryPaths = (items = []) => cleanArray(items).map((item) => typeof item === 'string' ? '' : item.path).filter(Boolean)
const normalizeRows = (rows = [], keys = ['label', 'value']) => cleanArray(rows).map((row) => typeof row === 'string' ? row : Object.fromEntries(keys.map((key) => [key, String(row[key] || '').trim()]))).filter((row) => typeof row === 'string' ? row : Object.values(row).some(Boolean))

export const normalizeProductPayload = (payload = {}) => {
  const name = String(payload.name || '').trim()
  const price = toNumber(payload.price)
  const saleEnabled = Boolean(payload.saleEnabled)
  const salePrice = saleEnabled ? toNumber(payload.salePrice || payload.saleValue, 0) : null
  const mainImage = payload.mainImage || payload.image || payload.imageUrl || payload.cardImage || ''
  const brand = String(payload.brand || payload.productBrand || '').trim()
  const status = payload.status || (payload.archived ? 'archived' : (payload.active === false ? 'draft' : 'published'))
  return {
    name,
    slug: slugify(payload.slug || name),
    sku: String(payload.sku || '').trim(),
    category: String(payload.category || 'Accessories').trim(),
    brand,
    productBrand: brand,
    active: status !== 'archived' && payload.active !== false,
    isActive: status !== 'archived' && payload.active !== false,
    featured: Boolean(payload.featured || payload.isFeatured),
    isFeatured: Boolean(payload.featured || payload.isFeatured),
    status,
    archived: status === 'archived',
    sortOrder: toNumber(payload.sortOrder, 0),
    compatibilityType: payload.compatibilityType || 'universal',
    universalFitment: payload.compatibilityType === 'universal' || Boolean(payload.universalFitment),
    compatibleMakes: cleanArray(payload.compatibleMakes || payload.carBrand),
    compatibleModels: cleanArray(payload.compatibleModels || payload.carModel),
    compatibleYears: cleanArray(payload.compatibleYears),
    compatibleVariants: cleanArray(payload.compatibleVariants),
    carBrand: cleanArray(payload.compatibleMakes || payload.carBrand)[0] || '',
    carModel: cleanArray(payload.compatibleModels || payload.carModel)[0] || '',
    mainImage,
    cardImage: payload.cardImage || mainImage,
    thumbnailImage: payload.thumbnailImage || '',
    bannerImage: payload.bannerImage || '',
    image: mainImage,
    imagePath: payload.imagePath || payload.mainImagePath || '',
    mainImagePath: payload.mainImagePath || payload.imagePath || '',
    thumbnailImagePath: payload.thumbnailImagePath || '',
    bannerImagePath: payload.bannerImagePath || '',
    galleryImages: mapGallery(payload.galleryImages),
    galleryImagePaths: cleanArray(payload.galleryImagePaths).concat(mapGalleryPaths(payload.galleryImages)),
    price,
    saleEnabled,
    salePrice,
    compareAtPrice: payload.compareAtPrice ? toNumber(payload.compareAtPrice) : (saleEnabled ? price : null),
    currency: payload.currency || 'PKR',
    availability: payload.availability || payload.availabilityStatus || 'Available',
    availabilityStatus: payload.availabilityStatus || payload.availability || 'Available',
    stock: toNumber(payload.stock, 0),
    estimatedDelivery: payload.estimatedDelivery || '2-3 Days',
    shortDescription: String(payload.shortDescription || payload.description || '').trim(),
    description: String(payload.description || '').trim(),
    features: cleanArray(payload.features),
    specifications: normalizeSpecs(payload.specifications),
    fitmentNotes: String(payload.fitmentNotes || '').trim(),
    installationNotes: String(payload.installationNotes || '').trim(),
    packageContents: cleanArray(payload.packageContents),
    warranty: String(payload.warranty || '').trim(),
    shippingInformation: String(payload.shippingInformation || '').trim(),
    downloads: normalizeRows(payload.downloads, ['label', 'url']),
    youtubeVideo: String(payload.youtubeVideo || '').trim(),
    faqs: normalizeRows(payload.faqs || payload.FAQs, ['question', 'answer']),
    seoTitle: String(payload.seoTitle || '').trim(),
    seoDescription: String(payload.seoDescription || '').trim(),
    updatedAt: serverTimestamp(),
  }
}

export const validateProductPayload = async (payload, currentId = '') => {
  const data = normalizeProductPayload(payload)
  if (!data.name) throw new Error('Product name is required.')
  if (!data.price || data.price < 0) throw new Error('Product price is required and cannot be negative.')
  if (!data.mainImage) throw new Error('Main image is required.')
  if (data.saleEnabled && (!data.salePrice || data.salePrice >= data.price)) throw new Error('Sale price must be lower than regular price.')
  if (data.galleryImages.length > 12) throw new Error('Gallery image limit is 12 images.')
  if (data.specifications.some((row) => !row.label || !row.value)) throw new Error('Specification rows must include both label and value.')
  const slugSnap = await getDocs(query(collection(db, 'products'), where('slug', '==', data.slug), limit(2)))
  const duplicate = slugSnap.docs.find((item) => item.id !== currentId)
  if (duplicate) throw new Error('A product with this slug already exists.')
  return data
}

export const getProducts = async ({ includeInactive = false } = {}) => {
  const snapshot = await getDocs(query(collection(db, 'products'), orderBy('sortOrder', 'asc')))
  return snapshot.docs.map((item) => normalizeProduct(item.data(), item.id)).filter((product) => includeInactive || (product.active && !product.archived && product.status !== 'draft'))
}
export const getAdminProducts = async () => {
  const snapshot = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc'))).catch(async () => getDocs(collection(db, 'products')))
  return snapshot.docs.map((item) => normalizeProduct(item.data(), item.id))
}
export const getProductById = async (id) => { const snap = await getDoc(doc(db, 'products', id)); return snap.exists() ? normalizeProduct(snap.data(), snap.id) : null }
export const createProduct = async (payload) => { const data = await validateProductPayload(payload); const ref = await addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() }); return ref.id }
export const updateProduct = async (id, payload) => updateDoc(doc(db, 'products', id), await validateProductPayload(payload, id))
export const archiveProduct = (id) => updateDoc(doc(db, 'products', id), { active: false, isActive: false, archived: true, status: 'archived', updatedAt: serverTimestamp() })
export const toggleFeaturedProduct = (id, featured) => updateDoc(doc(db, 'products', id), { featured, isFeatured: featured, updatedAt: serverTimestamp() })
export const deleteProduct = async (id) => { const product = await getProductById(id); await deleteProductImages([product?.mainImagePath, product?.imagePath, product?.thumbnailImagePath, product?.bannerImagePath, ...(product?.galleryImagePaths || [])]); return deleteDoc(doc(db, 'products', id)) }
