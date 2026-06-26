import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase/config'

const imageTypes = ['image/jpeg', 'image/png', 'image/webp']
const pdfTypes = ['application/pdf']
const maxImageSize = 5 * 1024 * 1024
const maxPdfSize = 20 * 1024 * 1024

export async function uploadAsset(file, folder = 'content', { onProgress } = {}) {
  if (!file) return null
  const isPdf = pdfTypes.includes(file.type)
  if (!imageTypes.includes(file.type) && !isPdf) throw new Error('Only JPG, PNG, WEBP, and PDF files are allowed.')
  if (!isPdf && file.size > maxImageSize) throw new Error('Image must be under 5MB.')
  if (isPdf && file.size > maxPdfSize) throw new Error('PDF must be under 20MB.')
  const ext = file.name.split('.').pop()
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`
  const ref = storageRef(storage, path)
  const task = uploadBytesResumable(ref, file, { contentType: file.type })
  await new Promise((resolve, reject) => {
    task.on('state_changed', (snapshot) => {
      onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
    }, reject, resolve)
  })
  return { url: await getDownloadURL(ref), path }
}

export const uploadContentImage = (file, folder = 'content', options = {}) => uploadAsset(file, folder, options)
