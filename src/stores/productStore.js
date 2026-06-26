import { defineStore } from 'pinia'
import { getProducts } from '../services/productService'
import { productBrand, productMode } from '../lib/catalog'

export const useProductStore = defineStore('products', {
  state: () => ({ products: [], loading: false, error: '', search: '', category: 'All', brand: 'All', availability: 'All', sort: 'featured' }),
  getters: {
    filteredProducts: (state) => {
      const term = state.search.toLowerCase()
      const filtered = state.products.filter((product) => {
        const haystack = [product.name, productBrand(product), product.carModel, product.category, product.shortDescription, product.fitmentNotes].join(' ').toLowerCase()
        return (!term || haystack.includes(term)) && (state.category === 'All' || product.category === state.category) && (state.brand === 'All' || productBrand(product) === state.brand) && (state.availability === 'All' || productMode(product) === state.availability)
      })
      return [...filtered].sort((a,b) => state.sort === 'price-low' ? Number(a.salePrice || a.price || 0) - Number(b.salePrice || b.price || 0) : state.sort === 'price-high' ? Number(b.salePrice || b.price || 0) - Number(a.salePrice || a.price || 0) : state.sort === 'newest' ? String(b.createdAt?.seconds || b.createdAt || '').localeCompare(String(a.createdAt?.seconds || a.createdAt || '')) : Number(b.featured || 0) - Number(a.featured || 0) || Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
    },
    brands: (state) => [...new Set(state.products.map(productBrand).filter(Boolean))].sort(),
    categories: (state) => [...new Set(state.products.map((p) => p.category).filter(Boolean))].sort(),
  },
  actions: { async fetchProducts(){ this.loading=true; this.error=''; try{ this.products=await getProducts() }catch(error){ this.error=error.message || 'Unable to load products'; console.error(error) } finally{ this.loading=false } } }
})
