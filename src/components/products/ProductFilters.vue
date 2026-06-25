<script setup>
import { ref } from 'vue'

const selectedCategories = ref(['Lighting'])
const selectedBrands = ref([])
const selectedAvailability = ref(['Ready to Dispatch'])
const maxPrice = ref(50000)

const categories = [
  'Lighting',
  'Interior',
  'Exterior',
  'Car Care',
  'Audio',
  'Android Panels',
  'Tools',
  'Safety',
]

const brands = [
  'Haxon',
  'Auxito',
  'Osram',
  'Philips',
  'Meguiars',
  'K&N',
  'Motul',
  'Michelin',
]

const availability = [
  'Ready to Dispatch',
  'Pre Order',
  'On Request',
]

const clearFilters = () => {
  selectedCategories.value = []
  selectedBrands.value = []
  selectedAvailability.value = []
  maxPrice.value = 50000
}
</script>

<template>
  <aside class="border border-white/10 bg-[#050607] text-white">
    <div class="flex items-center justify-between border-b border-white/10 px-5 py-4">
      <div>
        <p class="text-[11px] font-black uppercase tracking-[0.22em] text-white/40">
          Refine
        </p>
        <h3 class="mt-1 text-lg font-black uppercase tracking-[0.06em]">
          Filters
        </h3>
      </div>

      <button
        class="text-[10px] font-black uppercase tracking-[0.16em] text-white/40 transition hover:text-[#E50914]"
        @click="clearFilters"
      >
        Clear
      </button>
    </div>

    <div class="divide-y divide-white/10">
      <div class="p-5">
        <p class="mb-4 text-[11px] font-black uppercase tracking-[0.18em] text-white/70">
          Category
        </p>

        <div class="space-y-3">
          <label
            v-for="category in categories"
            :key="category"
            class="group flex cursor-pointer items-center justify-between gap-4 text-sm text-white/48 transition hover:text-white"
          >
            <span>{{ category }}</span>

            <input
              v-model="selectedCategories"
              :value="category"
              type="checkbox"
              class="h-4 w-4 accent-[#E50914]"
            />
          </label>
        </div>
      </div>

      <div class="p-5">
        <p class="mb-4 text-[11px] font-black uppercase tracking-[0.18em] text-white/70">
          Brand
        </p>

        <div class="space-y-3">
          <label
            v-for="brand in brands"
            :key="brand"
            class="group flex cursor-pointer items-center justify-between gap-4 text-sm text-white/48 transition hover:text-white"
          >
            <span>{{ brand }}</span>

            <input
              v-model="selectedBrands"
              :value="brand"
              type="checkbox"
              class="h-4 w-4 accent-[#E50914]"
            />
          </label>
        </div>
      </div>

      <div class="p-5">
        <p class="mb-4 text-[11px] font-black uppercase tracking-[0.18em] text-white/70">
          Price
        </p>

        <input
          v-model="maxPrice"
          type="range"
          min="0"
          max="100000"
          step="1000"
          class="h-1 w-full accent-[#E50914]"
        />

        <div class="mt-4 flex items-center justify-between text-xs text-white/40">
          <span>PKR 0</span>
          <span>PKR {{ Number(maxPrice).toLocaleString() }}</span>
        </div>
      </div>

      <div class="p-5">
        <p class="mb-4 text-[11px] font-black uppercase tracking-[0.18em] text-white/70">
          Availability
        </p>

        <div class="space-y-3">
          <label
            v-for="item in availability"
            :key="item"
            class="group flex cursor-pointer items-center justify-between gap-4 text-sm text-white/48 transition hover:text-white"
          >
            <span>{{ item }}</span>

            <input
              v-model="selectedAvailability"
              :value="item"
              type="checkbox"
              class="h-4 w-4 accent-[#E50914]"
            />
          </label>
        </div>
      </div>
    </div>
  </aside>
</template>