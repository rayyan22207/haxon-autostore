<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useContentStore } from '../../stores/contentStore'
const content = useContentStore(); const active = ref(0); let timer
const slides = computed(() => content.heroSlides)
const slide = computed(() => slides.value[active.value] || slides.value[0])
onMounted(async () => { await content.loadStorefrontContent(); timer = setInterval(() => { active.value = (active.value + 1) % Math.max(slides.value.length, 1) }, 6200) })
onUnmounted(() => clearInterval(timer))
</script>
<template>
  <section class="cinema-hero relative min-h-[92vh] overflow-hidden pt-28 text-haxon-main">
    <div v-if="content.loading" class="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(229,9,20,.18),transparent_30rem),#050608]"></div>
    <transition name="hero-fade" mode="out-in"><div v-if="slide" :key="slide.title" class="absolute inset-0"><img :src="slide.image" :alt="slide.imageAlt" class="h-full w-full object-cover opacity-55" @error="$event.target.src='/image/products/no-image.jpeg'" /><div class="absolute inset-0 bg-[radial-gradient(circle_at_72%_32%,rgba(229,9,20,.18),transparent_28rem),linear-gradient(90deg,rgba(5,6,8,.96),rgba(5,6,8,.64)_42%,rgba(5,6,8,.92)),linear-gradient(0deg,#050608,transparent_42%)]"></div></div></transition>
    <div v-if="slide" class="relative mx-auto flex min-h-[calc(92vh-7rem)] max-w-7xl flex-col justify-center px-5 py-16 sm:px-6 lg:px-8">
      <p class="premium-eyebrow">{{ slide.eyebrow }}</p><div class="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 text-[17vw] font-black tracking-[-.1em] text-white/[.035] lg:block">{{ slide.backgroundWord }}</div>
      <div class="max-w-4xl"><h1 class="text-[clamp(3.2rem,9vw,8.6rem)] font-black leading-[.86] tracking-[-.08em]">{{ slide.title }}</h1><p class="mt-7 max-w-2xl text-lg leading-8 text-haxon-muted md:text-xl">{{ slide.subtitle }}</p><div class="mt-9 flex flex-wrap gap-3"><router-link :to="slide.primaryCtaLink" class="premium-btn premium-btn-light">{{ slide.primaryCtaLabel }}</router-link><router-link :to="slide.secondaryCtaLink" class="premium-btn premium-btn-ghost">{{ slide.secondaryCtaLabel }}</router-link></div><div class="mt-7 flex flex-wrap gap-4 text-sm text-haxon-muted"><router-link to="/track-order" class="hover:text-white">Track Order →</router-link><router-link to="/brands" class="hover:text-white">View Brands →</router-link></div></div>
      <div class="glass-strip mt-12 grid gap-2 sm:grid-cols-3"><div v-for="item in [[slide.statOneLabel,slide.statOneValue],[slide.statTwoLabel,slide.statTwoValue],[slide.statThreeLabel,slide.statThreeValue]]" :key="item[0]" class="flex items-center gap-3 text-xs font-black uppercase tracking-[.22em] text-white/70"><span class="h-px w-8 bg-haxon-red"></span><span>{{ item[0] }}</span><b class="text-white">{{ item[1] }}</b></div></div>
      <div class="absolute bottom-8 right-6 flex gap-2"><button v-for="(_,i) in slides" :key="i" class="h-1.5 rounded-full transition-all" :class="i===active ? 'w-12 bg-white' : 'w-6 bg-white/25'" @click="active=i"></button></div>
    </div>
  </section>
</template>
