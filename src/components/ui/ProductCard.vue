<script setup>
import { computed } from 'vue'
import { useCartStore } from '../../stores/cartStore'
import { formatPrice, productBrand, productImage, productMode } from '../../lib/catalog'
const props = defineProps({ product: { type: Object, required: true } })
const cart = useCartStore()
const price = computed(() => Number(props.product.salePrice || props.product.price || 0))
const badge = computed(() => productMode(props.product))
const word = computed(() => String(props.product.category || 'HAXON').split(' ')[0].toUpperCase())
</script>
<template>
  <article class="model-card group text-[#F5F2EA]">
    <router-link :to="`/products/${product.id}`" class="block p-3">
      <div class="image-stage aspect-[1.14/1] rounded-[1.6rem]">
        <div class="oversized-word left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 !text-[4.3rem] sm:!text-[5.4rem]">{{ word }}</div>
        <img :src="productImage(product)" :alt="product.name" class="relative z-10 h-full w-full object-contain p-6 transition duration-700 group-hover:scale-105" @error="$event.target.src='/image/products/no-image.jpeg'" />
        <span class="absolute left-4 top-4 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[10px] font-black uppercase tracking-[.2em] backdrop-blur">{{ badge }}</span>
      </div>
    </router-link>
    <div class="px-5 pb-5 pt-2">
      <p class="spec-cell-label">{{ productBrand(product) }} · {{ product.category || 'Accessory' }}</p>
      <h3 class="mt-2 min-h-14 text-xl font-black leading-tight tracking-[-.03em]">{{ product.name }}</h3>
      <p class="mt-2 line-clamp-1 text-sm text-haxon-muted">{{ product.fitmentNotes || product.compatibleVehicles || product.carModel || 'Universal / confirm fitment' }}</p>
      <div class="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <p class="text-2xl font-black">{{ formatPrice(price) }}</p>
        <div class="flex gap-2"><button class="rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.16em] hover:bg-white hover:text-[#0B0D10]" @click="cart.addToCart(product)">Add</button><router-link :to="`/products/${product.id}`" class="grid h-9 w-9 place-items-center rounded-full border border-white/10 hover:bg-white hover:text-black">→</router-link></div>
      </div>
    </div>
  </article>
</template>
