<script setup>
import { computed, ref } from 'vue'

const selectedBrand = ref('Toyota')

const brands = [
  {
    name: 'Toyota',
    models: ['Corolla', 'Yaris', 'Fortuner', 'Hilux', 'Prado'],
  },
  {
    name: 'Honda',
    models: ['Civic', 'City', 'BR-V', 'Vezel', 'Accord'],
  },
  {
    name: 'Suzuki',
    models: ['Alto', 'Cultus', 'Swift', 'Wagon R', 'Bolan'],
  },
  {
    name: 'Hyundai',
    models: ['Tucson', 'Elantra', 'Sonata', 'Santro'],
  },
  {
    name: 'Kia',
    models: ['Sportage', 'Picanto', 'Stonic', 'Sorento'],
  },
  {
    name: 'MG',
    models: ['HS', 'ZS', '5 EV', '4 EV'],
  },
]

const activeBrand = computed(() => {
  return brands.find((brand) => brand.name === selectedBrand.value) || brands[0]
})
</script>

<template>
  <section class="relative overflow-hidden bg-[#f5f3ef] py-16 text-[#111]">
    <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/10"></div>

    <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
        <div>
          <div class="mb-4 flex items-center gap-4">
            <span class="h-px w-10 bg-[#d90429]"></span>

            <p class="text-[10px] font-black uppercase tracking-[0.34em] text-black/45">
              Find by vehicle
            </p>
          </div>

          <h2 class="text-4xl font-black leading-[0.9] tracking-[-0.06em] sm:text-5xl">
            Start with your car.
          </h2>

          <p class="mt-4 max-w-md text-sm leading-6 text-black/55">
            Pick your brand, choose your model, and browse products with better fitment clarity.
          </p>
        </div>

        <div class="flex flex-wrap gap-2 lg:justify-end">
          <button
            v-for="brand in brands"
            :key="brand.name"
            type="button"
            class="rounded-full border px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] transition-all duration-300"
            :class="
              selectedBrand === brand.name
                ? 'border-[#111] bg-[#111] text-white shadow-xl shadow-black/10'
                : 'border-black/10 bg-white/60 text-black/55 hover:border-black/25 hover:bg-white hover:text-[#111]'
            "
            @click="selectedBrand = brand.name"
          >
            {{ brand.name }}
          </button>
        </div>
      </div>

      <div class="mt-10 overflow-hidden border-y border-black/10">
        <Transition
          mode="out-in"
          enter-active-class="transition duration-500 ease-out"
          enter-from-class="translate-y-4 opacity-0 blur-sm"
          enter-to-class="translate-y-0 opacity-100 blur-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="-translate-y-3 opacity-0 blur-sm"
        >
          <div
            :key="activeBrand.name"
            class="grid gap-0 lg:grid-cols-[0.4fr_1.6fr]"
          >
            <div class="border-b border-black/10 py-8 lg:border-b-0 lg:border-r lg:pr-8">
              <p class="text-[10px] font-black uppercase tracking-[0.34em] text-black/35">
                Selected Brand
              </p>

              <h3 class="mt-3 text-5xl font-black tracking-[-0.07em]">
                {{ activeBrand.name }}
              </h3>

              <p class="mt-4 max-w-xs text-sm leading-6 text-black/50">
                Browse popular models and discover parts curated for the right fit.
              </p>
            </div>

            <div class="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3">
              <router-link
                v-for="model in activeBrand.models"
                :key="model"
                :to="`/products?brand=${activeBrand.name}&model=${model}`"
                class="group relative min-h-[150px] border-b border-black/10 px-6 py-6 transition hover:bg-white/70 sm:border-l"
              >
                <p class="text-[10px] font-black uppercase tracking-[0.28em] text-[#d90429]">
                  {{ activeBrand.name }}
                </p>

                <h4 class="mt-3 text-2xl font-black tracking-[-0.04em]">
                  {{ model }}
                </h4>

                <p class="mt-2 text-xs text-black/45">
                  Browse compatible products
                </p>

                <span class="absolute bottom-6 right-6 text-xl text-black/25 transition group-hover:translate-x-1 group-hover:text-[#d90429]">
                  →
                </span>
              </router-link>

              <router-link
                :to="`/products?brand=${activeBrand.name}`"
                class="group relative min-h-[150px] border-b border-black/10 bg-[#111] px-6 py-6 text-white transition hover:bg-[#d90429] sm:border-l"
              >
                <p class="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">
                  All Models
                </p>

                <h4 class="mt-3 text-2xl font-black tracking-[-0.04em]">
                  View All
                </h4>

                <p class="mt-2 text-xs text-white/55">
                  See everything for {{ activeBrand.name }}
                </p>

                <span class="absolute bottom-6 right-6 text-xl text-white/50 transition group-hover:translate-x-1 group-hover:text-white">
                  →
                </span>
              </router-link>
            </div>
          </div>
        </Transition>
      </div>

      <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs font-semibold text-black/45">
          Later this becomes “My Garage”: select your car once, then Haxon shows fitment across the store.
        </p>

        <router-link
          to="/products"
          class="text-[11px] font-black uppercase tracking-[0.2em] text-[#d90429] transition hover:text-[#111]"
        >
          View all vehicles →
        </router-link>
      </div>
    </div>
  </section>
</template>