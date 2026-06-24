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
  const list = store.products.filter((p) => (p.active !== false && p.isActive !== false) && (!term || [p.name,p.category,productBrand(p),p.fitmentNotes,p.compatibleVehicles].join(' ').toLowerCase().includes(term)) && (category.value === 'All' || p.category === category.value) && (brand.value === 'All' || productBrand(p) === brand.value) && (mode.value === 'All' || productMode(p) === mode.value))
  if (sort.value === 'Price low') return [...list].sort((a,b)=>Number(a.price||0)-Number(b.price||0))
  if (sort.value === 'Price high') return [...list].sort((a,b)=>Number(b.price||0)-Number(a.price||0))
  return list
})
</script>
<template>
  <div class="automotive-shell min-h-screen pt-24">
    <section class="premium-container editorial-section pb-8">
      <div class="automotive-frame grid gap-8 p-6 md:grid-cols-[1fr_.7fr] md:p-10 lg:p-12">
        <div class="relative z-10"><div class="oversized-word left-0 top-2">SHOP</div><p class="premium-eyebrow relative">Premium catalog / configurator</p><h1 class="relative mt-5 text-[clamp(3.5rem,8vw,8rem)] font-black leading-[.84] tracking-[-.08em]">Curated upgrades for serious cars.</h1><p class="relative mt-6 max-w-2xl text-lg leading-8 text-haxon-muted">Search by vehicle, brand, category, or availability mode. Every product stays staged like a configurator tile instead of a marketplace listing.</p></div>
        <div class="image-stage min-h-[20rem]"><div class="oversized-word left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 !text-[7rem]">DRIVE</div></div>
      </div>
    </section>
    <section class="premium-container pb-20">
      <div class="cinematic-panel mb-10 grid gap-3 p-4 md:grid-cols-5"><input v-model="search" class="input-premium" placeholder="Search products, vehicle..."/><select v-model="category" class="select-premium"><option>All</option><option v-for="c in categories" :key="c">{{ c }}</option></select><select v-model="brand" class="select-premium"><option v-for="b in brands" :key="b">{{ b }}</option></select><select v-model="mode" class="select-premium"><option>All</option><option>Ready to Dispatch</option><option>Confirm Fitment</option><option>On Request</option><option>Premium Import</option></select><select v-model="sort" class="select-premium"><option>Newest</option><option>Price low</option><option>Price high</option></select></div>
      <p class="mb-6 spec-cell-label">Showing {{ filtered.length }} configured selections</p>
      <div v-if="store.loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><div v-for="i in 8" :key="i" class="model-card h-96 animate-pulse"></div></div>
      <div v-else-if="filtered.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><ProductCard v-for="product in filtered" :key="product.id" :product="product" /></div>
      <div v-else class="automotive-frame p-16 text-center"><div class="oversized-word left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">EMPTY</div><h2 class="relative text-4xl font-black">No matching configuration.</h2><p class="relative mt-3 text-haxon-muted">Try a wider category, brand, or availability mode.</p></div>
    </section>
  </div>
</template>
