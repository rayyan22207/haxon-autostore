<script setup>
import { onMounted } from 'vue'
import CinematicHero from '../components/home/CinematicHero.vue'
import CategorySlider from '../components/home/CategorySlider.vue'
import CarFitmentSlider from '../components/home/CarFitmentSlider.vue'
import HaxonStandardSection from '../components/home/HaxonStandardSection.vue'
import BrandBar from '../components/home/BrandBar.vue'
import FeaturedCollectionSlider from '../components/home/FeaturedCollectionSlider.vue'
import { useProductStore } from '../stores/productStore'
import TrustBar from '../components/home/TrustBar.vue'

const productStore = useProductStore()

onMounted(() => {
  productStore.fetchProducts()
})
</script>

<template>
  <main class="storefront-page bg-black">
    <CinematicHero />
    <CategorySlider />
    <CarFitmentSlider />
    <HaxonStandardSection />
    <BrandBar />
    <FeaturedCollectionSlider />
    <TrustBar />
  </main>
</template>