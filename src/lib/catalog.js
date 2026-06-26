export const FALLBACK_IMAGE = '/image/products/no-image.jpeg'
export const productModes = ['Ready to Dispatch', 'Confirm Fitment', 'On Request', 'Premium Import']
export const orderStatuses = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Dispatched', 'Delivered', 'Cancelled']
export const paymentStatuses = ['Unpaid', 'Paid', 'Partial', 'Refunded']
export const categories = ['Exterior Accessories','Interior Accessories','LED & Lighting','Android Panels','Audio & Multimedia','Car Care','Security','Tools & Emergency']
export const fallbackBrands = ['Osram','Philips','Bosch','3M','Teyes','Steelmate','Baseus','Meguiar’s','Sonax','Turtle Wax','Auxito','K&N','Motul','Michelin'].map((name, index) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), description: `${name} product selections curated by Haxon for premium automotive upgrades.`, featured: index < 4, active: true, sortOrder: index + 1, image: FALLBACK_IMAGE, logo: FALLBACK_IMAGE }))

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
export const getProductImage = (product = {}) => product.cardImage || product.mainImage || product.galleryImages?.[0] || product.images?.[0] || product.image || product.imageUrl || FALLBACK_IMAGE
export const getProductBrand = (product = {}) => product.brand || product.carBrand || 'Universal'
export const getProductMode = (product = {}) => product.productMode || product.mode || product.availabilityStatus || product.availability || 'Confirm Fitment'
export const productImage = getProductImage
export const productBrand = getProductBrand
export const productMode = getProductMode
export const orderStatus = (order = {}) => normalizeOrderStatus(order.orderStatus || order.status)
export const orderTotal = (order = {}) => Number(order.total ?? order.totalAmount ?? order.grandTotal ?? 0)
export const buildTimelineEntry = (status, note = '') => ({ status: normalizeOrderStatus(status), label: getOrderStatusLabel(status), note, createdAt: new Date().toISOString(), at: new Date().toISOString() })

export const normalizeProduct = (product = {}, id = product.id) => ({ active: true, featured: false, saleEnabled: Boolean(product.salePrice), galleryImages: [], features: [], downloads: [], faqs: [], compatibleMakes: [], compatibleModels: [], compatibleYears: [], compatibleVariants: [], universalFitment: false, ...product, id, slug: product.slug || slugify(product.name || id || ''), brand: getProductBrand(product), category: product.category || 'Accessories', price: Number(product.price || 0), salePrice: product.salePrice === '' ? null : product.salePrice, compareAtPrice: product.compareAtPrice || product.oldPrice || product.mrp || null, mainImage: product.mainImage || product.imageUrl || product.image || product.images?.[0] || FALLBACK_IMAGE, cardImage: product.cardImage || product.mainImage || product.imageUrl || product.image || product.images?.[0] || FALLBACK_IMAGE, imageAlt: product.imageAlt || product.name || 'Haxon product', availability: getProductMode(product), sortOrder: Number(product.sortOrder || 0) })
