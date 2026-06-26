// src/services/imageService.js
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'

import { storage } from '../firebase/config'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

const createImageName = (file) => {
  const extension = file.name.split('.').pop()
  return `${Date.now()}-${crypto.randomUUID()}.${extension}`
}

export const uploadProductImage = async (file) => {
  if (!file) return null

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPG, PNG, and WEBP images are allowed.')
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Image must be under 5MB.')
  }

  const imageName = createImageName(file)
  const path = `products/${imageName}`

  const imageRef = storageRef(storage, path)

  await uploadBytes(imageRef, file, {
    contentType: file.type,
  })

  const url = await getDownloadURL(imageRef)

  return {
    url,
    path,
  }
}

export const replaceProductImage = async (newFile, oldImagePath = null) => {
  const uploadedImage = await uploadProductImage(newFile)

  if (oldImagePath) {
    try {
      const oldRef = storageRef(storage, oldImagePath)
      await deleteObject(oldRef)
    } catch (error) {
    }
  }

  return uploadedImage
}

export const deleteProductImage = async (imagePath) => {
  if (!imagePath) return

  const imageRef = storageRef(storage, imagePath)
  await deleteObject(imageRef)
}