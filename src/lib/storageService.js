import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase/config'

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxSize = 5 * 1024 * 1024

export async function uploadContentImage(file, folder = 'content') {
  if (!file) return null
  if (!allowedTypes.includes(file.type)) throw new Error('Only JPG, PNG, and WEBP images are allowed.')
  if (file.size > maxSize) throw new Error('Image must be under 5MB.')
  const ext = file.name.split('.').pop()
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`
  const ref = storageRef(storage, path)
  await uploadBytes(ref, file, { contentType: file.type })
  return { url: await getDownloadURL(ref), path }
}
