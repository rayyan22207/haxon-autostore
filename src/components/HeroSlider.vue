<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
const slides = [
  { eyebrow: 'Haxon Autostore', title: 'Cinematic upgrades for serious cars.', copy: 'Premium accessories, fitment-first ordering, and curated imported options for Pakistan.', cta: 'Shop collection', to: '/products', image: '/image/products/no-image.jpeg' },
  { eyebrow: 'German UI discipline', title: 'Minimal parts. Maximum presence.', copy: 'Lighting, interiors, multimedia and exterior details presented with luxury configurator clarity.', cta: 'Browse brands', to: '/brands', image: '/image/products/no-image.jpeg' },
  { eyebrow: 'Fitment confirmed', title: 'Order confidently, dispatch precisely.', copy: 'Ready stock ships fast. Fitment-sensitive products are verified before final confirmation.', cta: 'Track order', to: '/track-order', image: '/image/products/no-image.jpeg' },
]
const active = ref(0)
let timer
const go = (index) => { active.value = (index + slides.length) % slides.length }
onMounted(() => { timer = setInterval(() => go(active.value + 1), 5200) })
onBeforeUnmount(() => clearInterval(timer))
</script>
<template>
  <section class="relative min-h-[82vh] overflow-hidden bg-[#0B0D10] text-[#F5F5F2]">
    <div v-for="(slide, index) in slides" :key="slide.title" class="absolute inset-0 transition-opacity duration-1000" :class="index === active ? 'opacity-100' : 'opacity-0'">
      <img :src="slide.image" class="h-full w-full object-cover opacity-30" alt="Haxon premium automotive scene" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(125,211,252,.18),transparent_30%),linear-gradient(90deg,#0B0D10_0%,rgba(11,13,16,.88)_42%,rgba(11,13,16,.35)_100%)]"></div>
    </div>
    <div class="relative z-10 mx-auto flex min-h-[82vh] max-w-7xl items-center px-6 py-24">
      <div class="max-w-3xl animate-[fadeUp_.8s_ease_both]">
        <p class="mb-5 text-xs font-semibold uppercase tracking-[.45em] text-cyan-100/70">{{ slides[active].eyebrow }}</p>
        <h1 class="text-5xl font-black leading-[.95] tracking-[-.06em] md:text-7xl lg:text-8xl">{{ slides[active].title }}</h1>
        <p class="mt-7 max-w-2xl text-lg leading-8 text-[#A5A7AA]">{{ slides[active].copy }}</p>
        <div class="mt-10 flex flex-wrap gap-3">
          <router-link :to="slides[active].to" class="rounded-full bg-[#F5F5F2] px-7 py-4 text-sm font-bold uppercase tracking-[.18em] text-[#0B0D10]">{{ slides[active].cta }}</router-link>
          <router-link to="/contact" class="rounded-full border border-white/15 px-7 py-4 text-sm font-bold uppercase tracking-[.18em] text-white backdrop-blur">Fitment help</router-link>
        </div>
      </div>
    </div>
    <div class="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
      <button v-for="(_, index) in slides" :key="index" class="h-1.5 rounded-full transition-all" :class="index === active ? 'w-10 bg-white' : 'w-5 bg-white/30'" @click="go(index)"></button>
    </div>
  </section>
</template>
