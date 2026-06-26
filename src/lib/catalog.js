export const FALLBACK_IMAGE = '/image/products/no-image.jpeg'
export const productModes = ['Ready to Dispatch', 'Confirm Fitment', 'On Request', 'Premium Import']
export const productStatuses = ['draft', 'published', 'archived']
export const orderStatuses = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Dispatched', 'Delivered', 'Cancelled']
export const paymentStatuses = ['Unpaid', 'Paid', 'Partial', 'Refunded']
export const categories = ['Exterior Accessories','Interior Accessories','LED & Lighting','Android Panels','Audio & Multimedia','Car Care','Security','Tools & Emergency']
export const fallbackBrands = ['Osram','Philips','Bosch','3M','Teyes','Steelmate','Baseus','Meguiar’s','Sonax','Turtle Wax','Auxito','K&N','Motul','Michelin'].map((name, index) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), description: `${name} product selections curated by Haxon for premium automotive upgrades.`, featured: index < 4, active: true, sortOrder: index + 1, image: FALLBACK_IMAGE, logo: FALLBACK_IMAGE }))

const statusAliases = { 'pending confirmation': 'Pending', pending: 'Pending', 'vendor checking': 'Processing', confirmed: 'Confirmed', processing: 'Processing', 'bought from vendor': 'Processing', packed: 'Packed', dispatched: 'Dispatched', shipped: 'Dispatched', delivered: 'Delivered', cancelled: 'Cancelled', canceled: 'Cancelled' }
const paymentAliases = { unpaid: 'Unpaid', pending: 'Unpaid', paid: 'Paid', partial: 'Partial', refunded: 'Refunded' }

export const formatPrice = (value, currency = 'PKR') => new Intl.NumberFormat('en-PK', { style: 'currency', currency: currency || 'PKR', maximumFractionDigits: 0 }).format(Number(value || 0))
export const slugify = (text = '') => String(text).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const normalizePhone = (phone = '') => { let digits = String(phone).replace(/[^0-9]/g, ''); if (digits.startsWith('0092')) digits = digits.slice(2); if (digits.startsWith('92')) digits = `0${digits.slice(2)}`; if (digits.length === 10 && digits.startsWith('3')) digits = `0${digits}`; return digits }
export const getPhoneCandidates = (phone = '') => { const normalized = normalizePhone(phone); const set = new Set([normalized]); if (normalized.startsWith('0')) { set.add(`92${normalized.slice(1)}`); set.add(`+92${normalized.slice(1)}`) } return [...set].filter(Boolean) }
export const normalizeOrderStatus = (status = '') => statusAliases[String(status || '').toLowerCase().trim()] || (orderStatuses.includes(status) ? status : 'Pending')
export const normalizePaymentStatus = (status = '') => paymentAliases[String(status || '').toLowerCase().trim()] || (paymentStatuses.includes(status) ? status : 'Unpaid')
export const getOrderStatusLabel = (status = '') => normalizeOrderStatus(status)
export const getOrderStatusSteps = (status = '') => { const current = normalizeOrderStatus(status); const steps = orderStatuses.filter((s) => s !== 'Cancelled'); const activeIndex = current === 'Cancelled' ? -1 : steps.indexOf(current); return steps.map((step, index) => ({ status: step, label: getOrderStatusLabel(step), complete: activeIndex >= index, current: step === current })) }

export const toNumber = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback
export const cleanArray = (value) => Array.isArray(value) ? value.map((item) => typeof item === 'string' ? item.trim() : item).filter(Boolean) : String(value || '').split('\n').map((item) => item.trim()).filter(Boolean)
export const normalizeSpecs = (specs) => {
  if (Array.isArray(specs)) return specs.map((item) => ({ label: String(item.label || item.name || '').trim(), value: String(item.value || item.text || '').trim() })).filter((item) => item.label && item.value)
  if (specs && typeof specs === 'object') return Object.entries(specs).map(([label, value]) => ({ label, value: String(value ?? '') })).filter((item) => item.label && item.value)
  return []
}
export const normalizeFaqs = (faqs) => cleanArray(faqs).map((item) => typeof item === 'string' ? { question: item, answer: '' } : { question: item.question || '', answer: item.answer || '' }).filter((item) => item.question || item.answer)
export const computePricing = (product = {}) => {
  const price = toNumber(product.price)
  const saleEnabled = Boolean(product.saleEnabled || product.salePrice)
  const salePrice = saleEnabled && product.salePrice !== '' && product.salePrice != null ? toNumber(product.salePrice, price) : null
  const currentPrice = saleEnabled && salePrice > 0 ? salePrice : price
  const compareAtPrice = toNumber(product.compareAtPrice || product.oldPrice || product.mrp || (saleEnabled ? price : 0), 0) || null
  const oldPrice = compareAtPrice && compareAtPrice > currentPrice ? compareAtPrice : null
  const discountPercent = oldPrice ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : 0
  return { price, saleEnabled, salePrice, currentPrice, compareAtPrice, oldPrice, discountPercent, discount: discountPercent }
}
export const getProductImage = (product = {}) => product.mainImage || product.cardImage || product.thumbnailImage || product.galleryImages?.[0] || product.images?.[0] || product.image || product.imageUrl || FALLBACK_IMAGE
export const getProductBrand = (product = {}) => product.brand || product.productBrand || product.manufacturer || product.carBrand || 'Universal'
export const getProductMode = (product = {}) => product.productMode || product.mode || product.availabilityStatus || product.availability || 'Confirm Fitment'
export const productImage = getProductImage
export const productBrand = getProductBrand
export const productMode = getProductMode
export const orderStatus = (order = {}) => normalizeOrderStatus(order.orderStatus || order.status)
export const orderTotal = (order = {}) => Number(order.total ?? order.totalAmount ?? order.grandTotal ?? 0)
export const buildTimelineEntry = (status, note = '') => ({ status: normalizeOrderStatus(status), label: getOrderStatusLabel(status), note, createdAt: new Date().toISOString(), at: new Date().toISOString() })

export const normalizeProduct = (product = {}, id = product.id) => {
  const brand = getProductBrand(product)
  const mainImage = getProductImage(product)
  const pricing = computePricing(product)
  const status = product.status || (product.archived ? 'archived' : (product.active === false || product.isActive === false ? 'draft' : 'published'))
  return {
    active: status !== 'archived' && product.active !== false && product.isActive !== false,
    isActive: status !== 'archived' && product.active !== false && product.isActive !== false,
    featured: Boolean(product.featured || product.isFeatured),
    isFeatured: Boolean(product.featured || product.isFeatured),
    status,
    archived: status === 'archived' || Boolean(product.archived),
    sku: product.sku || '',
    sortOrder: toNumber(product.sortOrder, 0),
    category: product.category || 'Accessories',
    brand,
    productBrand: brand,
    carBrand: product.carBrand || cleanArray(product.compatibleMakes)[0] || '',
    carModel: product.carModel || cleanArray(product.compatibleModels)[0] || '',
    compatibilityType: product.compatibilityType || (product.universalFitment ? 'universal' : (cleanArray(product.compatibleMakes).length > 1 ? 'multiple' : 'brand-specific')),
    universalFitment: Boolean(product.universalFitment || product.compatibilityType === 'universal'),
    compatibleMakes: cleanArray(product.compatibleMakes || product.carBrand),
    compatibleModels: cleanArray(product.compatibleModels || product.carModel),
    compatibleYears: cleanArray(product.compatibleYears),
    compatibleVariants: cleanArray(product.compatibleVariants),
    mainImage,
    cardImage: product.cardImage || mainImage,
    thumbnailImage: product.thumbnailImage || '',
    bannerImage: product.bannerImage || '',
    galleryImages: cleanArray(product.galleryImages || product.images).filter((image) => image !== mainImage),
    imageAlt: product.imageAlt || product.name || 'Haxon product',
    shortDescription: product.shortDescription || product.description || '',
    description: product.description || product.shortDescription || '',
    features: cleanArray(product.features),
    specifications: normalizeSpecs(product.specifications),
    fitmentNotes: product.fitmentNotes || product.compatibleVehicles || '',
    installationNotes: product.installationNotes || '',
    packageContents: cleanArray(product.packageContents),
    warranty: product.warranty || '',
    shippingInformation: product.shippingInformation || product.estimatedDelivery || '',
    downloads: cleanArray(product.downloads),
    youtubeVideo: product.youtubeVideo || '',
    faqs: normalizeFaqs(product.faqs || product.FAQs),
    currency: product.currency || 'PKR',
    availability: getProductMode(product),
    availabilityStatus: product.availabilityStatus || product.availability || 'Available',
    stock: toNumber(product.stock, 0),
    estimatedDelivery: product.estimatedDelivery || '2-3 Days',
    ...product,
    ...pricing,
    id,
    slug: product.slug || slugify(product.name || id || ''),
  }
}
