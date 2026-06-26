<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '../stores/productStore'
import { useCartStore } from '../stores/cartStore'
import ProductCard from '../components/ui/ProductCard.vue'
import HaxonImage from '../components/ui/HaxonImage.vue'
import { useSeo } from '../composables/useSeo'
import {
  FALLBACK_IMAGE,
  formatPrice,
  productBrand,
  productImage,
  productMode,
} from '../lib/catalog'

const route = useRoute()
const store = useProductStore()
const cart = useCartStore()

const selected = ref('')

const product = computed(() =>
  store.products.find((p) => p.id === route.params.id || p.slug === route.params.id),
)

const images = computed(() => {
  if (!product.value) return [FALLBACK_IMAGE]

  const list = [
    product.value.mainImage,
    product.value.cardImage,
    product.value.bannerImage,
    ...(product.value.galleryImages || []),
    ...(product.value.images || []),
    product.value.image,
    product.value.imageUrl,
  ].filter(Boolean)

  return list.length ? [...new Set(list)] : [FALLBACK_IMAGE]
})

const price = computed(() =>
  Number(product.value?.salePrice || product.value?.price || 0),
)

const oldPrice = computed(() =>
  Number(product.value?.compareAtPrice || product.value?.oldPrice || product.value?.mrp || 0),
)

const hasDiscount = computed(() =>
  oldPrice.value > price.value && price.value > 0,
)

const discountPercent = computed(() => {
  if (!hasDiscount.value) return 0
  return Math.round(((oldPrice.value - price.value) / oldPrice.value) * 100)
})

const fitment = computed(() =>
  product.value?.fitmentNotes ||
  product.value?.compatibleVehicles ||
  product.value?.carModel ||
  'Please confirm vehicle year, variant, and trim before dispatch.',
)

const specifications = computed(() => {
  const specs = product.value?.specifications

  if (!specs) return []

  if (Array.isArray(specs)) {
    return specs.map((item) => ({
      label: item.label || item.name || 'Specification',
      value: item.value || item.text || item,
    }))
  }

  if (typeof specs === 'object') {
    return Object.entries(specs).map(([label, value]) => ({
      label,
      value,
    }))
  }

  return [{ label: 'Details', value: specs }]
})

const related = computed(() =>
  store.products
    .filter(
      (p) =>
        product.value &&
        p.id !== product.value.id &&
        (p.category === product.value.category ||
          productBrand(p) === productBrand(product.value)),
    )
    .slice(0, 4),
)

const whatsapp = computed(() =>
  `https://wa.me/923263972241?text=${encodeURIComponent(
    `Hi Haxon, please confirm fitment for ${product.value?.name || 'this product'}.`,
  )}`,
)

const addProduct = () => {
  if (!product.value) return
  cart.addToCart(product.value)
}

watch(
  images,
  (list) => {
    selected.value = list[0] || FALLBACK_IMAGE
  },
  { immediate: true },
)

onMounted(async () => {
  if (!store.products.length) {
    await store.fetchProducts()
  }

  selected.value = productImage(product.value) || images.value[0]
  if (product.value) useSeo({ title: product.value.name, description: product.value.shortDescription || product.value.description, image: productImage(product.value), schema: { '@context':'https://schema.org', '@type':'Product', name: product.value.name, brand: productBrand(product.value), image: images.value, description: product.value.description || product.value.shortDescription, sku: product.value.sku, offers: { '@type':'Offer', priceCurrency:'PKR', price: price.value, availability: product.value.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder' } } })
})
</script>

<template>
  <main class="min-h-screen bg-black pt-[74px] text-white">
    <section v-if="product" class="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-12">
      <router-link
        to="/products"
        class="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.18em] text-white/45 transition hover:text-white"
      >
        ← Back to collection
      </router-link>

      <div class="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1.06fr)_minmax(420px,0.94fr)]">
        <div class="min-w-0">
          <div class="relative overflow-hidden border border-white/10 bg-[#050607]">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(255,255,255,0.12),transparent_48%)]"></div>

            <p
              class="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 text-[clamp(6rem,14vw,14rem)] font-black uppercase leading-none tracking-[-0.08em] text-white/[0.025] md:block"
            >
              Detail
            </p>

            <div class="relative flex aspect-square items-center justify-center">
              <HaxonImage :src="selected || images[0]" :alt="product.imageAlt || product.name" fit="contain" ratio="h-[92%] w-[92%]" />
            </div>
          </div>

          <div
            v-if="images.length > 1"
            class="mt-3 grid grid-cols-5 gap-3 sm:grid-cols-6"
          >
            <button
              v-for="image in images"
              :key="image"
              type="button"
              class="group relative aspect-square overflow-hidden border bg-[#050607] transition"
              :class="selected === image ? 'border-[#E50914]' : 'border-white/10 hover:border-white/25'"
              @click="selected = image"
            >
              <HaxonImage :src="image" :alt="product.imageAlt || product.name" fit="contain" ratio="h-full w-full" img-class="p-2 opacity-80 group-hover:opacity-100" />
            </button>
          </div>
        </div>

        <aside class="self-start border border-white/10 bg-[#050607] lg:sticky lg:top-24">
          <div class="border-b border-white/10 p-6 sm:p-7">
            <p class="text-[11px] font-black uppercase tracking-[0.22em] text-white/45">
              {{ productBrand(product) }} · {{ product.category || 'Accessory' }}
            </p>

            <h1 class="mt-4 text-[clamp(2.2rem,4vw,4.7rem)] font-black leading-[0.95] tracking-[-0.055em]">
              {{ product.name }}
            </h1>

            <div class="mt-5 flex flex-wrap gap-2">
              <span
                class="border border-white/10 bg-white/[0.035] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/65"
              >
                {{ productMode(product) }}
              </span>

              <span
                v-if="product.stock !== undefined"
                class="border border-white/10 bg-white/[0.035] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/65"
              >
                Stock {{ product.stock }}
              </span>

              <span
                v-if="hasDiscount"
                class="border border-[#E50914]/50 bg-[#E50914]/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white"
              >
                {{ discountPercent }}% Off
              </span>
            </div>

            <div class="mt-7">
              <p
                v-if="hasDiscount"
                class="mb-1 text-sm font-semibold text-white/30 line-through"
              >
                {{ formatPrice(oldPrice) }}
              </p>

              <p class="text-4xl font-black tracking-[-0.05em]">
                {{ formatPrice(price) }}
              </p>
            </div>

            <p class="mt-6 text-base leading-7 text-white/52">
              {{ product.shortDescription || product.description || 'Premium automotive accessory curated by Haxon Autostore.' }}
            </p>

            <div class="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
              <button
                type="button"
                class="h-12 bg-white px-7 text-[11px] font-black uppercase tracking-[0.18em] text-black transition hover:bg-[#E50914] hover:text-white"
                @click="addProduct"
              >
                Add to cart
              </button>

              <a
                :href="whatsapp"
                target="_blank"
                class="grid h-12 place-items-center border border-white/10 px-7 text-[11px] font-black uppercase tracking-[0.18em] text-white/72 transition hover:border-white/25 hover:text-white"
              >
                Confirm fitment
              </a>
            </div>
          </div>

          <div class="divide-y divide-white/10">
            <div class="p-6 sm:p-7">
              <p class="text-[11px] font-black uppercase tracking-[0.2em] text-white/45">
                Fitment
              </p>

              <p class="mt-3 text-sm leading-7 text-white/55">
                {{ fitment }}
              </p>
            </div>

            <div class="p-6 sm:p-7">
              <p class="text-[11px] font-black uppercase tracking-[0.2em] text-white/45">
                Specifications
              </p>

              <div
                v-if="specifications.length"
                class="mt-4 grid gap-3"
              >
                <div
                  v-for="spec in specifications"
                  :key="spec.label"
                  class="grid grid-cols-[0.8fr_1fr] gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0"
                >
                  <p class="text-xs font-black uppercase tracking-[0.14em] text-white/35">
                    {{ spec.label }}
                  </p>

                  <p class="text-sm text-white/62">
                    {{ spec.value }}
                  </p>
                </div>
              </div>

              <p
                v-else
                class="mt-3 text-sm leading-7 text-white/45"
              >
                Specifications will be confirmed by Haxon support.
              </p>
            </div>

            <div class="grid grid-cols-3 divide-x divide-white/10">
              <div class="p-5">
                <p class="text-[10px] font-black uppercase tracking-[0.15em] text-white/72">
                  Curated
                </p>
                <p class="mt-2 text-xs text-white/38">
                  Selected stock
                </p>
              </div>

              <div class="p-5">
                <p class="text-[10px] font-black uppercase tracking-[0.15em] text-white/72">
                  Checked
                </p>
                <p class="mt-2 text-xs text-white/38">
                  Fitment first
                </p>
              </div>

              <div class="p-5">
                <p class="text-[10px] font-black uppercase tracking-[0.15em] text-white/72">
                  Support
                </p>
                <p class="mt-2 text-xs text-white/38">
                  WhatsApp help
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section v-if="related.length" class="mt-16 border-t border-white/10 pt-9">
        <div class="mb-7 flex items-end justify-between gap-4">
          <div>
            <p class="text-[11px] font-black uppercase tracking-[0.22em] text-white/40">
              Continue browsing
            </p>

            <h2 class="mt-2 text-3xl font-black uppercase tracking-[-0.04em]">
              Related products
            </h2>
          </div>

          <router-link
            to="/products"
            class="hidden text-[11px] font-black uppercase tracking-[0.18em] text-white/45 transition hover:text-white sm:block"
          >
            View all →
          </router-link>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <ProductCard
            v-for="item in related"
            :key="item.id"
            :product="item"
          />
        </div>
      </section>
    </section>

    <section
      v-else
      class="mx-auto max-w-[1500px] px-5 py-24 text-center sm:px-8 lg:px-12"
    >
      <p class="text-[11px] font-black uppercase tracking-[0.22em] text-white/40">
        Product not found
      </p>

      <h1 class="mt-4 text-4xl font-black tracking-[-0.05em]">
        This product does not exist.
      </h1>

      <router-link
        to="/products"
        class="mt-8 inline-flex h-12 items-center border border-white/10 px-7 text-[11px] font-black uppercase tracking-[0.18em] text-white/70 transition hover:bg-white hover:text-black"
      >
        Back to products
      </router-link>
    </section>
  </main>
</template>