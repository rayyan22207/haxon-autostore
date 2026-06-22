<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'

import { db } from '../../firebase/config'

import {
  replaceProductImage,
} from '../../services/imageService'

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

    const docRef = doc(
      db,
      'products',
      route.params.id
    )

    const snap = await getDoc(docRef)

    if (!snap.exists()) {
      alert('Product not found.')

      router.push('/admin/products')

      return
    }

    const data = snap.data()

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
    console.error(err)

    alert(
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
    alert(
      'Please upload JPG, PNG or WEBP.'
    )

    return
  }

  if (
    file.size >
    5 * 1024 * 1024
  ) {
    alert(
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
      alert(
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

      await updateDoc(
        doc(
          db,
          'products',
          route.params.id
        ),
        {
          name:
            form.value.name.trim(),

          slug:
            form.value.slug,

          category:
            form.value.category,

          description:
            form.value.description.trim(),

          carBrand:
            form.value.carBrand.trim(),

          carModel:
            form.value.carModel.trim(),

          price: Number(
            form.value.price
          ),

          saleEnabled:
            form.value.saleEnabled,

          saleType:
            form.value.saleType,

          saleValue: Number(
            form.value.saleValue ||
              0
          ),

          salePrice:
            calculatedSalePrice.value,

          availability:
            form.value.availability,

          estimatedDelivery:
            form.value
              .estimatedDelivery,

          featured:
            form.value.featured,

          active:
            form.value.active,

          image:
            imageUrl,

          imagePath:
            imagePath,

          updatedAt:
            serverTimestamp(),
        }
      )

      alert(
        'Product updated successfully.'
      )

      router.push(
        '/admin/products'
      )
    } catch (err) {
      console.error(err)

      alert(
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
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <button
            @click="router.push('/admin/products')"
            class="text-sm text-gray-500 hover:text-red-600 mb-3"
          >
            ← Back to products
          </button>

          <h1 class="text-4xl font-bold text-gray-900">
            Edit Product
          </h1>

          <p class="text-gray-500 mt-2">
            Update product details, pricing, availability, and image.
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="loadProduct"
            class="border border-gray-300 hover:bg-gray-100 transition rounded-xl px-5 py-3"
          >
            Reload
          </button>

          <button
            @click="router.push('/admin/products')"
            class="border border-gray-300 hover:bg-gray-100 transition rounded-xl px-5 py-3"
          >
            Cancel
          </button>
        </div>
      </div>

      <div
        v-if="pageLoading"
        class="bg-white rounded-2xl shadow-sm border p-12 text-center text-gray-500"
      >
        Loading product...
      </div>

      <div
        v-else
        class="grid grid-cols-1 xl:grid-cols-3 gap-8"
      >
        <div class="xl:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl shadow-sm border p-6">
            <h2 class="text-xl font-semibold mb-5">
              General Information
            </h2>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">
                  Product Name *
                </label>

                <input
                  v-model="form.name"
                  class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="M8 LED Headlights"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">
                  Slug
                </label>

                <input
                  v-model="form.slug"
                  class="w-full bg-gray-100 border rounded-xl p-3 text-gray-600"
                  placeholder="product-slug"
                />

                <p class="text-xs text-gray-400 mt-1">
                  Used later for clean product URLs.
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">
                  Category *
                </label>

                <select
                  v-model="form.category"
                  class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none"
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
                <label class="block text-sm font-medium mb-2">
                  Description *
                </label>

                <textarea
                  v-model="form.description"
                  rows="6"
                  class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="Write product details, fitment, quality, features, and notes..."
                />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border p-6">
            <h2 class="text-xl font-semibold mb-5">
              Compatibility
            </h2>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">
                  Car Brand *
                </label>

                <input
                  v-model="form.carBrand"
                  class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="Toyota, Honda, Suzuki..."
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">
                  Car Model *
                </label>

                <input
                  v-model="form.carModel"
                  class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="Corolla, Civic, Alto..."
                />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border p-6">
            <h2 class="text-xl font-semibold mb-5">
              Pricing
            </h2>

            <div class="space-y-5">
              <div>
                <label class="block text-sm font-medium mb-2">
                  Regular Price *
                </label>

                <input
                  v-model="form.price"
                  type="number"
                  class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="6500"
                />
              </div>

              <div class="border rounded-xl p-4 bg-gray-50">
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

                <p class="text-sm text-gray-500 mt-2">
                  Add a percentage discount or fixed sale price.
                </p>
              </div>

              <div
                v-if="form.saleEnabled"
                class="grid md:grid-cols-2 gap-4"
              >
                <div>
                  <label class="block text-sm font-medium mb-2">
                    Sale Type
                  </label>

                  <select
                    v-model="form.saleType"
                    class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none"
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
                  <label class="block text-sm font-medium mb-2">
                    Sale Value
                  </label>

                  <input
                    v-model="form.saleValue"
                    type="number"
                    class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none"
                    :placeholder="form.saleType === 'percentage' ? 'Example: 10' : 'Example: 5500'"
                  />
                </div>
              </div>

              <div
                v-if="form.saleEnabled"
                class="rounded-xl bg-gray-100 p-4 space-y-2"
              >
                <div class="flex justify-between">
                  <span class="text-gray-600">
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

          <div class="bg-white rounded-2xl shadow-sm border p-6">
            <h2 class="text-xl font-semibold mb-5">
              Availability
            </h2>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">
                  Availability
                </label>

                <select
                  v-model="form.availability"
                  class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none"
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
                <label class="block text-sm font-medium mb-2">
                  Estimated Delivery
                </label>

                <input
                  v-model="form.estimatedDelivery"
                  class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="2-3 Days"
                />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border p-6">
            <h2 class="text-xl font-semibold mb-5">
              Visibility
            </h2>

            <div class="grid md:grid-cols-2 gap-4">
              <label class="border rounded-xl p-4 flex items-start gap-3 bg-gray-50">
                <input
                  v-model="form.featured"
                  type="checkbox"
                  class="w-4 h-4 mt-1"
                />

                <div>
                  <p class="font-medium">
                    Featured Product
                  </p>

                  <p class="text-sm text-gray-500">
                    Show this product in highlighted sections.
                  </p>
                </div>
              </label>

              <label class="border rounded-xl p-4 flex items-start gap-3 bg-gray-50">
                <input
                  v-model="form.active"
                  type="checkbox"
                  class="w-4 h-4 mt-1"
                />

                <div>
                  <p class="font-medium">
                    Active Product
                  </p>

                  <p class="text-sm text-gray-500">
                    Visible on public store when active.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-2xl shadow-sm border p-6">
            <h2 class="text-xl font-semibold">
              Product Image
            </h2>

            <p class="text-sm text-gray-500 mt-1 mb-5">
              Upload JPG, PNG, or WEBP under 5MB.
            </p>

            <div class="border rounded-2xl p-4 bg-gray-50 mb-4">
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
                class="w-full h-72 rounded-xl border bg-white flex items-center justify-center text-gray-400"
              >
                No image selected
              </div>
            </div>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              @change="handleImage"
              class="w-full border rounded-xl p-3"
            />

            <button
              v-if="form.imagePreview"
              @click="clearSelectedImage"
              class="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition"
            >
              Remove Selected Image
            </button>

            <div class="mt-4 text-xs text-gray-500 break-all">
              <p class="font-medium mb-1">
                Storage Path
              </p>

              <p>
                {{ form.imagePath || 'No storage path saved' }}
              </p>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div class="p-5 border-b">
              <h2 class="text-xl font-semibold">
                Live Preview
              </h2>

              <p class="text-sm text-gray-500 mt-1">
                Approximate storefront product card.
              </p>
            </div>

            <div class="aspect-square bg-gray-100 flex items-center justify-center">
              <img
                v-if="form.imagePreview || form.image"
                :src="form.imagePreview || form.image"
                class="w-full h-full object-cover"
              />

              <span
                v-else
                class="text-gray-400"
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
                  class="inline-block bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full"
                >
                  Inactive
                </span>
              </div>

              <h3 class="font-bold text-xl">
                {{ form.name || 'Product Name' }}
              </h3>

              <p class="text-sm text-gray-500">
                {{ form.category || 'Category' }}
              </p>

              <div class="space-y-1">
                <div
                  v-if="form.saleEnabled && calculatedSaving > 0"
                  class="text-sm text-gray-400 line-through"
                >
                  PKR {{ Number(form.price || 0).toLocaleString() }}
                </div>

                <div class="text-2xl font-bold text-red-600">
                  PKR {{ calculatedSalePrice.toLocaleString() }}
                </div>

                <div
                  v-if="form.saleEnabled && calculatedSaving > 0"
                  class="text-sm text-green-600 font-medium"
                >
                  Save PKR {{ calculatedSaving.toLocaleString() }}
                </div>
              </div>

              <p class="text-sm text-gray-500">
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

                <span class="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {{ form.estimatedDelivery || 'Delivery not set' }}
                </span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border p-6">
            <h2 class="text-xl font-semibold mb-4">
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
              class="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-4 rounded-2xl transition"
            >
              {{ loading ? 'Saving Changes...' : 'Update Product' }}
            </button>

            <button
              @click="router.push('/admin/products')"
              class="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>