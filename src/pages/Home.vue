<script setup>
import { computed, onMounted } from 'vue'
import HeroSlider from '../components/HeroSlider.vue'
import ProductCard from '../components/ui/ProductCard.vue'
import { useProductStore } from '../stores/productStore'
import { categories, fallbackBrands } from '../lib/catalog'
const store = useProductStore()
onMounted(() => store.fetchProducts())
const featured = computed(() => store.products.filter((p) => p.featured || p.isFeatured).slice(0, 4))
const arrivals = computed(() => (featured.value.length ? featured.value : store.products).slice(0, 4))
</script>
<template>
  <div class="bg-[#0B0D10] text-[#F5F5F2]">
    <HeroSlider />
    <section class="mx-auto max-w-7xl px-6 py-20">
      <div class="grid gap-4 md:grid-cols-3">
        <router-link v-for="item in ['Ready stock verified before dispatch','Fitment-first guidance for Pakistani vehicles','Premium import support for special builds']" :key="item" to="/products" class="rounded-[2rem] border border-white/10 bg-white/[.04] p-8 backdrop-blur transition hover:bg-white/[.07]"><p class="text-xs uppercase tracking-[.35em] text-cyan-100/60">Haxon standard</p><h2 class="mt-4 text-2xl font-black">{{ item }}</h2></router-link>
      </div>
    </section>
    <section class="border-y border-white/10 bg-[#11151B] py-20">
      <div class="mx-auto max-w-7xl px-6"><p class="text-xs uppercase tracking-[.35em] text-[#A5A7AA]">Featured categories</p><h2 class="mt-3 text-4xl font-black md:text-6xl">Accessories without clutter.</h2><div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><router-link v-for="cat in categories.slice(0,8)" :key="cat" :to="`/products?category=${encodeURIComponent(cat)}`" class="rounded-[1.7rem] border border-white/10 bg-[#0B0D10] p-6 hover:border-cyan-100/30"><span class="text-3xl">⌁</span><h3 class="mt-8 text-xl font-black">{{ cat }}</h3></router-link></div></div>
    </section>
    <section class="mx-auto max-w-7xl px-6 py-20"><div class="flex items-end justify-between gap-6"><div><p class="text-xs uppercase tracking-[.35em] text-[#A5A7AA]">Best sellers / arrivals</p><h2 class="mt-3 text-4xl font-black">Curated for the next drive.</h2></div><router-link to="/products" class="hidden rounded-full border border-white/10 px-6 py-3 text-sm font-bold uppercase tracking-[.16em] md:block">View all</router-link></div><div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><ProductCard v-for="product in arrivals" :key="product.id" :product="product" /></div></section>
    <section class="mx-auto grid max-w-7xl gap-6 px-6 pb-20 lg:grid-cols-2"><div class="rounded-[2.5rem] border border-white/10 bg-[linear-gradient(135deg,#11151B,#1D252D)] p-10"><p class="text-xs uppercase tracking-[.35em] text-cyan-100/60">Fitment first</p><h2 class="mt-4 text-4xl font-black">Not every accessory fits every car. We built the flow around that.</h2><p class="mt-5 text-[#A5A7AA]">Confirm Fitment, On Request, and Premium Import modes keep checkout honest while still letting customers start the order conversation.</p></div><div class="rounded-[2.5rem] border border-white/10 bg-white/[.04] p-10"><p class="text-xs uppercase tracking-[.35em] text-[#A5A7AA]">Featured brands</p><div class="mt-8 grid grid-cols-2 gap-3"><router-link v-for="brand in fallbackBrands" :key="brand.slug" :to="`/products?brand=${brand.name}`" class="rounded-2xl border border-white/10 p-5 font-black hover:bg-white hover:text-[#0B0D10]">{{ brand.name }}</router-link></div></div></section>
  </div>
</template>
