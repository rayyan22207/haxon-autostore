import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { normalizeProduct, slugify } from '../lib/catalog'

const toNumber = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback
const cleanArray = (value) => Array.isArray(value) ? value.filter(Boolean) : String(value || '').split('\n').map((item) => item.trim()).filter(Boolean)

export const normalizeProductPayload = (payload = {}) => {
  const price = toNumber(payload.price)
  const saleEnabled = Boolean(payload.saleEnabled)
  const saleValue = toNumber(payload.saleValue)
  const salePrice = saleEnabled
    ? (payload.saleType === 'percentage' ? Math.max(price - ((price * saleValue) / 100), 0) : toNumber(payload.salePrice || saleValue, price))
    : null
  const name = String(payload.name || '').trim()
  const brand = String(payload.brand || payload.carBrand || '').trim()
  const category = String(payload.category || 'Accessories').trim()
  const mainImage = payload.mainImage || payload.image || payload.imageUrl || payload.cardImage || ''

  return {
    name,
    slug: String(payload.slug || slugify(name)).trim(),
    category,
    brand,
    carBrand: brand,
    carModel: String(payload.carModel || '').trim(),
    description: String(payload.description || '').trim(),
    shortDescription: String(payload.shortDescription || payload.description || '').trim(),
    price,
    saleEnabled,
    saleType: payload.saleType || 'percentage',
    saleValue,
    salePrice,
    discount: saleEnabled && price ? Math.round(((price - salePrice) / price) * 100) : 0,
    availability: payload.availability || payload.availabilityStatus || 'Available',
    availabilityStatus: payload.availabilityStatus || payload.availability || 'Available',
    stock: toNumber(payload.stock, 0),
    estimatedDelivery: payload.estimatedDelivery || '2-3 Days',
    featured: Boolean(payload.featured || payload.isFeatured),
    isFeatured: Boolean(payload.featured || payload.isFeatured),
    active: payload.active !== false && payload.isActive !== false,
    isActive: payload.active !== false && payload.isActive !== false,
    archived: Boolean(payload.archived),
    sortOrder: toNumber(payload.sortOrder, 0),
    mainImage,
    cardImage: payload.cardImage || mainImage,
    image: mainImage,
    imagePath: payload.imagePath || payload.mainImagePath || '',
    bannerImage: payload.bannerImage || '',
    bannerImagePath: payload.bannerImagePath || '',
    galleryImages: cleanArray(payload.galleryImages),
    fitment: payload.fitment || {},
    fitmentNotes: String(payload.fitmentNotes || '').trim(),
    specifications: payload.specifications || {},
    features: cleanArray(payload.features),
    updatedAt: serverTimestamp(),
  }
}

export const getProducts = async ({ includeInactive = false } = {}) => {
  const snapshot = await getDocs(query(collection(db, 'products'), orderBy('sortOrder', 'asc')))
  return snapshot.docs
    .map((item) => normalizeProduct(item.data(), item.id))
    .filter((product) => includeInactive || (product.active !== false && product.isActive !== false && product.archived !== true))
}

export const getAdminProducts = async () => {
  const snapshot = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')))
  return snapshot.docs.map((item) => normalizeProduct(item.data(), item.id))
}

export const getProductById = async (id) => {
  const snap = await getDoc(doc(db, 'products', id))
  if (!snap.exists()) return null
  return normalizeProduct(snap.data(), snap.id)
}

export const createProduct = async (payload) => {
  const ref = await addDoc(collection(db, 'products'), { ...normalizeProductPayload(payload), createdAt: serverTimestamp() })
  return ref.id
}

export const updateProduct = (id, payload) => updateDoc(doc(db, 'products', id), normalizeProductPayload(payload))
export const archiveProduct = (id) => updateDoc(doc(db, 'products', id), { active: false, isActive: false, archived: true, updatedAt: serverTimestamp() })
export const toggleFeaturedProduct = (id, featured) => updateDoc(doc(db, 'products', id), { featured, isFeatured: featured, updatedAt: serverTimestamp() })
export const deleteProduct = (id) => deleteDoc(doc(db, 'products', id))
