<script setup>
import { computed } from 'vue'
import { useCartStore } from '../../stores/cartStore'
import { formatPrice, productBrand, productImage } from '../../lib/catalog'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const cart = useCartStore()

const price = computed(() =>
  Number(props.product.salePrice || props.product.price || 0),
)

const oldPrice = computed(() =>
  Number(props.product.compareAtPrice || props.product.oldPrice || props.product.mrp || 0),
)

const hasDiscount = computed(() =>
  oldPrice.value > price.value && price.value > 0,
)

const discountPercent = computed(() => {
  if (!hasDiscount.value) return 0
  return Math.round(((oldPrice.value - price.value) / oldPrice.value) * 100)
})

const subtitle = computed(() =>
  props.product.variant ||
  props.product.specs ||
  props.product.shortDescription ||
  props.product.fitmentNotes ||
  props.product.compatibleVehicles ||
  'Premium automotive accessory',
)

const addProduct = () => {
  cart.addToCart(props.product)
}
</script>

<template>
  <article
    class="group overflow-hidden border border-white/10 bg-[#050607] text-white transition duration-300 hover:border-white/20 hover:bg-[#08090b]"
  >
    <router-link :to="`/products/${product.id}`" class="block">
      <div
        class="relative h-[185px] overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_50%_32%,rgba(255,255,255,0.12),transparent_45%)]"
      >
        <img
          :src="productImage(product)"
          :alt="product.name"
          class="h-full w-full object-contain px-4 py-4 transition duration-500 group-hover:scale-[1.04]"
          @error="$event.target.src = '/image/products/no-image.jpeg'"
        />

        <div
          v-if="hasDiscount"
          class="absolute right-3 top-3 border border-[#E50914]/50 bg-[#E50914]/20 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white backdrop-blur"
        >
          {{ discountPercent }}% Off
        </div>
      </div>
    </router-link>

    <div class="p-4">
      <p class="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
        {{ productBrand(product) }}
      </p>

      <router-link :to="`/products/${product.id}`">
        <h3
          class="mt-2 line-clamp-2 min-h-[2.65rem] text-[16px] font-black leading-tight tracking-[-0.025em] text-white/88 transition group-hover:text-white"
        >
          {{ product.name }}
        </h3>
      </router-link>

      <p class="mt-2 line-clamp-1 text-[13px] font-medium text-white/42">
        {{ subtitle }}
      </p>

      <div class="mt-4">
        <p
          v-if="hasDiscount"
          class="mb-1 text-xs font-semibold text-white/30 line-through"
        >
          {{ formatPrice(oldPrice) }}
        </p>

        <p class="text-[17px] font-black tracking-[-0.02em] text-white">
          {{ formatPrice(price) }}
        </p>
      </div>

      <div class="mt-4 grid grid-cols-[1fr_42px] gap-2">
        <router-link
          :to="`/products/${product.id}`"
          class="grid h-10 place-items-center border border-white/10 bg-white/[0.025] text-[10px] font-black uppercase tracking-[0.14em] text-white/75 transition hover:border-white/25 hover:bg-white hover:text-black"
        >
          View Details
        </router-link>

        <button
          type="button"
          class="grid h-10 place-items-center border border-white/10 bg-white/[0.025] text-lg text-white/70 transition hover:border-[#E50914] hover:bg-[#E50914] hover:text-white"
          aria-label="Add to cart"
          @click="addProduct"
        >
          🛒
        </button>
      </div>
    </div>
  </article>
</template>