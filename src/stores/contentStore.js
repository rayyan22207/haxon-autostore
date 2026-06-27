import { defineStore } from 'pinia'
import { fetchStorefrontContent } from '../lib/contentService'
import { fallbackAboutPage, fallbackBrandTiles, fallbackCars, fallbackCategoryTiles, fallbackHeroSlides, fallbackSignatureShowcase, fallbackSiteSettings, fallbackTrustItems } from '../lib/contentFallbacks'

export const useContentStore = defineStore('content', {
  state: () => ({ loading: false, loaded: false, siteSettings: fallbackSiteSettings, heroSlides: fallbackHeroSlides, categoryTiles: fallbackCategoryTiles, categories: fallbackCategoryTiles, cars: fallbackCars, aboutPage: fallbackAboutPage, signatureShowcase: fallbackSignatureShowcase, brandTiles: fallbackBrandTiles, trustItems: fallbackTrustItems }),
  getters: {
    featuredCars: (state) => state.cars.filter((car) => car.featured && car.active !== false),
    featuredCategories: (state) => state.categories.filter((category) => category.featured !== false && category.active !== false),
  },
  actions: {
    async loadStorefrontContent() {
      if (this.loading || this.loaded) return
      this.loading = true
      try { Object.assign(this, await fetchStorefrontContent()); this.loaded = true }
      finally { this.loading = false }
    },
  },
})
