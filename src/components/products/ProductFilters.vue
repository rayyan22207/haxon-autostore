<script setup>
import { computed } from 'vue'
import { useProductStore } from '../../stores/productStore'

const store = useProductStore()

const availability = [
  'Ready to Dispatch',
  'Confirm Fitment',
  'On Request',
  'Premium Import',
  'Pre Order',
]

const categories = computed(() => ['All', ...store.categories])
const brands = computed(() => ['All', ...store.brands])

const clearFilters = () => {
  store.search = ''
  store.category = 'All'
  store.brand = 'All'
  store.availability = 'All'
  store.sort = 'featured'
}
</script>

<template>
  <aside class="border border-black/10 bg-white">
    <div class="flex items-center justify-between border-b border-black/10 px-6 py-5">
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.24em] text-[#E50914]">
          Refine
        </p>

        <h3 class="mt-2 text-xl font-black uppercase tracking-[-0.03em] text-black">
          Filters
        </h3>
      </div>

      <button
        class="text-[10px] font-black uppercase tracking-[0.18em] text-black/45 transition hover:text-[#E50914]"
        @click="clearFilters"
      >
        Clear
      </button>
    </div>

    <div class="divide-y divide-black/10">
      <div class="p-6">
        <p class="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-black/55">
          Search
        </p>

        <input
          v-model="store.search"
          placeholder="Search products..."
          class="w-full border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#E50914]"
        />
      </div>

      <div class="p-6">
        <p class="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-black/55">
          Category
        </p>

        <select
          v-model="store.category"
          class="w-full border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#E50914]"
        >
          <option
            v-for="item in categories"
            :key="item"
          >
            {{ item }}
          </option>
        </select>
      </div>

      <div class="p-6">
        <p class="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-black/55">
          Brand
        </p>

        <select
          v-model="store.brand"
          class="w-full border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#E50914]"
        >
          <option
            v-for="item in brands"
            :key="item"
          >
            {{ item }}
          </option>
        </select>
      </div>

      <div class="p-6">
        <p class="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-black/55">
          Availability
        </p>

        <select
          v-model="store.availability"
          class="w-full border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#E50914]"
        >
          <option>All</option>

          <option
            v-for="item in availability"
            :key="item"
          >
            {{ item }}
          </option>
        </select>
      </div>

      <div class="p-6">
        <p class="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-black/55">
          Sort
        </p>

        <select
          v-model="store.sort"
          class="w-full border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#E50914]"
        >
          <option value="featured">
            Featured
          </option>

          <option value="newest">
            Newest
          </option>

          <option value="price-low">
            Price low to high
          </option>

          <option value="price-high">
            Price high to low
          </option>
        </select>
      </div>
    </div>
  </aside>
</template>