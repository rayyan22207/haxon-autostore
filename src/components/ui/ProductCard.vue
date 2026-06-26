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
    class="group relative overflow-hidden border border-white/10 bg-[#050607] text-white transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-[#08090b]"
  >
    <router-link :to="`/products/${product.id}`" class="block">
      <div
        class="relative h-[168px] overflow-hidden border-b border-white/10 bg-[#07080a] sm:h-[178px] lg:h-[188px]"
      >
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.12),transparent_48%)]"
        ></div>

        <div
          class="absolute inset-x-6 bottom-3 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60"
        ></div>

        <div class="absolute inset-1 flex items-center justify-center">
  <HaxonImage :src="productImage(product)" :alt="product.imageAlt || product.name" fit="contain" ratio="h-full w-full" img-class="p-2" />
</div>

        <div
          v-if="hasDiscount"
          class="absolute right-3 top-3 z-20 border border-[#E50914]/50 bg-[#E50914]/20 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.13em] text-white backdrop-blur"
        >
          -{{ discountPercent }}%
        </div>
      </div>
    </router-link>

    <div class="p-3.5 sm:p-4">
      <p class="text-[10px] font-black uppercase tracking-[0.16em] text-white/42">
        {{ productBrand(product) }}
      </p>

      <router-link :to="`/products/${product.id}`">
        <h3
          class="mt-2 line-clamp-2 min-h-[2.45rem] text-[15px] font-black leading-tight tracking-[-0.02em] text-white/88 transition group-hover:text-white sm:text-[16px] sm:min-h-[2.65rem]"
        >
          {{ product.name }}
        </h3>
      </router-link>

      <p class="mt-1.5 line-clamp-1 text-[12px] font-medium text-white/40 sm:text-[13px]">
        {{ subtitle }}
      </p>

      <div class="mt-3.5 flex min-h-[2.6rem] flex-col justify-end">
        <p
          v-if="hasDiscount"
          class="mb-0.5 text-[11px] font-semibold text-white/28 line-through"
        >
          {{ formatPrice(oldPrice) }}
        </p>

        <p class="text-[16px] font-black tracking-[-0.02em] text-white sm:text-[17px]">
          {{ formatPrice(price) }}
        </p>
      </div>

      <div class="mt-3.5 grid grid-cols-[1fr_40px] gap-2">
        <router-link
          :to="`/products/${product.id}`"
          class="grid h-10 place-items-center border border-white/10 bg-white/[0.025] text-[10px] font-black uppercase tracking-[0.13em] text-white/72 transition hover:border-white/25 hover:bg-white hover:text-black"
        >
          View Details
        </router-link>

        <button
          type="button"
          class="grid h-10 place-items-center border border-white/10 bg-white/[0.025] text-white/68 transition hover:border-[#E50914] hover:bg-[#E50914] hover:text-white"
          aria-label="Add to cart"
          @click="addProduct"
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
      class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E50914]/60 to-transparent opacity-0 transition group-hover:opacity-100"
    ></div>
  </article>
</template>