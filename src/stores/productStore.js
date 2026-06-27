import { defineStore } from 'pinia'
import { getProducts } from '../services/productService'
import { productBrand, productMode } from '../lib/catalog'
import { productMatchesCar } from '../lib/cmsUtils'

const searchable = (product) => [
  product.name, product.sku, product.slug, product.category, productBrand(product), product.shortDescription,
  product.description, product.fitmentNotes, product.carModel, ...(product.compatibleMakes || []), ...(product.compatibleModels || []),
  ...(product.compatibleYears || []), ...(product.compatibleVariants || []), ...(product.features || []),
].join(' ').toLowerCase()

export const useProductStore = defineStore('products', {
  state: () => ({ products: [], loading: false, loaded: false, error: '', search: '', category: 'All', brand: 'All', availability: 'All', carMake: '', carModel: '', sort: 'featured', page: 1, perPage: 12 }),
  getters: {
    filteredProducts: (state) => {
      const term = state.search.toLowerCase().trim()
      const filtered = state.products.filter((product) => (!term || searchable(product).includes(term)) && (state.category === 'All' || product.category === state.category) && (state.brand === 'All' || productBrand(product) === state.brand) && (state.availability === 'All' || productMode(product) === state.availability) && (!state.carMake || productMatchesCar(product, { manufacturer: state.carMake, model: state.carModel })))
      return [...filtered].sort((a,b) => state.sort === 'price-low' ? Number(a.currentPrice || a.price || 0) - Number(b.currentPrice || b.price || 0) : state.sort === 'price-high' ? Number(b.currentPrice || b.price || 0) - Number(a.currentPrice || a.price || 0) : state.sort === 'newest' ? Number(b.createdAt?.seconds || 0) - Number(a.createdAt?.seconds || 0) : Number(b.featured || 0) - Number(a.featured || 0) || Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
    },
    paginatedProducts: (state) => state.filteredProducts.slice((state.page - 1) * state.perPage, state.page * state.perPage),
    totalPages: (state) => Math.max(Math.ceil(state.filteredProducts.length / state.perPage), 1),
    brands: (state) => [...new Set(state.products.map(productBrand).filter(Boolean))].sort(),
    categories: (state) => [...new Set(state.products.map((p) => p.category).filter(Boolean))].sort(),
  },
  actions: {
    async fetchProducts(){
      this.loading = true; this.error = ''
      try { this.products = await getProducts(); this.loaded = true; if (this.page > this.totalPages) this.page = 1 }
      catch(error){ this.error = error.message || 'Unable to load products'; throw error }
      finally{ this.loading = false }
    },
  },
})
