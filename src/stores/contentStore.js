import { defineStore } from 'pinia'
import { fetchStorefrontContent } from '../lib/contentService'
import { fallbackBrandTiles, fallbackCategoryTiles, fallbackHeroSlides, fallbackSignatureShowcase, fallbackSiteSettings, fallbackTrustItems } from '../lib/contentFallbacks'

export const useContentStore = defineStore('content', {
  state: () => ({ loading: false, loaded: false, siteSettings: fallbackSiteSettings, heroSlides: fallbackHeroSlides, categoryTiles: fallbackCategoryTiles, signatureShowcase: fallbackSignatureShowcase, brandTiles: fallbackBrandTiles, trustItems: fallbackTrustItems }),
  actions: {
    async loadStorefrontContent() {
      if (this.loading) return
      this.loading = true
      try { Object.assign(this, await fetchStorefrontContent()); this.loaded = true }
      finally { this.loading = false }
    },
  },
})
