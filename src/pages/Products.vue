<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '../stores/productStore'

import ProductBanner from '../components/products/ProductBanner.vue'
import ProductToolbar from '../components/products/ProductToolbar.vue'
import ProductFilters from '../components/products/ProductFilters.vue'
import ProductGrid from '../components/products/ProductGrid.vue'
import ProductPagination from '../components/products/ProductPagination.vue'

const productStore = useProductStore()
const route = useRoute()
const applyCarFilters = () => {
  productStore.carMake = String(route.query.make || '')
  productStore.carModel = String(route.query.model || '')
  productStore.page = 1
}

onMounted(() => {
  applyCarFilters()
  productStore.fetchProducts()
})
watch(() => route.query, applyCarFilters)
</script>

<template>
  <main class="bg-black">
    <ProductBanner />

    <section class="pb-16">
      <div
        class="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-12"
      >
        <div class="grid gap-8 lg:grid-cols-[285px_minmax(0,1fr)]">

          <aside class="sticky top-24 self-start">
            <ProductFilters />
          </aside>

          <div class="min-w-0">
            <ProductToolbar />

            <ProductGrid />

            <ProductPagination />
          </div>

        </div>
      </div>
    </section>
  </main>
</template>