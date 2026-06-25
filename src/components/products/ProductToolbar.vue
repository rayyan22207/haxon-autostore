<script setup>
import { computed, ref } from 'vue'
import { useProductStore } from '../../stores/productStore'

const productStore = useProductStore()

const search = ref('')
const sort = ref('featured')

const totalProducts = computed(() => productStore.products.length)

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
    class="mb-8 flex flex-col gap-5 border-b border-white/10 pb-6 text-white lg:flex-row lg:items-center lg:justify-between"
  >
    <!-- Left -->
    <div>
      <p class="text-[11px] font-black uppercase tracking-[0.18em] text-white/40">
        Products
      </p>

      <h2 class="mt-2 text-2xl font-light">
        <span class="font-semibold">{{ totalProducts }}</span>
        Available
      </h2>
    </div>

    <!-- Right -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <!-- Search -->
      <div class="relative">
        <input
          v-model="search"
          type="text"
          placeholder="Search products..."
          class="h-11 w-full border border-white/10 bg-[#080808] pl-5 pr-12 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#E50914]/70 sm:w-72"
        />

        <span
          class="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-white/40"
        >
          ⌕
        </span>
      </div>

      <!-- Sort -->
      <select
        v-model="sort"
        class="h-11 border border-white/10 bg-[#080808] px-4 text-sm text-white outline-none transition focus:border-[#E50914]/70"
      >
        <option
          v-for="option in sortOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Mobile Filters -->
      <button
        class="inline-flex h-11 items-center justify-center border border-white/10 bg-[#080808] px-5 text-[11px] font-black uppercase tracking-[0.18em] transition hover:border-[#E50914] lg:hidden"
      >
        Filters
      </button>

      <!-- Future View Toggle -->
      <div
        class="hidden overflow-hidden border border-white/10 lg:flex"
      >
        <button
          class="grid h-11 w-11 place-items-center bg-[#111] text-white transition hover:bg-[#E50914]"
        >
          ⊞
        </button>

        <button
          class="grid h-11 w-11 place-items-center border-l border-white/10 text-white/40 transition hover:bg-[#111] hover:text-white"
        >
          ☰
        </button>
      </div>
    </div>
  </div>
</template>