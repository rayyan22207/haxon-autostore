<script setup>
import { onMounted, ref } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import { fallbackBrands } from '../lib/catalog'
const brands = ref(fallbackBrands)
onMounted(async()=>{ try { const snap = await getDocs(collection(db,'brands')); const data = snap.docs.map(d=>({id:d.id,...d.data()})); if(data.length) brands.value=data } catch {} })
</script>
<template>
  <div class="automotive-shell min-h-screen pt-24">
    <section class="premium-container editorial-section"><div class="automotive-frame p-8 md:p-12"><div class="oversized-word left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">BRANDS</div><p class="premium-eyebrow relative">Curated model selector</p><h1 class="relative mt-5 text-[clamp(3.4rem,8vw,8rem)] font-black leading-[.84] tracking-[-.08em]">Browse by marque.</h1><p class="relative mt-6 max-w-2xl text-lg leading-8 text-haxon-muted">Toyota, Honda, BMW, Mercedes-Benz, Audi, and universal selections arranged with thin German-style dividers.</p></div></section>
    <section class="premium-container pb-20"><div class="cinematic-panel divide-y divide-white/10 overflow-hidden p-0"><router-link v-for="brand in brands" :key="brand.slug || brand.name" :to="`/products?brand=${encodeURIComponent(brand.name)}`" class="group grid gap-4 p-6 transition hover:bg-white hover:text-black md:grid-cols-[.35fr_1fr_auto] md:items-center"><p class="spec-cell-label group-hover:text-black/45">{{ brand.featured ? 'Featured partner' : 'Haxon selection' }}</p><h2 class="text-4xl font-black tracking-[-.05em] md:text-6xl">{{ brand.name }}</h2><p class="max-w-md text-haxon-muted group-hover:text-black/55">{{ brand.description || 'Premium accessories curated for this brand.' }} →</p></router-link></div></section>
  </div>
</template>
