<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useContentStore } from '../../stores/contentStore'
import fallbackHero from '../../assets/testing_2.png'

const content = useContentStore()
const active = ref(0)
let timer

const slides = computed(() => (content.heroSlides?.length ? content.heroSlides : []).filter((slide) => slide.active !== false))
const slide = computed(() => slides.value[active.value] || slides.value[0])
const slideCount = computed(() => Math.max(slides.value.length, 1))
const heroImage = computed(() => slide.value?.image || fallbackHero)
const imagePosition = computed(() => slide.value?.imagePosition || 'center center')
const specs = computed(() => {
  const current = slide.value || {}
  return [
    [current.statOneLabel || 'Ready Dispatch', current.statOneValue || 'Stocked picks'],
    [current.statTwoLabel || 'Fitment Checked', current.statTwoValue || 'Before dispatch'],
    [current.statThreeLabel || 'Premium Imports', current.statThreeValue || 'Curated sourcing'],
  ]
})

const next = () => { active.value = (active.value + 1) % slideCount.value }
const prev = () => { active.value = (active.value - 1 + slideCount.value) % slideCount.value }
const goTo = (index) => { active.value = index }

watch(slides, (items) => {
  if (active.value >= items.length) active.value = 0
})

onMounted(async () => {
  await content.loadStorefrontContent()
  if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) timer = setInterval(next, 7200)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <section class="hero-fullscreen relative isolate min-h-screen overflow-hidden text-white" aria-label="Haxon cinematic opening">
    <transition name="hero-image-fade" mode="out-in">
      <img
        :key="heroImage + active"
        :src="heroImage"
        :alt="slide?.imageAlt || slide?.title || 'Haxon automotive hero image'"
        class="hero-bg absolute inset-0 -z-20 h-full w-full object-cover"
        :style="{ objectPosition: imagePosition }"
        @error="$event.target.src = fallbackHero"
      />
    </transition>
    <div class="hero-overlay absolute inset-0 -z-10"></div>
    <div class="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,.58),transparent_52%,rgba(0,0,0,.28))]"></div>

    <transition name="hero-copy" mode="out-in">
      <div :key="slide?.id || slide?.title || active" class="hero-content premium-container flex min-h-screen flex-col justify-center pb-28 pt-36 md:pb-24">
        <div class="max-w-5xl">
          <p class="premium-eyebrow text-white/62">{{ slide?.eyebrow || 'HAXON AUTOSTORE' }}</p>
          <h1 class="editorial-heading mt-5 max-w-5xl text-[clamp(3.6rem,9vw,9.5rem)] font-black leading-[.84] tracking-[-.085em]">
            {{ slide?.title || 'Cinematic upgrades for serious cars.' }}
          </h1>
          <div v-if="slide?.backgroundWord" class="pointer-events-none absolute left-4 top-[22%] -z-0 hidden text-[18vw] font-black leading-none tracking-[-.12em] text-white/[.045] md:block">
            {{ slide.backgroundWord }}
          </div>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <router-link :to="slide?.primaryCtaLink || '/products'" class="hero-cta hero-cta-primary">{{ slide?.primaryCtaLabel || 'Explore Collection' }}</router-link>
            <router-link :to="slide?.secondaryCtaLink || '/contact'" class="hero-cta hero-cta-secondary">{{ slide?.secondaryCtaLabel || 'Fitment Help' }}</router-link>
          </div>
        </div>

        <div class="absolute bottom-8 left-4 right-4 grid gap-5 md:left-8 md:right-8 lg:grid-cols-[minmax(0,34rem)_1fr_auto] lg:items-end">
          <p class="max-w-xl text-sm leading-7 text-white/68 md:text-base">{{ slide?.subtitle || 'Premium accessories composed around fitment, sourcing, and a cleaner automotive presence.' }}</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="spec in specs" :key="spec[0]" class="rounded-full border border-white/14 bg-white/[.07] px-4 py-2 text-[10px] font-black uppercase tracking-[.22em] text-white/72 backdrop-blur-xl">{{ spec[0] }} · {{ spec[1] }}</span>
          </div>
          <div class="flex items-center gap-3 justify-self-start lg:justify-self-end">
            <button class="tiny-slide-btn" aria-label="Previous slide" @click="prev">←</button>
            <button v-for="(_, i) in slides" :key="i" class="thin-progress" :class="i === active && 'is-active'" :aria-label="`Go to slide ${i + 1}`" @click="goTo(i)"></button>
            <button class="tiny-slide-btn" aria-label="Next slide" @click="next">→</button>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>
