<script setup>
import { computed, onMounted } from 'vue'
import { useContentStore } from '../stores/contentStore'

const contentStore = useContentStore()

const about = computed(() => contentStore.aboutPage)

const sections = computed(() =>
  [...(about.value.sections || [])]
    .filter((section) => section.active !== false)
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0)),
)

onMounted(() => {
  contentStore.loadStorefrontContent()
})
</script>

<template>
  <main class="min-h-screen bg-white text-black">
    <section class="relative overflow-hidden bg-white">
      <div class="mx-auto max-w-[1500px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div class="max-w-5xl">
          <p class="text-[10px] font-black uppercase tracking-[0.32em] text-[#E50914]">
            {{ about.hero?.eyebrow || 'Haxon Standard' }}
          </p>

          <h1 class="mt-6 max-w-6xl text-[clamp(3.4rem,8vw,8.8rem)] font-black uppercase leading-[0.82] tracking-[-0.085em] text-black">
            {{ about.hero?.title || 'Built around better drives.' }}
          </h1>

          <p class="mt-8 max-w-2xl text-base leading-8 text-black/55 sm:text-lg">
            {{ about.hero?.subtitle || 'Every product is selected with intention, not noise.' }}
          </p>
        </div>
      </div>
    </section>

    <section class="relative overflow-hidden bg-black text-white">
      <div class="grid min-h-[420px] lg:grid-cols-[1.1fr_0.9fr]">
        <div class="relative min-h-[360px] overflow-hidden lg:min-h-[520px]">
          <img
            :src="about.hero?.image || '/images/haxon-standard.jpg'"
            :alt="about.hero?.title || 'Haxon standard'"
            class="absolute inset-0 h-full w-full object-cover opacity-85"
          />

          <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.22)_52%,rgba(0,0,0,1)_100%)]"></div>
        </div>

        <div class="relative flex min-h-[360px] items-center bg-black px-7 py-14 sm:px-10 lg:min-h-[520px] lg:px-20">
          <div class="max-w-xl">
            <h2 class="text-[clamp(2.4rem,4.6vw,5.5rem)] font-light leading-[0.9] tracking-[-0.075em] text-white">
              We don’t follow trends.
              <span class="block">We focus on the details</span>
              <span class="block">that matter.</span>
            </h2>

            <p class="mt-8 max-w-md text-base leading-8 text-white/50">
              Every product is chosen for one reason — to make your drive better.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
      <div class="mx-auto max-w-[1500px]">
        <div class="grid gap-px overflow-hidden border border-black/10 bg-black/10 lg:grid-cols-2">
          <article
            v-for="(section, index) in sections"
            :key="section.id || index"
            class="bg-white p-7 sm:p-10 lg:p-12"
            :class="section.type === 'quote' ? 'lg:col-span-2' : ''"
          >
            <p class="text-[10px] font-black uppercase tracking-[0.28em] text-[#E50914]">
              {{ section.eyebrow || String(index + 1).padStart(2, '0') }}
            </p>

            <blockquote
              v-if="section.type === 'quote'"
              class="mt-6 max-w-5xl text-[clamp(2.4rem,5vw,6.2rem)] font-light leading-[0.95] tracking-[-0.075em] text-black"
            >
              “{{ section.quote || section.body }}”

              <footer class="mt-7 text-sm font-black uppercase tracking-[0.2em] text-black/35">
                {{ section.attribution }}
              </footer>
            </blockquote>

            <template v-else>
              <h2 class="mt-5 text-[clamp(2.3rem,4.8vw,5.5rem)] font-black uppercase leading-[0.88] tracking-[-0.065em] text-black">
                {{ section.title }}
              </h2>

              <p class="mt-7 max-w-3xl text-base leading-8 text-black/55">
                {{ section.body }}
              </p>
            </template>
          </article>
        </div>

        <div
          v-if="about.cta?.active !== false"
          class="mt-10 grid overflow-hidden bg-black text-white lg:grid-cols-[1fr_auto]"
        >
          <div class="p-8 sm:p-10 lg:p-12">
            <p class="text-[10px] font-black uppercase tracking-[0.28em] text-[#E50914]">
              Haxon
            </p>

            <h2 class="mt-5 max-w-3xl text-[clamp(2.4rem,5vw,5.8rem)] font-black uppercase leading-[0.88] tracking-[-0.065em]">
              {{ about.cta?.title }}
            </h2>

            <p class="mt-6 max-w-2xl text-base leading-8 text-white/55">
              {{ about.cta?.body }}
            </p>
          </div>

          <div class="flex items-end p-8 sm:p-10 lg:p-12">
            <router-link
              :to="about.cta?.link || '/products'"
              class="group inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.22em] text-white transition hover:text-white/70"
            >
              {{ about.cta?.label || 'Shop now' }}
              <span class="text-[#E50914] transition group-hover:translate-x-1">→</span>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>