<script setup>
import { computed, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import { fallbackBrands, slugify } from '../lib/catalog'
import { ref } from 'vue'
const brands = ref(fallbackBrands)
onMounted(async()=>{ try { const snap = await getDocs(collection(db,'brands')); const data = snap.docs.map(d=>({id:d.id,...d.data()})); if(data.length) brands.value=data } catch {} })
</script>
<template><div class="min-h-screen bg-[#0B0D10] px-6 py-16 text-[#F5F5F2]"><div class="mx-auto max-w-7xl"><p class="text-xs uppercase tracking-[.4em] text-cyan-100/60">Brand browsing</p><h1 class="mt-4 text-5xl font-black md:text-7xl">Browse by marque.</h1><div class="mt-12 grid gap-5 md:grid-cols-3"><router-link v-for="brand in brands" :key="brand.slug || brand.name" :to="`/products?brand=${encodeURIComponent(brand.name)}`" class="rounded-[2rem] border border-white/10 bg-[#11151B] p-8 transition hover:-translate-y-1 hover:border-cyan-100/30"><p class="text-xs uppercase tracking-[.25em] text-[#A5A7AA]">{{ brand.featured ? 'Featured partner' : 'Haxon selection' }}</p><h2 class="mt-8 text-4xl font-black">{{ brand.name }}</h2><p class="mt-4 text-[#A5A7AA]">{{ brand.description || 'Premium accessories curated for this brand.' }}</p></router-link></div></div></div></template>
