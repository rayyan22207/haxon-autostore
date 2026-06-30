<script setup>
import { computed } from 'vue'
import { useCartStore } from '../../stores/cartStore'
import { formatPrice, productBrand, productImage } from '../../lib/catalog'
import HaxonImage from './HaxonImage.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const cart = useCartStore()

const productUrl = computed(() => `/products/${props.product.slug || props.product.id}`)

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
    class="group relative overflow-hidden border border-black/10 bg-white text-black transition-all duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
  >
    <router-link :to="productUrl" class="block">
      <div class="relative h-[190px] overflow-hidden bg-[#f6f6f6] sm:h-[210px] lg:h-[225px]">
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(0,0,0,0.06),transparent_45%)]"
        ></div>

        <div class="absolute inset-3 flex items-center justify-center">
          <HaxonImage
            :src="productImage(product)"
            :alt="product.imageAlt || product.name"
            fit="contain"
            ratio="h-full w-full"
            img-class="p-3 transition duration-500 group-hover:scale-105"
          />
        </div>

        <div
          v-if="hasDiscount"
          class="absolute right-3 top-3 z-20 bg-[#E50914] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-white"
        >
          -{{ discountPercent }}%
        </div>
      </div>
    </router-link>

    <div class="p-4 sm:p-5">
      <p class="text-[10px] font-black uppercase tracking-[0.18em] text-black/40">
        {{ productBrand(product) }}
      </p>

      <router-link :to="productUrl">
        <h3
          class="mt-2 line-clamp-2 min-h-[2.65rem] text-[16px] font-black leading-tight tracking-[-0.025em] text-black transition group-hover:text-[#E50914]"
        >
          {{ product.name }}
        </h3>
      </router-link>

      <p class="mt-2 line-clamp-1 text-[13px] font-medium text-black/45">
        {{ subtitle }}
      </p>

      <div class="mt-5 flex items-end justify-between gap-3">
        <div>
          <p
            v-if="hasDiscount"
            class="mb-1 text-[12px] font-semibold text-black/30 line-through"
          >
            {{ formatPrice(oldPrice) }}
          </p>

          <p class="text-[18px] font-black tracking-[-0.035em] text-black">
            {{ formatPrice(price) }}
          </p>
        </div>

        <button
          type="button"
          class="grid h-11 w-11 place-items-center border border-black/10 bg-black text-white transition hover:border-[#E50914] hover:bg-[#E50914]"
          aria-label="Add to cart"
          @click.prevent="addProduct"
        >
          <svg
            viewBox="0 0 24 24"
            class="h-5 w-5"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6.5 6.5h14l-1.6 8.2H8.2L6.5 6.5Zm0 0L5.9 3.8H3.5M9.5 19.5h.01M17.5 19.5h.01"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-[#E50914] opacity-0 transition duration-300 group-hover:opacity-100"
    ></div>
  </article>
</template>