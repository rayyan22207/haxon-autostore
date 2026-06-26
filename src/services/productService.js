import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/config'
import { normalizeProduct } from '../lib/catalog'

export const getProducts = async () => {
  try {
    const snapshot = await getDocs(query(collection(db, 'products'), orderBy('sortOrder', 'asc')))
    return snapshot.docs.map((doc) => normalizeProduct(doc.data(), doc.id)).filter((product) => product.active !== false)
  } catch (error) {
    console.error('Failed to load products:', error)
    throw error
  }
}
