<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '../stores/productStore'
import ProductCard from '../components/ui/ProductCard.vue'
import { categories, productBrand, productMode } from '../lib/catalog'
const route = useRoute(); const store = useProductStore()
const search = ref(''); const category = ref('All'); const brand = ref('All'); const mode = ref('All'); const sort = ref('Newest')
onMounted(async () => { await store.fetchProducts(); category.value = route.query.category || 'All'; brand.value = route.query.brand || 'All' })
watch(() => route.query, (q) => { category.value = q.category || 'All'; brand.value = q.brand || 'All' })
const brands = computed(() => ['All', ...new Set(store.products.map(productBrand).filter(Boolean))])
const filtered = computed(() => {
  const term = search.value.toLowerCase().trim()
  let list = store.products.filter((p) => (p.active !== false && p.isActive !== false) && (!term || [p.name,p.category,productBrand(p),p.fitmentNotes,p.compatibleVehicles].join(' ').toLowerCase().includes(term)) && (category.value === 'All' || p.category === category.value) && (brand.value === 'All' || productBrand(p) === brand.value) && (mode.value === 'All' || productMode(p) === mode.value))
  if (sort.value === 'Price low') list.sort((a,b)=>Number(a.price||0)-Number(b.price||0)); if (sort.value === 'Price high') list.sort((a,b)=>Number(b.price||0)-Number(a.price||0)); return list
})
</script>
<template><div class="min-h-screen bg-[#0B0D10] text-[#F5F5F2]"><section class="border-b border-white/10 bg-[#11151B] px-6 py-16"><div class="mx-auto max-w-7xl"><p class="text-xs uppercase tracking-[.4em] text-cyan-100/60">Haxon collection</p><h1 class="mt-4 text-5xl font-black md:text-7xl">Premium accessories, filtered by fitment.</h1></div></section><section class="mx-auto max-w-7xl px-6 py-10"><div class="mb-10 grid gap-3 rounded-[2rem] border border-white/10 bg-white/[.04] p-4 md:grid-cols-5"><input v-model="search" class="rounded-2xl border border-white/10 bg-[#0B0D10] px-4 py-3" placeholder="Search products, vehicle..."/><select v-model="category" class="rounded-2xl border border-white/10 bg-[#0B0D10] px-4 py-3"><option>All</option><option v-for="c in categories" :key="c">{{ c }}</option></select><select v-model="brand" class="rounded-2xl border border-white/10 bg-[#0B0D10] px-4 py-3"><option v-for="b in brands" :key="b">{{ b }}</option></select><select v-model="mode" class="rounded-2xl border border-white/10 bg-[#0B0D10] px-4 py-3"><option>All</option><option>Ready to Dispatch</option><option>Confirm Fitment</option><option>On Request</option><option>Premium Import</option></select><select v-model="sort" class="rounded-2xl border border-white/10 bg-[#0B0D10] px-4 py-3"><option>Newest</option><option>Price low</option><option>Price high</option></select></div><p class="mb-6 text-[#A5A7AA]">Showing {{ filtered.length }} products</p><div v-if="filtered.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><ProductCard v-for="product in filtered" :key="product.id" :product="product" /></div><div v-else class="rounded-[2rem] border border-white/10 p-16 text-center"><h2 class="text-3xl font-black">No products found</h2><p class="mt-3 text-[#A5A7AA]">Try a wider category, brand, or availability mode.</p></div></section></div></template>
