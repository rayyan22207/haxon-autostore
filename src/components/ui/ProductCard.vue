<script setup>
import { computed } from 'vue'
import { useCartStore } from '../../stores/cartStore'
import { formatPrice, productBrand, productImage, productMode } from '../../lib/catalog'
const props = defineProps({ product: { type: Object, required: true } })
const cart = useCartStore()
const price = computed(() => Number(props.product.salePrice || props.product.price || 0))
const badge = computed(() => productMode(props.product))
</script>
<template>
  <article class="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#11151B] text-[#F5F5F2] shadow-2xl shadow-black/20 transition duration-500 hover:-translate-y-1 hover:border-cyan-100/25">
    <router-link :to="`/products/${product.id}`" class="block">
      <div class="relative aspect-[4/3] overflow-hidden bg-[#0B0D10]">
        <img :src="productImage(product)" :alt="product.name" class="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105" @error="$event.target.src='/image/products/no-image.jpeg'" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <span class="absolute left-4 top-4 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.2em] backdrop-blur">{{ badge }}</span>
      </div>
    </router-link>
    <div class="p-5">
      <p class="text-[10px] font-bold uppercase tracking-[.28em] text-[#A5A7AA]">{{ productBrand(product) }} · {{ product.category || 'Accessory' }}</p>
      <h3 class="mt-2 min-h-14 text-xl font-black leading-tight">{{ product.name }}</h3>
      <p class="mt-2 line-clamp-1 text-sm text-[#A5A7AA]">{{ product.fitmentNotes || product.compatibleVehicles || product.carModel || 'Universal / confirm fitment' }}</p>
      <div class="mt-5 flex items-center justify-between gap-3">
        <p class="text-2xl font-black">{{ formatPrice(price) }}</p>
        <button class="rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] hover:bg-white hover:text-[#0B0D10]" @click="cart.addToCart(product)">Add</button>
      </div>
      <router-link :to="`/products/${product.id}`" class="mt-4 flex justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold uppercase tracking-[.16em] text-[#A5A7AA] hover:text-white">View details <span>→</span></router-link>
    </div>
  </article>
</template>
