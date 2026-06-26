<script setup>
import { onMounted, ref } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'

const fallbackBrandList = ['Osram','Philips','Bosch','3M','Teyes','Steelmate','Baseus','Meguiar’s','Sonax','Turtle Wax','Auxito','K&N','Motul','Michelin'].map((name, index) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), tag: index < 4 ? 'Featured supplier' : 'Haxon selection', description: `${name} products curated for lighting, detailing, electronics, care, performance, and premium accessory upgrades.`, image: '/image/products/no-image.jpeg', logo: '/image/products/no-image.jpeg', featured: index < 4, active: true, sortOrder: index + 1 }))

const brands = ref(fallbackBrandList)

onMounted(async () => {
  try {
    const snap = await getDocs(collection(db, 'brands'))
    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    if (data.length) {
      brands.value = data
    }
  } catch (err) {
    console.error('Failed to load brands:', err)
  }
})
</script>

<template>
  <main class="min-h-screen bg-black  text-white">
    <section class="relative overflow-hidden border-b border-white/10 bg-[#050607]">
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(229,9,20,0.12),transparent_35%),radial-gradient(circle_at_20%_70%,rgba(255,255,255,0.07),transparent_34%)]"
      ></div>

      <p
        class="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 text-[clamp(8rem,19vw,20rem)] font-black uppercase leading-none tracking-[-0.09em] text-white/[0.035] lg:block"
      >
        Brands
      </p>

      <div class="relative mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:px-12">
        <div class="max-w-3xl">
          <div class="mb-6 h-1 w-10 bg-[#E50914] shadow-[0_0_18px_rgba(229,9,20,.7)]"></div>

          <p class="text-[11px] font-black uppercase tracking-[0.32em] text-white/45">
            Haxon Brand Index
          </p>

          <h1 class="mt-5 text-[clamp(3.2rem,8vw,8rem)] font-black uppercase leading-[0.84] tracking-[-0.075em]">
            Browse by brand.
          </h1>

          <p class="mt-7 max-w-2xl text-base leading-8 text-white/55 sm:text-lg">
            Product brands Haxon sells — lighting, detailing, care, electronics, performance and accessory specialists arranged for cleaner discovery.
          </p>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-[1500px] px-5 py-10 sm:px-8 lg:px-12">
      <div class="mb-7 flex items-end justify-between gap-4">
        <div>
          <p class="text-[11px] font-black uppercase tracking-[0.22em] text-white/40">
            Available brands
          </p>

          <h2 class="mt-2 text-3xl font-black uppercase tracking-[-0.04em]">
            Curated selections
          </h2>
        </div>

        <p class="hidden text-sm text-white/40 sm:block">
          {{ brands.length }} brands listed
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <router-link
          v-for="brand in brands"
          :key="brand.slug || brand.id || brand.name"
          :to="`/products?brand=${encodeURIComponent(brand.name)}`"
          class="group relative min-h-[330px] overflow-hidden border border-white/10 bg-[#050607] transition duration-300 hover:-translate-y-1 hover:border-white/25"
        >
          <img
            :src="brand.image"
            :alt="brand.name"
            class="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-700 group-hover:scale-105 group-hover:opacity-75"
          />

          <div
            class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.62)_48%,rgba(0,0,0,0.94)_100%)]"
          ></div>

          <div
            class="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.72)_0%,transparent_70%)]"
          ></div>

          <div class="relative flex h-full min-h-[330px] flex-col justify-between p-6">
            <div class="flex items-center justify-between gap-3">
              <span
                class="border border-white/10 bg-black/35 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-white/65 backdrop-blur"
              >
                {{ brand.featured ? 'Featured' : 'Haxon Selection' }}
              </span>

              <span class="text-xl text-white/45 transition group-hover:translate-x-1 group-hover:text-white">
                →
              </span>
            </div>

            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-[#E50914]">
                {{ brand.tag || 'Product brand' }}
              </p>

              <h3 class="mt-3 text-[clamp(2rem,3vw,3.3rem)] font-black uppercase leading-[0.9] tracking-[-0.06em]">
                {{ brand.name }}
              </h3>

              <p class="mt-5 line-clamp-2 max-w-sm text-sm leading-6 text-white/52">
                {{ brand.description || 'Premium accessories curated for this brand.' }}
              </p>
            </div>
          </div>
        </router-link>
      </div>
    </section>
  </main>
</template>