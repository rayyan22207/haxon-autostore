<script setup>
import { computed, onMounted } from 'vue'
import CinematicHero from '../components/home/CinematicHero.vue'
import CategoryMosaic from '../components/home/CategoryMosaic.vue'
import SignatureShowcase from '../components/home/SignatureShowcase.vue'
import FitmentPanel from '../components/home/FitmentPanel.vue'
import ProductCard from '../components/ui/ProductCard.vue'
import { useProductStore } from '../stores/productStore'
import { useContentStore } from '../stores/contentStore'
import Revealer from '../components/ui/Revealer.vue'
const store = useProductStore()
const content = useContentStore()
onMounted(() => { store.fetchProducts(); content.loadStorefrontContent() })
const featured = computed(() => store.products.filter((p) => p.featured || p.isFeatured).slice(0, 6))
const arrivals = computed(() => (featured.value.length ? featured.value : store.products).slice(0, 4))
const signature = computed(() => featured.value[0] || store.products[0] || null)
</script>
<template>
  <div class="storefront-page">
    <CinematicHero />
    <Revealer><CategoryMosaic /></Revealer>
    <Revealer><SignatureShowcase :product="signature" /></Revealer>
    <Revealer as="section" class="premium-section pt-0">
      <div class="premium-container">
        <div class="section-split"><div><p class="premium-eyebrow">Best sellers / arrivals</p><h2 class="section-title">Curated upgrades for the next drive.</h2></div><router-link to="/products" class="premium-btn premium-btn-ghost self-end">View all</router-link></div>
        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><ProductCard v-for="product in arrivals" :key="product.id" :product="product" /></div>
      </div>
    </Revealer>
    <FitmentPanel />
    <section class="premium-section pt-0">
      <div class="premium-container">
        <div class="rounded-[2.5rem] border border-white/10 bg-white/[.035] p-7 md:p-10">
          <div class="section-split"><div><p class="premium-eyebrow">Brands</p><h2 class="section-title">Curated by marque.</h2></div><p class="section-copy">Toyota, Honda, BMW, Mercedes-Benz, Audi, and universal selections arranged with premium editorial spacing.</p></div>
          <div class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-6"><router-link v-for="brand in content.brandTiles" :key="brand.slug || brand.id" :to="brand.link || `/products?brand=${brand.name}`" class="rounded-2xl border border-white/10 bg-black/20 p-5 text-center font-black transition hover:-translate-y-1 hover:bg-white hover:text-black">{{ brand.name }}</router-link></div>
        </div>
        <div class="mt-5 grid gap-3 md:grid-cols-5"><div v-for="item in content.trustItems" :key="item.id || item.title" class="rounded-2xl border border-white/10 bg-haxon-panel p-5 text-sm font-black uppercase tracking-[.18em] text-white/70">{{ item.title }}</div></div>
      </div>
    </section>
  </div>
</template>
