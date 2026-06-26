<script setup>
import { computed } from 'vue'
import { useProductStore } from '../../stores/productStore'
import ProductCard from '../ui/ProductCard.vue'
import SkeletonCard from '../ui/SkeletonCard.vue'
const productStore = useProductStore()
const products = computed(() => productStore.filteredProducts || [])
</script>
<template>
  <div>
    <div v-if="productStore.loading" class="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4"><SkeletonCard v-for="n in 8" :key="n" /></div>
    <div v-else-if="products.length" class="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4"><ProductCard v-for="product in products" :key="product.id" :product="product" /></div>
    <div v-else class="border border-white/10 bg-[#050607] px-6 py-16 text-center text-white"><p class="text-[11px] font-black uppercase tracking-[0.22em] text-white/40">No Products</p><h3 class="mt-3 text-2xl font-light">Nothing found yet.</h3><p class="mx-auto mt-4 max-w-md text-sm leading-6 text-white/45">Try changing filters or check back when new Firebase products are published.</p><button v-if="productStore.error" class="mt-6 border border-white/10 px-5 py-3 text-[10px] font-black uppercase tracking-[0.16em]" @click="productStore.fetchProducts">Retry</button></div>
  </div>
</template>
