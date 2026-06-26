<script setup>
import { computed } from 'vue'
import { useProductStore } from '../../stores/productStore'
const store = useProductStore()
const availability = ['Ready to Dispatch', 'Confirm Fitment', 'On Request', 'Premium Import', 'Pre Order']
const categories = computed(() => ['All', ...store.categories])
const brands = computed(() => ['All', ...store.brands])
const clearFilters = () => { store.search=''; store.category='All'; store.brand='All'; store.availability='All'; store.sort='featured' }
</script>
<template>
  <aside class="border border-white/10 bg-[#050607] text-white">
    <div class="flex items-center justify-between border-b border-white/10 px-5 py-4"><div><p class="text-[11px] font-black uppercase tracking-[0.22em] text-white/40">Refine</p><h3 class="mt-1 text-lg font-black uppercase tracking-[0.06em]">Filters</h3></div><button class="text-[10px] font-black uppercase tracking-[0.16em] text-white/40 transition hover:text-[#E50914]" @click="clearFilters">Clear</button></div>
    <div class="divide-y divide-white/10">
      <div class="p-5"><p class="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-white/70">Search</p><input v-model="store.search" class="w-full border border-white/10 bg-black px-3 py-3 text-sm outline-none focus:border-[#E50914]" placeholder="Search products" /></div>
      <div class="p-5"><p class="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-white/70">Category</p><select v-model="store.category" class="w-full border border-white/10 bg-black px-3 py-3 text-sm"><option v-for="item in categories" :key="item">{{ item }}</option></select></div>
      <div class="p-5"><p class="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-white/70">Brand</p><select v-model="store.brand" class="w-full border border-white/10 bg-black px-3 py-3 text-sm"><option v-for="item in brands" :key="item">{{ item }}</option></select></div>
      <div class="p-5"><p class="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-white/70">Availability</p><select v-model="store.availability" class="w-full border border-white/10 bg-black px-3 py-3 text-sm"><option>All</option><option v-for="item in availability" :key="item">{{ item }}</option></select></div>
      <div class="p-5"><p class="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-white/70">Sort</p><select v-model="store.sort" class="w-full border border-white/10 bg-black px-3 py-3 text-sm"><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-low">Price low to high</option><option value="price-high">Price high to low</option></select></div>
    </div>
  </aside>
</template>
