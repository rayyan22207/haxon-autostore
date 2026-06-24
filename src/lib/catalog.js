export const FALLBACK_IMAGE = '/image/products/no-image.jpeg'
export const productModes = ['Ready to Dispatch', 'Confirm Fitment', 'On Request', 'Premium Import']
export const orderStatuses = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Dispatched', 'Delivered', 'Cancelled']
export const paymentStatuses = ['Unpaid', 'Paid', 'Partial', 'Refunded']
export const categories = ['Exterior Accessories','Interior Accessories','LED & Lighting','Android Panels','Audio & Multimedia','Car Care','Security','Tools & Emergency']
export const fallbackBrands = [
  { name: 'Toyota', slug: 'toyota', description: 'OEM-inspired upgrades for Pakistan’s most trusted daily drivers.' },
  { name: 'Honda', slug: 'honda', description: 'Refined interior, lighting, and multimedia accessories.' },
  { name: 'BMW', slug: 'bmw', description: 'Premium imported upgrades for German platforms.' },
  { name: 'Mercedes-Benz', slug: 'mercedes-benz', description: 'Executive-grade accessories and detailing essentials.' },
  { name: 'Audi', slug: 'audi', description: 'Minimal, high-performance accessory selections.' },
  { name: 'Universal', slug: 'universal', description: 'Curated accessories with broad compatibility.' },
]

const statusAliases = {
  'pending confirmation': 'Pending', pending: 'Pending', 'vendor checking': 'Processing', confirmed: 'Confirmed',
  processing: 'Processing', 'bought from vendor': 'Processing', packed: 'Packed', dispatched: 'Dispatched', shipped: 'Dispatched',
  delivered: 'Delivered', cancelled: 'Cancelled', canceled: 'Cancelled',
}
const paymentAliases = { unpaid: 'Unpaid', pending: 'Unpaid', paid: 'Paid', partial: 'Partial', refunded: 'Refunded' }

export const formatPrice = (value) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(Number(value || 0))
export const slugify = (text = '') => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const normalizePhone = (phone = '') => {
  let digits = String(phone).replace(/[^0-9]/g, '')
  if (digits.startsWith('0092')) digits = digits.slice(2)
  if (digits.startsWith('92')) digits = `0${digits.slice(2)}`
  if (digits.length === 10 && digits.startsWith('3')) digits = `0${digits}`
  return digits
}
export const getPhoneCandidates = (phone = '') => {
  const normalized = normalizePhone(phone)
  const set = new Set([normalized])
  if (normalized.startsWith('0')) { set.add(`92${normalized.slice(1)}`); set.add(`+92${normalized.slice(1)}`) }
  return [...set].filter(Boolean)
}
export const normalizeOrderStatus = (status = '') => statusAliases[String(status || '').toLowerCase().trim()] || (orderStatuses.includes(status) ? status : 'Pending')
export const normalizePaymentStatus = (status = '') => paymentAliases[String(status || '').toLowerCase().trim()] || (paymentStatuses.includes(status) ? status : 'Unpaid')
export const getOrderStatusLabel = (status = '') => normalizeOrderStatus(status)
export const getOrderStatusSteps = (status = '') => {
  const current = normalizeOrderStatus(status)
  const steps = orderStatuses.filter((s) => s !== 'Cancelled')
  const activeIndex = current === 'Cancelled' ? -1 : steps.indexOf(current)
  return steps.map((step, index) => ({ status: step, label: getOrderStatusLabel(step), complete: activeIndex >= index, current: step === current }))
}
export const getProductImage = (product = {}) => product.images?.[0] || product.image || product.imageUrl || FALLBACK_IMAGE
export const getProductBrand = (product = {}) => product.brand || product.carBrand || 'Universal'
export const getProductMode = (product = {}) => product.productMode || product.mode || product.availabilityStatus || product.availability || 'Confirm Fitment'
export const productImage = getProductImage
export const productBrand = getProductBrand
export const productMode = getProductMode
export const orderStatus = (order = {}) => normalizeOrderStatus(order.orderStatus || order.status)
export const orderTotal = (order = {}) => Number(order.total ?? order.totalAmount ?? order.grandTotal ?? 0)
export const buildTimelineEntry = (status, note = '') => ({ status: normalizeOrderStatus(status), label: getOrderStatusLabel(status), note, createdAt: new Date().toISOString(), at: new Date().toISOString() })
