<script setup>
import { computed } from 'vue'
import { useProductStore } from '../../stores/productStore'
import ProductCard from '../ui/ProductCard.vue'

const productStore = useProductStore()

const products = computed(() => productStore.products || [])
</script>

<template>
  <div>
    <div
      v-if="products.length"
      class="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>

    <div
      v-else
      class="border border-white/10 bg-[#050607] px-6 py-16 text-center text-white"
    >
      <p class="text-[11px] font-black uppercase tracking-[0.22em] text-white/40">
        No Products
      </p>

      <h3 class="mt-3 text-2xl font-light">
        Nothing found yet.
      </h3>

      <p class="mx-auto mt-4 max-w-md text-sm leading-6 text-white/45">
        Products will appear here once they are added. For now, Haxon is keeping the shelves mysterious like a luxury villain.
      </p>
    </div>
  </div>
</template>