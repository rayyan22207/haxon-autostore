<script setup>
import { computed } from 'vue'
import { useProductStore } from '../../stores/productStore'

const productStore = useProductStore()

const totalProducts = computed(() => productStore.filteredProducts.length)

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Alphabetical' },
]
</script>

<template>
  <div
    class="mb-10 flex flex-col gap-6 border-b border-black/10 pb-6 lg:flex-row lg:items-end lg:justify-between"
  >
    <div>
      <p class="text-[10px] font-black uppercase tracking-[0.24em] text-[#E50914]">
        Collection
      </p>

      <h2 class="mt-2 text-3xl font-black tracking-[-0.04em] text-black">
        {{ totalProducts }}
        <span class="font-light text-black/55">
          Products
        </span>
      </h2>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="relative">
        <input
          v-model="productStore.search"
          type="text"
          placeholder="Search products..."
          class="h-12 w-full border border-black/10 bg-white pl-5 pr-12 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-[#E50914] sm:w-80"
        />

        <span
          class="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-black/35"
        >
          ⌕
        </span>
      </div>

      <select
        v-model="productStore.sort"
        class="h-12 border border-black/10 bg-white px-5 text-sm text-black outline-none transition focus:border-[#E50914]"
      >
        <option
          v-for="option in sortOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <button
        class="inline-flex h-12 items-center justify-center border border-black/10 bg-white px-5 text-[10px] font-black uppercase tracking-[0.18em] text-black transition hover:border-[#E50914] lg:hidden"
      >
        Filters
      </button>
    </div>
  </div>
</template>