import { defineStore } from 'pinia'
import { getProducts } from '../services/productService'
import { productBrand } from '../lib/catalog'
export const useProductStore = defineStore('products', { state:()=>({ products:[], loading:false, search:'', category:'All' }), getters:{ filteredProducts:(state)=> state.products.filter((product)=> { const term=state.search.toLowerCase(); return (!term || [product.name, productBrand(product), product.carModel, product.category].join(' ').toLowerCase().includes(term)) && (state.category==='All' || product.category===state.category) }) }, actions:{ async fetchProducts(){ this.loading=true; try{ this.products=await getProducts() }catch(error){ console.error(error) } finally{ this.loading=false } } } })
