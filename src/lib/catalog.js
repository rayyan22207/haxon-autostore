export const FALLBACK_IMAGE = '/image/products/no-image.jpeg'
export const productModes = ['Ready to Dispatch', 'Confirm Fitment', 'On Request', 'Premium Import']
export const orderStatuses = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Dispatched', 'Delivered', 'Cancelled']
export const paymentStatuses = ['Unpaid', 'Paid', 'Partial']
export const categories = ['Exterior Accessories','Interior Accessories','LED & Lighting','Android Panels','Audio & Multimedia','Car Care','Security','Tools','Emergency Tools','Phone Holders','Charging Accessories','Air Pumps','Seat Covers','Other']
export const fallbackBrands = [
  { name: 'Toyota', slug: 'toyota', description: 'OEM-inspired upgrades for Pakistan’s most trusted daily drivers.' },
  { name: 'Honda', slug: 'honda', description: 'Refined interior, lighting, and multimedia accessories.' },
  { name: 'BMW', slug: 'bmw', description: 'Premium imported upgrades for German platforms.' },
  { name: 'Mercedes-Benz', slug: 'mercedes-benz', description: 'Executive-grade accessories and detailing essentials.' },
  { name: 'Audi', slug: 'audi', description: 'Minimal, high-performance accessory selections.' },
  { name: 'Universal', slug: 'universal', description: 'Curated accessories with broad compatibility.' },
]
export const formatPrice = (value) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(Number(value || 0))
export const slugify = (text = '') => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const productImage = (product = {}) => product.images?.[0] || product.image || product.imageUrl || FALLBACK_IMAGE
export const productBrand = (product = {}) => product.brand || product.carBrand || 'Universal'
export const productMode = (product = {}) => product.productMode || product.availabilityStatus || product.availability || 'Confirm Fitment'
export const orderStatus = (order = {}) => order.orderStatus || order.status || 'Pending'
export const orderTotal = (order = {}) => Number(order.total || order.totalAmount || order.grandTotal || 0)
