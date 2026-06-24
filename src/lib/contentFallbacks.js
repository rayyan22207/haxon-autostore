import { FALLBACK_IMAGE, categories, fallbackBrands } from './catalog'

export const fallbackSiteSettings = {
  brandName: 'HAXON',
  tagline: 'Premium cinematic automotive accessories.',
  whatsappNumber: '+92 300 0000000',
  email: 'support@haxon.store',
  location: 'Pakistan',
  footerStatement: 'Curated accessories, verified fitment, and clear dispatch updates.',
  announcementText: 'Fitment is confirmed before dispatch.',
}

export const fallbackHeroSlides = [
  { id: 'fallback-lighting', eyebrow: 'Premium lighting', backgroundWord: 'DRIVE', title: 'Light the road like a studio shot.', subtitle: 'LED upgrades and visibility accessories composed for clean fitment, confident night drives, and a sharper front-end presence.', image: '/src/assets/hero.png', imageAlt: 'Premium automotive lighting', primaryCtaLabel: 'Explore Collection', primaryCtaLink: '/products', secondaryCtaLabel: 'Fitment Help', secondaryCtaLink: '/contact', statOneLabel: 'Ready Dispatch', statOneValue: 'Fast', statTwoLabel: 'Fitment Checked', statTwoValue: 'Verified', statThreeLabel: 'Premium Imports', statThreeValue: 'Curated', sortOrder: 1, active: true },
  { id: 'fallback-interior', eyebrow: 'Cabin refinement', backgroundWord: 'DETAIL', title: 'Interior upgrades with a factory-clean feel.', subtitle: 'Organized cabin essentials, trims, mats, and comfort accessories curated for daily Pakistani roads.', image: '/src/assets/testing.png', imageAlt: 'Premium automotive interior', primaryCtaLabel: 'Shop Interior', primaryCtaLink: '/products?category=Interior%20Accessories', secondaryCtaLabel: 'Contact', secondaryCtaLink: '/contact', statOneLabel: 'Cabin', statOneValue: 'Clean', statTwoLabel: 'Comfort', statTwoValue: 'Daily', statThreeLabel: 'Support', statThreeValue: 'Human', sortOrder: 2, active: true },
]

export const fallbackCategoryTiles = categories.map((title, index) => ({ id: `fallback-${index}`, title, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), description: 'Curated premium accessories with compatibility support.', image: FALLBACK_IMAGE, imageAlt: title, link: `/products?category=${encodeURIComponent(title)}`, size: index < 2 ? 'large' : 'standard', sortOrder: index + 1, active: true }))

export const fallbackSignatureShowcase = { id: 'signature', title: 'Haxon Signature Fitment Kit', eyebrow: 'Signature product', subtitle: 'Vehicle-first sourcing with compatibility confirmation before dispatch.', backgroundWord: 'HAXON', image: FALLBACK_IMAGE, imageAlt: 'Haxon signature product', priceLabel: 'On request', ctaLabel: 'Configure', ctaLink: '/contact', specOneLabel: 'Mode', specOneValue: 'Confirm Fitment', specTwoLabel: 'Price', specTwoValue: 'On request', specThreeLabel: 'Fitment', specThreeValue: 'Confirmed before dispatch.', active: true }

export const fallbackBrandTiles = fallbackBrands.map((brand, index) => ({ ...brand, id: brand.slug, image: FALLBACK_IMAGE, logo: '', link: `/products?brand=${encodeURIComponent(brand.name)}`, sortOrder: index + 1, active: true }))

export const fallbackTrustItems = ['Ready to Dispatch', 'Confirm Fitment', 'On Request', 'Premium Import', 'Clear order updates'].map((title, index) => ({ id: `trust-${index}`, title, description: 'Premium Haxon service promise.', icon: '◆', sortOrder: index + 1, active: true }))
