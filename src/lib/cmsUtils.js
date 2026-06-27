import { FALLBACK_IMAGE, cleanArray, slugify } from './catalog'

const text = (value, fallback = '') => String(value || fallback || '').trim()
const norm = (value = '') => text(value).toLowerCase()
export const activeSorted = (items = []) => items.filter((item) => item.active !== false).sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
export const normalizeCmsCategory = (item = {}) => {
  const name = text(item.name || item.title, 'Haxon Collection')
  const slug = text(item.slug, slugify(name))
  return { ...item, name, title: name, slug, image: text(item.image, FALLBACK_IMAGE), description: text(item.description, 'Curated premium accessories.'), icon: text(item.icon), featured: item.featured !== false, active: item.active !== false, sortOrder: Number(item.sortOrder || 0), link: text(item.link || item.clickDestination || item.externalUrl, `/products?category=${encodeURIComponent(name)}`) }
}
export const normalizeCar = (item = {}) => {
  const manufacturer = text(item.manufacturer || item.make || item.brand, 'Toyota')
  const model = text(item.model, 'Corolla')
  const slug = text(item.slug, slugify(`${manufacturer}-${model}`))
  return { ...item, manufacturer, make: manufacturer, model, slug, heroImage: text(item.heroImage || item.image, FALLBACK_IMAGE), thumbnail: text(item.thumbnail || item.image || item.heroImage, FALLBACK_IMAGE), yearRange: text(item.yearRange), featured: Boolean(item.featured), active: item.active !== false, sortOrder: Number(item.sortOrder || 0), description: text(item.description, `Curated accessories for ${manufacturer} ${model}.`), seoTitle: text(item.seoTitle, `${manufacturer} ${model} Accessories | Haxon`), seoDescription: text(item.seoDescription, `Premium ${manufacturer} ${model} accessories curated by Haxon.`), ogImage: text(item.ogImage || item.thumbnail || item.heroImage, FALLBACK_IMAGE), canonicalUrl: text(item.canonicalUrl, `/products?make=${encodeURIComponent(manufacturer)}&model=${encodeURIComponent(model)}`), link: `/products?make=${encodeURIComponent(manufacturer)}&model=${encodeURIComponent(model)}` }
}
export const productMatchesCar = (product = {}, car = {}) => {
  const make = norm(car.manufacturer || car.make); const model = norm(car.model); const variant = norm(car.variant)
  const makes = cleanArray(product.compatibleMakes || product.carBrand).map(norm)
  const models = cleanArray(product.compatibleModels || product.carModel).map(norm)
  const variants = cleanArray(product.compatibleVariants).map(norm)
  if (product.universalFitment || product.compatibilityType === 'universal') return (!makes.length || makes.includes(make)) && (!models.length || models.includes(model)) && (!variants.length || !variant || variants.includes(variant))
  if (makes.length && !makes.includes(make)) return false
  if (models.length && !models.includes(model)) return false
  if (variants.length && variant && !variants.includes(variant)) return false
  return Boolean(makes.length || models.length || variants.length)
}
export const countProductsForCar = (products = [], car = {}) => products.filter((p) => p.active !== false && !p.archived && p.status !== 'draft' && productMatchesCar(p, car)).length
