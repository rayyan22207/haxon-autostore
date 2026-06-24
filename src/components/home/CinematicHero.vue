<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useContentStore } from '../../stores/contentStore'
const content = useContentStore()
const active = ref(0)
let timer
const slides = computed(() => content.heroSlides?.length ? content.heroSlides : [])
const slide = computed(() => slides.value[active.value] || slides.value[0])
const specs = computed(() => slide.value ? [
  ['Ready Dispatch', slide.value.statOneValue || 'Stocked picks'],
  ['Fitment Checked', slide.value.statTwoValue || 'Before dispatch'],
  ['Premium Imports', slide.value.statThreeValue || 'On request'],
  ['Custom Sourcing', 'Pakistan wide'],
] : [])
const next = () => { active.value = (active.value + 1) % Math.max(slides.value.length, 1) }
const prev = () => { active.value = (active.value - 1 + Math.max(slides.value.length, 1)) % Math.max(slides.value.length, 1) }
onMounted(async () => { await content.loadStorefrontContent(); timer = setInterval(next, 6800) })
onUnmounted(() => clearInterval(timer))
</script>
<template>
  <section class="relative min-h-[94vh] overflow-hidden px-4 pt-28 text-haxon-main sm:px-6 lg:px-8">
    <div class="absolute inset-0 spotlight-gradient"></div>
    <div class="automotive-frame relative mx-auto flex min-h-[calc(94vh-8rem)] max-w-7xl flex-col justify-between p-5 sm:p-8 lg:p-10">
      <transition name="hero-fade" mode="out-in">
        <div v-if="slide" :key="slide.title" class="split-hero relative flex-1 py-10 lg:py-16">
          <div class="oversized-word left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">{{ slide.backgroundWord || 'HAXON' }}</div>
          <div class="relative z-10 max-w-2xl reveal-up">
            <p class="premium-eyebrow">{{ slide.eyebrow || 'Haxon Autostore Pakistan' }}</p>
            <h1 class="mt-5 text-[clamp(3.3rem,8.2vw,8.8rem)] font-black leading-[.82] tracking-[-.085em]">{{ slide.title }}</h1>
            <p class="mt-7 max-w-xl text-base leading-8 text-haxon-muted md:text-xl">{{ slide.subtitle }}</p>
            <div class="mt-9 flex flex-wrap gap-3">
              <router-link :to="slide.primaryCtaLink || '/products'" class="premium-btn premium-btn-light">{{ slide.primaryCtaLabel || 'Shop collection' }}</router-link>
              <router-link :to="slide.secondaryCtaLink || '/contact'" class="premium-btn premium-btn-ghost">{{ slide.secondaryCtaLabel || 'Fitment help' }}</router-link>
            </div>
          </div>
          <div class="image-stage relative z-10 min-h-[22rem] lg:min-h-[32rem]">
            <img v-if="slide.image" :src="slide.image" :alt="slide.imageAlt || slide.title" class="absolute inset-0 h-full w-full object-contain p-5 opacity-95 drop-shadow-[0_35px_55px_rgba(0,0,0,.55)] transition duration-700" @error="$event.target.style.display='none'" />
            <div class="absolute inset-x-[12%] bottom-[20%] h-10 rounded-full bg-white/10 blur-2xl"></div>
            <div class="absolute left-6 top-6 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-[10px] font-black uppercase tracking-[.24em] text-white/55">Cinematic fitment stage</div>
          </div>
        </div>
      </transition>
      <div class="relative z-10 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div class="spec-strip rounded-[1.5rem]">
          <div v-for="spec in specs" :key="spec[0]" class="spec-cell"><p class="spec-cell-label">{{ spec[0] }}</p><p class="spec-cell-value">{{ spec[1] }}</p></div>
        </div>
        <div class="flex items-center gap-2 justify-end">
          <button class="icon-pill" aria-label="Previous slide" @click="prev">←</button><button class="icon-pill" aria-label="Next slide" @click="next">→</button>
          <button v-for="(_,i) in slides" :key="i" class="h-1.5 rounded-full transition-all" :class="i===active ? 'w-12 bg-white' : 'w-6 bg-white/25'" @click="active=i"></button>
        </div>
      </div>
    </div>
  </section>
</template>
