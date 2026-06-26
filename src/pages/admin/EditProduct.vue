<script setup>
import { toast } from 'vue-sonner'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { replaceProductImage } from '../../services/imageService'
import { getProductById, updateProduct } from '../../services/productService'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const pageLoading = ref(true)

const categories = [
  'Exterior Accessories',
  'Interior Accessories',
  'LED & Lighting',
  'Android Panels',
  'Audio & Multimedia',
  'Speakers',
  'Car Care',
  'Security',
  'Emergency Tools',
  'Phone Holders',
  'Charging Accessories',
  'Air Pumps',
  'Seat Covers',
  'Tools',
  'Other',
]

const availabilityOptions = [
  'Available',
  'Check Availability',
  'Pre Order',
  'Unavailable',
]

const saleTypes = [
  {
    label: 'Percentage',
    value: 'percentage',
  },
  {
    label: 'Fixed Price',
    value: 'fixed',
  },
]

const form = ref({
  name: '',
  slug: '',

  category: '',

  description: '',

  carBrand: '',
  carModel: '',

  price: '',

  saleEnabled: false,
  saleType: 'percentage',
  saleValue: '',
  salePrice: '',

  availability: 'Available',

  estimatedDelivery: '2-3 Days',

  featured: false,
  active: true,

  image: '',
  imagePath: '',

  imageFile: null,
  imagePreview: '',
})

const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

watch(
  () => form.value.name,
  (value) => {
    form.value.slug = slugify(value)
  }
)

const calculatedSalePrice = computed(() => {
  const price = Number(form.value.price)

  if (!price) {
    return 0
  }

  if (!form.value.saleEnabled) {
    return price
  }

  const saleValue = Number(form.value.saleValue)

  if (!saleValue) {
    return price
  }

  if (form.value.saleType === 'percentage') {
    const discount =
      (price * saleValue) / 100

    return Math.max(
      price - discount,
      0
    )
  }

  return saleValue
})

const calculatedSaving = computed(() => {
  const price = Number(form.value.price)

  return Math.max(
    price - calculatedSalePrice.value,
    0
  )
})

watch(
  calculatedSalePrice,
  (value) => {
    form.value.salePrice = value
  }
)

const isValid = computed(() => {
  return (
    form.value.name &&
    form.value.category &&
    form.value.description &&
    form.value.carBrand &&
    form.value.carModel &&
    form.value.price
  )
})

const loadProduct = async () => {
  try {
    pageLoading.value = true

    const data = await getProductById(route.params.id)

    if (!data) {
      toast.error('Product not found.')
      router.push('/admin/products')
      return
    }

    form.value = {
      name: data.name || '',

      slug:
        data.slug ||
        slugify(data.name || ''),

      category:
        data.category || '',

      description:
        data.description || '',

      carBrand:
        data.carBrand || '',

      carModel:
        data.carModel || '',

      price:
        data.price || '',

      saleEnabled:
        data.saleEnabled || false,

      saleType:
        data.saleType ||
        'percentage',

      saleValue:
        data.saleValue || '',

      salePrice:
        data.salePrice ||
        data.price ||
        '',

      availability:
        data.availability ||
        'Available',

      estimatedDelivery:
        data.estimatedDelivery ||
        '2-3 Days',

      featured:
        data.featured || false,

      active:
        data.active ?? true,

      image:
        data.image || '',

      imagePath:
        data.imagePath || '',

      imageFile: null,

      imagePreview: '',
    }
  } catch (err) {
    toast.error(
      'Failed to load product.'
    )
  } finally {
    pageLoading.value = false
  }
}

const handleImage = (event) => {
  const file =
    event.target.files[0]

  if (!file) return

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
  ]

  if (
    !allowedTypes.includes(
      file.type
    )
  ) {
    toast.error(
      'Please upload JPG, PNG or WEBP.'
    )

    return
  }

  if (
    file.size >
    5 * 1024 * 1024
  ) {
    toast.error(
      'Maximum image size is 5MB.'
    )

    return
  }

  if (
    form.value.imagePreview
  ) {
    URL.revokeObjectURL(
      form.value.imagePreview
    )
  }

  form.value.imageFile =
    file

  form.value.imagePreview =
    URL.createObjectURL(file)
}

const clearSelectedImage =
  () => {
    if (
      form.value.imagePreview
    ) {
      URL.revokeObjectURL(
        form.value.imagePreview
      )
    }

    form.value.imageFile =
      null

    form.value.imagePreview =
      ''
  }

const saveProduct =
  async () => {
    if (!isValid.value) {
      toast.error(
        'Please complete all required fields.'
      )

      return
    }

    try {
      loading.value = true

      let imageUrl =
        form.value.image

      let imagePath =
        form.value.imagePath

      if (
        form.value.imageFile
      ) {
        const uploaded =
          await replaceProductImage(
            form.value.imageFile,
            form.value.imagePath
          )

        imageUrl =
          uploaded.url

        imagePath =
          uploaded.path
      }

      await updateProduct(route.params.id, {
        ...form.value,
        image: imageUrl,
        mainImage: imageUrl,
        imagePath,
      })

      toast.success(
        'Product updated successfully.'
      )

      router.push(
        '/admin/products'
      )
    } catch (err) {
        toast.error(
        err.message ||
          'Failed to update product.'
      )
    } finally {
      loading.value = false
    }
  }

onMounted(() => {
  loadProduct()
})
</script>
<template>
  <div class="admin-shell">
    <div class="admin-page">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <button
            @click="router.push('/admin/products')"
            class="text-sm text-slate-400 hover:text-red-600 mb-3"
          >
            ← Back to products
          </button>

          <h1 class="admin-title">
            Edit Product
          </h1>

          <p class="admin-muted mt-3">
            Update product details, pricing, availability, and image.
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="loadProduct"
            class="admin-btn-secondary"
          >
            Reload
          </button>

          <button
            @click="router.push('/admin/products')"
            class="admin-btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>

      <div
        v-if="pageLoading"
        class="admin-card p-12 text-center text-slate-400"
      >
        Loading product...
      </div>

      <div
        v-else
        class="grid grid-cols-1 xl:grid-cols-3 gap-8"
      >
        <div class="xl:col-span-2 space-y-6">
          <div class="admin-card p-6">
            <h2 class="admin-section-title mb-5">
              General Information
            </h2>

            <div class="space-y-4">
              <div>
                <label class="admin-label">
                  Product Name *
                </label>

                <input
                  v-model="form.name"
                  class="admin-input"
                  placeholder="M8 LED Headlights"
                />
              </div>

              <div>
                <label class="admin-label">
                  Slug
                </label>

                <input
                  v-model="form.slug"
                  class="admin-input"
                  placeholder="product-slug"
                />

                <p class="text-xs text-slate-500 mt-1">
                  Used later for clean product URLs.
                </p>
              </div>

              <div>
                <label class="admin-label">
                  Category *
                </label>

                <select
                  v-model="form.category"
                  class="admin-input"
                >
                  <option value="">
                    Select Category
                  </option>

                  <option
                    v-for="category in categories"
                    :key="category"
                    :value="category"
                  >
                    {{ category }}
                  </option>
                </select>
              </div>

              <div>
                <label class="admin-label">
                  Description *
                </label>

                <textarea
                  v-model="form.description"
                  rows="6"
                  class="admin-input"
                  placeholder="Write product details, fitment, quality, features, and notes..."
                />
              </div>
            </div>
          </div>

          <div class="admin-card p-6">
            <h2 class="admin-section-title mb-5">
              Compatibility
            </h2>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="admin-label">
                  Car Brand *
                </label>

                <input
                  v-model="form.carBrand"
                  class="admin-input"
                  placeholder="Toyota, Honda, Suzuki..."
                />
              </div>

              <div>
                <label class="admin-label">
                  Car Model *
                </label>

                <input
                  v-model="form.carModel"
                  class="admin-input"
                  placeholder="Corolla, Civic, Alto..."
                />
              </div>
            </div>
          </div>

          <div class="admin-card p-6">
            <h2 class="admin-section-title mb-5">
              Pricing
            </h2>

            <div class="space-y-5">
              <div>
                <label class="admin-label">
                  Regular Price *
                </label>

                <input
                  v-model="form.price"
                  type="number"
                  class="admin-input"
                  placeholder="6500"
                />
              </div>

              <div class="border border-white/10 rounded-xl p-4 bg-white/5">
                <label class="flex items-center gap-3">
                  <input
                    v-model="form.saleEnabled"
                    type="checkbox"
                    class="w-4 h-4"
                  />

                  <span class="font-medium">
                    Enable Sale / Discount
                  </span>
                </label>

                <p class="text-sm admin-muted mt-3">
                  Add a percentage discount or fixed sale price.
                </p>
              </div>

              <div
                v-if="form.saleEnabled"
                class="grid md:grid-cols-2 gap-4"
              >
                <div>
                  <label class="admin-label">
                    Sale Type
                  </label>

                  <select
                    v-model="form.saleType"
                    class="admin-input"
                  >
                    <option
                      v-for="item in saleTypes"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="admin-label">
                    Sale Value
                  </label>

                  <input
                    v-model="form.saleValue"
                    type="number"
                    class="admin-input"
                    :placeholder="form.saleType === 'percentage' ? 'Example: 10' : 'Example: 5500'"
                  />
                </div>
              </div>

              <div
                v-if="form.saleEnabled"
                class="rounded-xl bg-white/10 p-4 space-y-2"
              >
                <div class="flex justify-between">
                  <span class="text-slate-300">
                    Original Price
                  </span>

                  <strong>
                    PKR {{ Number(form.price || 0).toLocaleString() }}
                  </strong>
                </div>

                <div class="flex justify-between text-green-600">
                  <span>
                    Sale Price
                  </span>

                  <strong>
                    PKR {{ calculatedSalePrice.toLocaleString() }}
                  </strong>
                </div>

                <div class="flex justify-between text-red-600">
                  <span>
                    Customer Saves
                  </span>

                  <strong>
                    PKR {{ calculatedSaving.toLocaleString() }}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div class="admin-card p-6">
            <h2 class="admin-section-title mb-5">
              Availability
            </h2>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="admin-label">
                  Availability
                </label>

                <select
                  v-model="form.availability"
                  class="admin-input"
                >
                  <option
                    v-for="item in availabilityOptions"
                    :key="item"
                    :value="item"
                  >
                    {{ item }}
                  </option>
                </select>
              </div>

              <div>
                <label class="admin-label">
                  Estimated Delivery
                </label>

                <input
                  v-model="form.estimatedDelivery"
                  class="admin-input"
                  placeholder="2-3 Days"
                />
              </div>
            </div>
          </div>

          <div class="admin-card p-6">
            <h2 class="admin-section-title mb-5">
              Visibility
            </h2>

            <div class="grid md:grid-cols-2 gap-4">
              <label class="border border-white/10 rounded-xl p-4 flex items-start gap-3 bg-white/5">
                <input
                  v-model="form.featured"
                  type="checkbox"
                  class="w-4 h-4 mt-1"
                />

                <div>
                  <p class="font-medium">
                    Featured Product
                  </p>

                  <p class="text-sm text-slate-400">
                    Show this product in highlighted sections.
                  </p>
                </div>
              </label>

              <label class="border border-white/10 rounded-xl p-4 flex items-start gap-3 bg-white/5">
                <input
                  v-model="form.active"
                  type="checkbox"
                  class="w-4 h-4 mt-1"
                />

                <div>
                  <p class="font-medium">
                    Active Product
                  </p>

                  <p class="text-sm text-slate-400">
                    Visible on public store when active.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="admin-card p-6">
            <h2 class="admin-section-title">
              Product Image
            </h2>

            <p class="text-sm text-slate-400 mt-1 mb-5">
              Upload JPG, PNG, or WEBP under 5MB.
            </p>

            <div class="border rounded-2xl p-4 bg-white/5 mb-4">
              <p class="text-sm font-medium mb-2">
                Current / New Image
              </p>

              <img
                v-if="form.imagePreview || form.image"
                :src="form.imagePreview || form.image"
                class="w-full h-72 object-cover rounded-xl border bg-white"
              />

              <div
                v-else
                class="w-full h-72 rounded-xl border bg-white flex items-center justify-center text-slate-500"
              >
                No image selected
              </div>
            </div>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              @change="handleImage"
              class="admin-input"
            />

            <button
              v-if="form.imagePreview"
              @click="clearSelectedImage"
              class="admin-btn-secondary w-full mt-3"
            >
              Remove Selected Image
            </button>

            <div class="mt-4 text-xs text-slate-400 break-all">
              <p class="font-medium mb-1">
                Storage Path
              </p>

              <p>
                {{ form.imagePath || 'No storage path saved' }}
              </p>
            </div>
          </div>

          <div class="admin-card overflow-hidden">
            <div class="p-5 border-b">
              <h2 class="admin-section-title">
                Live Preview
              </h2>

              <p class="text-sm text-slate-400 mt-1">
                Approximate storefront product card.
              </p>
            </div>

            <div class="aspect-square bg-white/10 flex items-center justify-center">
              <img
                v-if="form.imagePreview || form.image"
                :src="form.imagePreview || form.image"
                class="w-full h-full object-cover"
              />

              <span
                v-else
                class="text-slate-500"
              >
                Image Preview
              </span>
            </div>

            <div class="p-5 space-y-3">
              <div class="flex gap-2 flex-wrap">
                <span
                  v-if="form.featured"
                  class="inline-block bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full"
                >
                  Featured
                </span>

                <span
                  v-if="!form.active"
                  class="inline-block bg-gray-200 text-slate-300 text-xs font-semibold px-3 py-1 rounded-full"
                >
                  Inactive
                </span>
              </div>

              <h3 class="font-black text-xl text-white">
                {{ form.name || 'Product Name' }}
              </h3>

              <p class="text-sm text-slate-400">
                {{ form.category || 'Category' }}
              </p>

              <div class="space-y-1">
                <div
                  v-if="form.saleEnabled && calculatedSaving > 0"
                  class="text-sm text-slate-500 line-through"
                >
                  PKR {{ Number(form.price || 0).toLocaleString() }}
                </div>

                <div class="text-2xl font-black text-red-300">
                  PKR {{ calculatedSalePrice.toLocaleString() }}
                </div>

                <div
                  v-if="form.saleEnabled && calculatedSaving > 0"
                  class="text-sm text-green-600 font-medium"
                >
                  Save PKR {{ calculatedSaving.toLocaleString() }}
                </div>
              </div>

              <p class="text-sm text-slate-400">
                {{ form.carBrand || 'Brand' }}
                {{ form.carModel || 'Model' }}
              </p>

              <div class="flex flex-wrap gap-2">
                <span
                  class="inline-block text-xs px-3 py-1 rounded-full"
                  :class="{
                    'bg-green-100 text-green-700': form.availability === 'Available',
                    'bg-yellow-100 text-yellow-700': form.availability === 'Check Availability',
                    'bg-blue-100 text-blue-700': form.availability === 'Pre Order',
                    'bg-red-100 text-red-700': form.availability === 'Unavailable'
                  }"
                >
                  {{ form.availability }}
                </span>

                <span class="inline-block bg-white/10 text-slate-300 text-xs px-3 py-1 rounded-full">
                  {{ form.estimatedDelivery || 'Delivery not set' }}
                </span>
              </div>
            </div>
          </div>

          <div class="admin-card p-6">
            <h2 class="admin-section-title mb-4">
              Update Product
            </h2>

            <div
              v-if="!isValid"
              class="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl p-4 text-sm mb-4"
            >
              Please complete all required fields before saving.
            </div>

            <button
              @click="saveProduct"
              :disabled="loading || !isValid"
              class="admin-btn-primary w-full py-4"
            >
              {{ loading ? 'Saving Changes...' : 'Update Product' }}
            </button>

            <button
              @click="router.push('/admin/products')"
              class="admin-btn-secondary w-full mt-3"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>