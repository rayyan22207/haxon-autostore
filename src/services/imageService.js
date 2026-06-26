import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../firebase/config'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

const createImageName = (file) => `${Date.now()}-${crypto.randomUUID()}.${file.name.split('.').pop()}`
const assertImage = (file) => {
  if (!file) return
  if (!allowedTypes.includes(file.type)) throw new Error('Only JPG, PNG, and WEBP images are allowed.')
  if (file.size > MAX_IMAGE_SIZE) throw new Error('Image must be under 5MB.')
}

export const uploadProductImage = async (file, folder = 'products') => {
  if (!file) return null
  assertImage(file)
  const path = `${folder}/${createImageName(file)}`
  const imageRef = storageRef(storage, path)
  await uploadBytes(imageRef, file, { contentType: file.type })
  return { url: await getDownloadURL(imageRef), path }
}

export const uploadProductImages = async (files = [], folder = 'products/gallery') => Promise.all(Array.from(files).map((file) => uploadProductImage(file, folder)))

export const replaceProductImage = async (newFile, oldImagePath = null) => {
  const uploadedImage = await uploadProductImage(newFile)
  if (oldImagePath) await deleteProductImage(oldImagePath)
  return uploadedImage
}

export const deleteProductImage = async (imagePath) => {
  if (!imagePath) return
  try { await deleteObject(storageRef(storage, imagePath)) } catch (error) { if (error?.code !== 'storage/object-not-found') throw error }
}

export const deleteProductImages = async (paths = []) => Promise.all([...new Set(paths.filter(Boolean))].map((path) => deleteProductImage(path)))
