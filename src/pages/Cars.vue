<script setup>
import { computed, onMounted } from 'vue'
import { useContentStore } from '../stores/contentStore'
import { useProductStore } from '../stores/productStore'
import { countProductsForCar } from '../lib/cmsUtils'
import { useSeo } from '../composables/useSeo'

const contentStore = useContentStore()
const productStore = useProductStore()
const cars = computed(() => contentStore.cars.map((car) => ({ ...car, productCount: countProductsForCar(productStore.products, car) })))
useSeo({ title: 'Shop by Car | Haxon', description: 'Browse every supported vehicle and discover Haxon accessories with automatic Firebase product counts.' })
onMounted(async () => { await Promise.all([contentStore.loadStorefrontContent(), productStore.fetchProducts()]) })
</script>
<template>
  <main class="min-h-screen bg-black text-white">
    <section class="border-b border-white/10 bg-[#050607] px-5 py-16 sm:px-8 lg:px-12">
      <div class="mx-auto max-w-[1500px]"><p class="text-[11px] font-black uppercase tracking-[0.32em] text-[#E50914]">Shop by car</p><h1 class="mt-5 text-[clamp(3rem,7vw,7rem)] font-black uppercase leading-[.85] tracking-[-.07em]">Choose the vehicle. <span class="block text-white/55">Then choose once.</span></h1><p class="mt-7 max-w-2xl text-lg leading-8 text-white/55">Every card is managed in Firebase. Product counts are calculated from live product compatibility.</p></div>
    </section>
    <section class="mx-auto grid max-w-[1500px] gap-4 px-5 py-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-12">
      <router-link v-for="car in cars" :key="car.id || car.slug" :to="car.link" class="group border border-white/10 bg-[#08090b] p-6 transition hover:border-[#E50914]/60 hover:bg-white/[.04]">
        <div class="flex h-44 items-center justify-center bg-black/40"><img :src="car.thumbnail || car.heroImage" :alt="`${car.manufacturer} ${car.model}`" class="max-h-36 w-full object-contain opacity-85 transition group-hover:scale-105 group-hover:opacity-100" /></div>
        <p class="mt-6 text-[11px] font-black uppercase tracking-[.18em] text-white/45">{{ car.manufacturer }}</p>
        <h2 class="mt-2 text-2xl font-black uppercase tracking-[-.03em]">{{ car.model }}</h2>
        <p v-if="car.yearRange" class="mt-2 text-sm text-white/45">{{ car.yearRange }}</p>
        <p class="mt-5 text-[11px] font-black uppercase tracking-[.16em] text-white/45">{{ car.productCount }} Products</p>
        <p class="mt-6 inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[.16em] text-white/75 group-hover:text-white">View Products <span>→</span></p>
      </router-link>
    </section>
  </main>
</template>
