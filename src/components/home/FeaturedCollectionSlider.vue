<script setup>
import { computed, ref } from 'vue'
import { useProductStore } from '../../stores/productStore'

const productStore = useProductStore()
const track = ref(null)

const products = computed(() => {
  const featured = productStore.products.filter((p) => p.featured || p.isFeatured)
  return (featured.length ? featured : productStore.products).slice(0, 12)
})

const formatPrice = (price) => {
  if (!price) return 'Price on request'

  return `PKR ${Number(price).toLocaleString()}`
}

const productImage = (product) => {
  return product.image || product.imageUrl || product.images?.[0] || '/images/products/placeholder.png'
}

const scrollProducts = (direction) => {
  if (!track.value) return

  track.value.scrollBy({
    left: direction * 330,
    behavior: 'smooth',
  })
}
</script>

<template>
  <section class="relative overflow-hidden bg-black py-10 text-white">
    <div class="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
      <div class="relative border border-white/10 bg-[#050607]">
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.06),transparent_34%),radial-gradient(circle_at_80%_100%,rgba(229,9,20,0.08),transparent_35%)]"
        ></div>

        <div class="relative flex items-center justify-between gap-4 px-6 py-5">
          <div>
            <div class="mb-3 h-1 w-8 bg-[#E50914]"></div>

            <h2 class="text-2xl font-black uppercase tracking-[0.05em]">
              The Haxon Selection
            </h2>
          </div>

          <router-link
            to="/products"
            class="group hidden items-center gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/45 transition hover:text-white sm:inline-flex"
          >
            View All Products
            <span class="text-[#E50914] transition group-hover:translate-x-1">→</span>
          </router-link>
        </div>

        <div class="relative">
          <button
            class="absolute left-[-1px] top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center border border-white/10 bg-black/75 text-2xl text-white/50 backdrop-blur-xl transition hover:border-white/25 hover:text-white"
            aria-label="Scroll products left"
            @click="scrollProducts(-1)"
          >
            ‹
          </button>

          <div
            ref="track"
            class="featured-products-track flex overflow-x-auto scroll-smooth"
          >
            <router-link
              v-for="product in products"
              :key="product.id"
              :to="`/products/${product.slug || product.id}`"
              class="group relative min-h-[330px] min-w-[285px] border-r border-white/10 px-7 py-6 transition hover:bg-white/[0.035]"
            >
              <div class="flex h-[165px] items-center justify-center">
                <img
                  :src="productImage(product)"
                  :alt="product.name"
                  class="max-h-[150px] w-full object-contain opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                />
              </div>

              <div class="mt-5">
                <p
                  v-if="product.brand"
                  class="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/35"
                >
                  {{ product.brand }}
                </p>

                <h3 class="max-w-[13rem] text-base font-semibold leading-6 text-white/72 transition group-hover:text-white">
                  {{ product.name }}
                </h3>

                <p class="mt-3 text-sm font-black uppercase tracking-[0.06em] text-white/60">
                  {{ formatPrice(product.price || product.salePrice) }}
                </p>
              </div>
            </router-link>
          </div>

          <button
            class="absolute right-[-1px] top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center border border-white/10 bg-black/75 text-2xl text-white/50 backdrop-blur-xl transition hover:border-white/25 hover:text-white"
            aria-label="Scroll products right"
            @click="scrollProducts(1)"
          >
            ›
          </button>
        </div>

        <div class="relative flex items-center justify-center gap-3 px-6 py-4">
          <span class="h-[2px] w-8 bg-[#E50914]"></span>
          <span class="h-[2px] w-12 bg-white/20"></span>
          <span class="h-[2px] w-12 bg-white/20"></span>
          <span class="h-[2px] w-8 bg-white/20"></span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.featured-products-track {
  scrollbar-width: none;
}

.featured-products-track::-webkit-scrollbar {
  display: none;
}
</style>