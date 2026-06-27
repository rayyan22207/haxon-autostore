<script setup>
import { computed, onMounted, ref } from 'vue'
import { useContentStore } from '../../stores/contentStore'

const track = ref(null)
const contentStore = useContentStore()
const categories = computed(() => contentStore.featuredCategories)
const scrollByAmount = (direction) => track.value?.scrollBy({ left: direction * 340, behavior: 'smooth' })
onMounted(() => contentStore.loadStorefrontContent())
</script>

<template>
  <section class="relative overflow-hidden bg-black py-8 text-white sm:py-10">
    <div class="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
      <div class="mb-5 flex items-center justify-between gap-4">
        <div>
          <p class="text-[10px] font-black uppercase tracking-[0.28em] text-[#E50914]">
            Shop by category
          </p>
          <h2 class="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
            Built around the drive.
          </h2>
        </div>

        <div class="hidden items-center gap-2 sm:flex">
          <button
            class="grid h-10 w-10 place-items-center border border-white/10 bg-white/[0.035] text-white/60 transition hover:border-white/25 hover:text-white"
            aria-label="Scroll categories left"
            @click="scrollByAmount(-1)"
          >
            ←
          </button>

          <button
            class="grid h-10 w-10 place-items-center border border-white/10 bg-white/[0.035] text-white/60 transition hover:border-white/25 hover:text-white"
            aria-label="Scroll categories right"
            @click="scrollByAmount(1)"
          >
            →
          </button>
        </div>
      </div>

      <div class="relative">
        <button
          class="absolute left-0 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center border border-white/10 bg-black/70 text-white/60 backdrop-blur-xl transition hover:text-white lg:grid"
          aria-label="Scroll categories left"
          @click="scrollByAmount(-1)"
        >
          ←
        </button>

        <div
          ref="track"
          class="category-slider-track flex gap-2 overflow-x-auto scroll-smooth pb-2 lg:gap-2"
        >
          <router-link
            v-for="category in categories"
            :key="category.id || category.slug"
            :to="category.link || `/products?category=${encodeURIComponent(category.name || category.title)}`"
            class="group relative h-[205px] min-w-[285px] overflow-hidden border border-white/10 bg-[#08090b] sm:min-w-[310px] lg:min-w-[295px]"
          >
            <img
              :src="category.image"
              :alt="category.title"
              class="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-95"
            />

            <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.58)_42%,rgba(0,0,0,0.08)_100%)]"></div>

            <div class="absolute inset-0 border border-white/[0.035]"></div>

            <div class="relative flex h-full flex-col justify-between p-6">
              <div>
                <h3 class="text-lg font-black uppercase tracking-[-0.02em] text-white">
                  {{ category.title }}
                </h3>

                <p class="mt-4 max-w-[9rem] text-sm font-medium leading-6 text-white/55">
                  {{ category.subtitle || category.description }}
                </p>
              </div>

              <p class="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/75 transition group-hover:text-white">
                Shop Now
                <span class="text-base transition group-hover:translate-x-1">→</span>
              </p>
            </div>
          </router-link>
        </div>

        <button
          class="absolute right-0 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center border border-white/10 bg-black/70 text-white/60 backdrop-blur-xl transition hover:text-white lg:grid"
          aria-label="Scroll categories right"
          @click="scrollByAmount(1)"
        >
          →
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.category-slider-track {
  scrollbar-width: none;
}

.category-slider-track::-webkit-scrollbar {
  display: none;
}
</style>