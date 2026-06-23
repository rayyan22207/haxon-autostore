<script setup>
import { computed, onMounted } from 'vue'
import { useProductStore } from '../../stores/productStore'
import ProductCard from '../ui/ProductCard.vue'

const productStore = useProductStore()

onMounted(() => {
  if (!productStore.products.length) {
    productStore.fetchProducts()
  }
})

const featuredProducts = computed(() =>
  productStore.products
    .filter(
      product =>
        product.featured === true ||
        product.isFeatured === true
    )
    .filter(
      product =>
        product.active !== false &&
        product.isActive !== false
    )
    .slice(0, 8)
)
</script>

<template>
  <section class="relative overflow-hidden bg-[#030303] py-12 text-white sm:py-14 lg:py-16">
    <!-- Soft red glow -->
    <div class="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-[#d90429]/20 blur-[120px]"></div>

    <!-- Subtle grid -->
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.025]"
      style="
        background-image:
          linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px);
        background-size: 44px 44px;
      "
    ></div>

    <!-- Top shine -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

    <div class="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 flex flex-col gap-6 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-3xl">
          <div class="mb-4 flex items-center gap-3">
            <span class="h-px w-8 bg-[#d90429]"></span>

            <p class="text-[10px] font-black uppercase tracking-[0.32em] text-white/45">
              Featured Collection
            </p>
          </div>

          <h2 class="text-4xl font-black leading-[0.9] tracking-[-0.06em] sm:text-5xl lg:text-6xl">
            Built to make
            <span class="text-[#d90429]">everyday</span>
            drives sharper.
          </h2>

          <p class="mt-4 max-w-xl text-sm leading-6 text-white/55">
            Clean upgrades, useful accessories, and small details that make the car feel properly finished.
          </p>
        </div>

        <router-link
          to="/products"
          class="group inline-flex w-fit items-center rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/75 transition duration-300 hover:border-[#d90429]/70 hover:bg-[#d90429] hover:text-white"
        >
          View all
          <span class="ml-3 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </router-link>
      </div>

      <!-- Products -->
      <div
        v-if="featuredProducts.length"
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <ProductCard
          v-for="product in featuredProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Empty -->
      <div
        v-else
        class="rounded-2xl border border-white/10 bg-white/[0.035] px-6 py-12 text-center shadow-2xl shadow-black/30 backdrop-blur"
      >
        <p class="text-[10px] font-black uppercase tracking-[0.32em] text-[#d90429]">
          Empty Garage
        </p>

        <h3 class="mt-3 text-3xl font-black tracking-[-0.05em]">
          No featured products yet.
        </h3>

        <p class="mx-auto mt-3 max-w-md text-sm leading-6 text-white/50">
          Mark products as featured from the admin panel and they’ll appear here.
        </p>
      </div>
    </div>
  </section>
</template>