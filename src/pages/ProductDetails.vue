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

const compatibility = computed(() => {
  const p = product.value || {}

  if (p.universalFitment || p.compatibilityType === 'universal') {
    return 'Universal fitment'
  }

  const parts = [
    ...(p.compatibleMakes || []),
    ...(p.compatibleModels || []),
    ...(p.compatibleYears || []),
    ...(p.compatibleVariants || []),
  ]

  return parts.length
    ? parts.join(' · ')
    : p.fitmentNotes ||
        p.compatibleVehicles ||
        p.carModel ||
        'Please confirm vehicle year, variant, and trim before dispatch.'
})

const fitment = computed(() =>
  product.value?.fitmentNotes || compatibility.value,
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

  if (product.value) {
    useSeo({
      title: product.value.name,
      description: product.value.shortDescription || product.value.description,
      image: productImage(product.value),
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.value.name,
        brand: productBrand(product.value),
        image: images.value,
        description: product.value.description || product.value.shortDescription,
        sku: product.value.sku,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'PKR',
          price: price.value,
          availability:
            product.value.stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/PreOrder',
        },
      },
    })
  }
})
</script>

<template>
  <main class="min-h-screen bg-[#f4f4f2] pt-[74px] text-black">
    <section
      v-if="product"
      class="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-12"
    >
      <router-link
        to="/products"
        class="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.18em] text-black/45 transition hover:text-black"
      >
        ← Back to collection
      </router-link>

      <div class="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(410px,0.92fr)]">
        <div class="min-w-0">
          <div class="relative overflow-hidden bg-[#e9e9e6]">
            <div class="relative flex aspect-square items-center justify-center">
              <Transition name="fade" mode="out-in">
                <HaxonImage
                  :key="selected"
                  :src="selected || images[0]"
                  :alt="product.imageAlt || product.name"
                  fit="contain"
                  ratio="h-[90%] w-[90%]"
                  img-class="p-4"
                />
              </Transition>
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
              class="group relative aspect-square overflow-hidden border bg-[#e9e9e6] transition"
              :class="
                selected === image
                  ? 'border-[#E50914]'
                  : 'border-black/10 hover:border-black/30'
              "
              @click="selected = image"
            >
              <HaxonImage
                :src="image"
                :alt="product.imageAlt || product.name"
                fit="contain"
                ratio="h-full w-full"
                img-class="p-2 opacity-80 transition group-hover:opacity-100"
              />
            </button>
          </div>
        </div>

        <aside class="self-start bg-white lg:sticky lg:top-24">
          <div class="p-6 sm:p-8">
            <p class="text-[10px] font-black uppercase tracking-[0.24em] text-black/45">
              {{ productBrand(product) }} · {{ product.category || 'Accessory' }}
            </p>

            <h1 class="mt-4 text-[clamp(2.3rem,4vw,4.8rem)] font-black leading-[0.92] tracking-[-0.065em] text-black">
              {{ product.name }}
            </h1>

            <div class="mt-5 flex flex-wrap gap-2">
              <span class="border border-black/10 bg-black/[0.025] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-black/60">
                {{ productMode(product) }}
              </span>

              <span
                v-if="product.stock !== undefined"
                class="border border-black/10 bg-black/[0.025] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-black/60"
              >
                Stock {{ product.stock }}
              </span>

              <span
                v-if="hasDiscount"
                class="bg-[#E50914] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white"
              >
                {{ discountPercent }}% Off
              </span>
            </div>

            <div class="mt-8">
              <p
                v-if="hasDiscount"
                class="mb-1 text-sm font-semibold text-black/30 line-through"
              >
                {{ formatPrice(oldPrice) }}
              </p>

              <p class="text-4xl font-black tracking-[-0.055em] text-black">
                {{ formatPrice(price) }}
              </p>
            </div>

            <p class="mt-6 text-base leading-8 text-black/55">
              {{
                product.shortDescription ||
                product.description ||
                'Premium automotive accessory curated by Haxon Autostore.'
              }}
            </p>

            <div class="mt-8">
              <button
                type="button"
                class="h-13 w-full bg-black px-7 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#E50914]"
                @click="addProduct"
              >
                Add to cart
              </button>

              <a
                :href="whatsapp"
                target="_blank"
                class="mt-5 inline-flex text-[11px] font-black uppercase tracking-[0.18em] text-black/50 transition hover:text-[#E50914]"
              >
                Need fitment help? WhatsApp us →
              </a>
            </div>
          </div>

          <div class="border-t border-black/10 px-6 py-6 sm:px-8">
            <p class="text-[10px] font-black uppercase tracking-[0.22em] text-[#E50914]">
              Fitment
            </p>

            <p class="mt-3 text-sm leading-7 text-black/55">
              {{ fitment }}
            </p>
          </div>

          <div class="border-t border-black/10 px-6 py-6 sm:px-8">
            <p class="text-[10px] font-black uppercase tracking-[0.22em] text-[#E50914]">
              Specifications
            </p>

            <div
              v-if="specifications.length"
              class="mt-4 grid gap-3"
            >
              <div
                v-for="spec in specifications"
                :key="spec.label"
                class="grid grid-cols-[0.8fr_1fr] gap-4 border-b border-black/10 pb-3 last:border-b-0 last:pb-0"
              >
                <p class="text-xs font-black uppercase tracking-[0.14em] text-black/35">
                  {{ spec.label }}
                </p>

                <p class="text-sm text-black/62">
                  {{ spec.value }}
                </p>
              </div>
            </div>

            <p
              v-else
              class="mt-3 text-sm leading-7 text-black/45"
            >
              Specifications will be confirmed by Haxon support.
            </p>
          </div>

          <div class="grid grid-cols-3 divide-x divide-black/10 border-t border-black/10">
            <div class="p-5">
              <p class="text-[10px] font-black uppercase tracking-[0.15em] text-black/72">
                Curated
              </p>
              <p class="mt-2 text-xs text-black/38">
                Selected stock
              </p>
            </div>

            <div class="p-5">
              <p class="text-[10px] font-black uppercase tracking-[0.15em] text-black/72">
                Checked
              </p>
              <p class="mt-2 text-xs text-black/38">
                Fitment first
              </p>
            </div>

            <div class="p-5">
              <p class="text-[10px] font-black uppercase tracking-[0.15em] text-black/72">
                Support
              </p>
              <p class="mt-2 text-xs text-black/38">
                WhatsApp help
              </p>
            </div>
          </div>
        </aside>
      </div>

      <!-- <section class="mt-14 bg-white px-6 py-8 sm:px-8 lg:px-10">
        <div class="grid gap-10 lg:grid-cols-2">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.22em] text-[#E50914]">
              Description
            </p>

            <p class="mt-4 whitespace-pre-line text-sm leading-8 text-black/58">
              {{ product.description || product.shortDescription || 'Full product details will be added soon.' }}
            </p>
          </div>

          <div v-if="product.features?.length">
            <p class="text-[10px] font-black uppercase tracking-[0.22em] text-[#E50914]">
              Features
            </p>

            <ul class="mt-4 grid gap-3 text-sm leading-7 text-black/58">
              <li
                v-for="feature in product.features"
                :key="feature"
              >
                — {{ feature }}
              </li>
            </ul>
          </div>

          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.22em] text-[#E50914]">
              Compatibility
            </p>

            <p class="mt-4 text-sm leading-8 text-black/58">
              {{ compatibility }}
            </p>
          </div>

          <div v-if="product.installationNotes || product.warranty || product.shippingInformation">
            <p class="text-[10px] font-black uppercase tracking-[0.22em] text-[#E50914]">
              Installation, Warranty & Shipping
            </p>

            <div class="mt-4 space-y-3 text-sm leading-8 text-black/58">
              <p v-if="product.installationNotes">
                <b class="text-black">Installation:</b> {{ product.installationNotes }}
              </p>

              <p v-if="product.warranty">
                <b class="text-black">Warranty:</b> {{ product.warranty }}
              </p>

              <p v-if="product.shippingInformation">
                <b class="text-black">Shipping:</b> {{ product.shippingInformation }}
              </p>
            </div>
          </div>

          <div
            v-if="product.packageContents?.length || product.downloads?.length || product.youtubeVideo"
            class="lg:col-span-2 border-t border-black/10 pt-8"
          >
            <p class="text-[10px] font-black uppercase tracking-[0.22em] text-[#E50914]">
              Resources
            </p>

            <ul
              v-if="product.packageContents?.length"
              class="mt-4 grid gap-2 text-sm text-black/58"
            >
              <li
                v-for="item in product.packageContents"
                :key="item"
              >
                Package: {{ item }}
              </li>
            </ul>

            <div
              v-if="product.downloads?.length"
              class="mt-4 flex flex-wrap gap-3"
            >
              <a
                v-for="file in product.downloads"
                :key="file.url || file.label"
                :href="file.url"
                target="_blank"
                class="border border-black/10 px-4 py-2 text-xs font-bold uppercase text-black/65 transition hover:border-[#E50914] hover:text-[#E50914]"
              >
                {{ file.label || 'Download' }}
              </a>
            </div>

            <a
              v-if="product.youtubeVideo"
              :href="product.youtubeVideo"
              target="_blank"
              class="mt-4 inline-flex text-sm font-semibold text-[#E50914]"
            >
              Watch installation video →
            </a>
          </div>

          <div
            v-if="product.faqs?.length"
            class="lg:col-span-2 border-t border-black/10 pt-8"
          >
            <p class="text-[10px] font-black uppercase tracking-[0.22em] text-[#E50914]">
              FAQs
            </p>

            <details
              v-for="faq in product.faqs"
              :key="faq.question"
              class="mt-4 border-t border-black/10 pt-4"
            >
              <summary class="cursor-pointer font-bold text-black/75">
                {{ faq.question }}
              </summary>

              <p class="mt-3 text-sm text-black/55">
                {{ faq.answer }}
              </p>
            </details>
          </div>
        </div>
      </section> -->

      <section
        v-if="related.length"
        class="mt-16 bg-black px-5 py-12 text-white sm:px-8 lg:px-12"
      >
        <div class="mb-8 flex items-end justify-between gap-4">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.24em] text-white/40">
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
      <p class="text-[10px] font-black uppercase tracking-[0.22em] text-[#E50914]">
        Product not found
      </p>

      <h1 class="mt-4 text-4xl font-black tracking-[-0.05em] text-black">
        This product does not exist.
      </h1>

      <router-link
        to="/products"
        class="mt-8 inline-flex h-12 items-center bg-black px-7 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#E50914]"
      >
        Back to products
      </router-link>
    </section>
  </main>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>