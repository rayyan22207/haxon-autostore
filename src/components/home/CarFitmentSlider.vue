<script setup>
import { computed, onMounted, ref } from 'vue'
import { useContentStore } from '../../stores/contentStore'
import { useProductStore } from '../../stores/productStore'
import { countProductsForCar } from '../../lib/cmsUtils'

const track = ref(null)

const contentStore = useContentStore()
const productStore = useProductStore()

const cars = computed(() =>
  contentStore.featuredCars.map((car) => ({
    ...car,
    products: `${countProductsForCar(productStore.products, car)} Products`,
    link:
      car.link ||
      `/products?make=${encodeURIComponent(car.manufacturer || car.make || '')}&model=${encodeURIComponent(car.model || car.name || '')}`,
  })),
)

onMounted(() => {
  contentStore.loadStorefrontContent()
  productStore.fetchProducts()
})
</script>

<template>
  <section class="relative overflow-hidden bg-black text-white">
    <div class="flex items-center justify-between px-5 pb-4 pt-8 sm:px-8 lg:px-12">
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">
          Built for your drive
        </p>

        <h2 class="mt-2 text-xl font-black uppercase tracking-[-0.03em] text-white sm:text-2xl">
          Shop By Car
        </h2>
      </div>

      <router-link
        to="/cars"
        class="group hidden items-center gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/55 transition hover:text-white sm:inline-flex"
      >
        View All Vehicles
        <span class="text-[#E50914] transition group-hover:translate-x-1">→</span>
      </router-link>
    </div>

    <div
      ref="track"
      class="car-fitment-track flex overflow-x-auto scroll-smooth px-5 pb-8 sm:px-8 lg:px-12"
    >
      <router-link
        v-for="car in cars"
        :key="car.id || car.slug"
        :to="car.link"
        class="group relative min-w-[190px] px-3 py-4 transition sm:min-w-[230px] lg:min-w-[245px]"
      >
        <div class="flex h-[105px] items-center justify-center">
          <img
            :src="car.thumbnail || car.heroImage"
            :alt="`${car.manufacturer} ${car.model}`"
            class="max-h-[95px] w-full object-contain opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        </div>

        <div class="mt-3">
          <p class="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
            {{ car.manufacturer }}
          </p>

          <h3 class="mt-1 text-sm font-black uppercase tracking-[-0.02em] text-white">
            {{ car.model }}
          </h3>
        </div>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.car-fitment-track {
  scrollbar-width: none;
}

.car-fitment-track::-webkit-scrollbar {
  display: none;
}
</style>