<script setup>
import { ref, computed, watch } from 'vue'
import {
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore'

import { db } from '../../firebase/config'
import { uploadProductImage } from '../../services/imageService'

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

  imageFile: null,
  imagePreview: '',
})

const loading = ref(false)

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

  if (!price) return 0

  if (!form.value.saleEnabled) {
    return price
  }

  const saleValue = Number(form.value.saleValue)

  if (!saleValue) {
    return price
  }

  if (form.value.saleType === 'percentage') {
    const discount = (price * saleValue) / 100

    return Math.max(price - discount, 0)
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
    form.value.price &&
    form.value.imageFile
  )
})

const handleImage = (event) => {
  const file = event.target.files[0]

  if (!file) return

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
  ]

  if (!allowedTypes.includes(file.type)) {
    alert(
      'Please upload JPG, PNG or WEBP.'
    )

    return
  }

  if (file.size > 5 * 1024 * 1024) {
    alert(
      'Maximum image size is 5MB.'
    )

    return
  }

  if (form.value.imagePreview) {
    URL.revokeObjectURL(
      form.value.imagePreview
    )
  }

  form.value.imageFile = file

  form.value.imagePreview =
    URL.createObjectURL(file)
}

const resetForm = () => {
  if (form.value.imagePreview) {
    URL.revokeObjectURL(
      form.value.imagePreview
    )
  }

  form.value = {
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

    imageFile: null,
    imagePreview: '',
  }
}

const saveProduct = async () => {
  if (!isValid.value) {
    alert(
      'Please complete all required fields.'
    )

    return
  }

  try {
    loading.value = true

    let uploadedImage = null

    if (form.value.imageFile) {
      uploadedImage =
        await uploadProductImage(
          form.value.imageFile
        )
    }

    await addDoc(
      collection(db, 'products'),
      {
        name: form.value.name.trim(),

        slug: form.value.slug,

        category: form.value.category,

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
          form.value.saleValue || 0
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
          uploadedImage?.url ??
          '/images/no-image.jpg',

        imagePath:
          uploadedImage?.path ?? '',

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      }
    )

    alert(
      'Product created successfully.'
    )

    resetForm()
  } catch (err) {
    console.error(err)

    alert(
      err.message ??
        'Failed to save product.'
    )
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 py-8">

      <!-- Header -->

      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-4xl font-bold text-gray-900">
            Add Product
          </h1>

          <p class="text-gray-500 mt-2">
            Create a new product for the Haxon Store.
          </p>
        </div>

        <button
          @click="resetForm"
          class="border border-gray-300 hover:bg-gray-100 transition rounded-xl px-5 py-3"
        >
          Reset Form
        </button>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">

        <!-- LEFT -->

        <div class="xl:col-span-2 space-y-6">

          <!-- General -->

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
                >
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">
                  Slug
                </label>

                <input
                  v-model="form.slug"
                  readonly
                  class="w-full bg-gray-100 border rounded-xl p-3"
                >
              </div>

              <div>

                <label class="block text-sm font-medium mb-2">
                  Category *
                </label>

                <select
                  v-model="form.category"
                  class="w-full border rounded-xl p-3"
                >

                  <option value="">
                    Select Category
                  </option>

                  <option
                    v-for="category in categories"
                    :key="category"
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
                  class="w-full border rounded-xl p-3"
                  placeholder="Product description..."
                />

              </div>

            </div>

          </div>

          <!-- Compatibility -->

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
                  class="w-full border rounded-xl p-3"
                  placeholder="Toyota"
                >

              </div>

              <div>

                <label class="block text-sm font-medium mb-2">
                  Car Model *
                </label>

                <input
                  v-model="form.carModel"
                  class="w-full border rounded-xl p-3"
                  placeholder="Corolla"
                >

              </div>

            </div>

          </div>

          <!-- Pricing -->

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
                  class="w-full border rounded-xl p-3"
                  placeholder="6500"
                >

              </div>

              <label class="flex items-center gap-3">

                <input
                  type="checkbox"
                  v-model="form.saleEnabled"
                >

                Enable Sale

              </label>

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
                    class="w-full border rounded-xl p-3"
                  >

                    <option
                      v-for="item in saleTypes"
                      :value="item.value"
                      :key="item.value"
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
                    class="w-full border rounded-xl p-3"
                  >

                </div>

              </div>

              <div
                v-if="form.saleEnabled"
                class="rounded-xl bg-gray-100 p-4"
              >

                <div class="flex justify-between">

                  <span>
                    Original
                  </span>

                  <strong>
                    PKR {{ Number(form.price || 0).toLocaleString() }}
                  </strong>

                </div>

                <div class="flex justify-between mt-2 text-green-600">

                  <span>
                    Sale Price
                  </span>

                  <strong>
                    PKR {{ calculatedSalePrice.toLocaleString() }}
                  </strong>

                </div>

                <div class="flex justify-between mt-2 text-red-600">

                  <span>
                    You Save
                  </span>

                  <strong>
                    PKR {{ calculatedSaving.toLocaleString() }}
                  </strong>

                </div>

              </div>

            </div>

          </div>

          <!-- Availability -->

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
                  class="w-full border rounded-xl p-3"
                >

                  <option
                    v-for="item in availabilityOptions"
                    :key="item"
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
                  class="w-full border rounded-xl p-3"
                >

              </div>

            </div>

          </div>

          <!-- Visibility -->

          <div class="bg-white rounded-2xl shadow-sm border p-6">

            <h2 class="text-xl font-semibold mb-5">
              Visibility
            </h2>

            <div class="flex flex-wrap gap-8">

              <label class="flex items-center gap-3">

                <input
                  type="checkbox"
                  v-model="form.featured"
                >

                Featured

              </label>

              <label class="flex items-center gap-3">

                <input
                  type="checkbox"
                  v-model="form.active"
                >

                Active

              </label>

            </div>

          </div>

        </div>

        <!-- RIGHT -->

        <div class="space-y-6">

          <!-- Upload -->

          <div class="bg-white rounded-2xl shadow-sm border p-6">

            <h2 class="text-xl font-semibold mb-5">
              Product Image
            </h2>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              @change="handleImage"
              class="w-full border rounded-xl p-3"
            >

            <img
              v-if="form.imagePreview"
              :src="form.imagePreview"
              class="w-full h-72 mt-5 object-cover rounded-xl border"
            >

          </div>

          <!-- Live Preview -->

          <div class="bg-white rounded-2xl shadow-sm border overflow-hidden">

            <div
              class="aspect-square bg-gray-100 flex items-center justify-center"
            >

              <img
                v-if="form.imagePreview"
                :src="form.imagePreview"
                class="w-full h-full object-cover"
              >

              <span
                v-else
                class="text-gray-400"
              >
                Image Preview
              </span>

            </div>

            <div class="p-5 space-y-3">

              <div
                v-if="form.featured"
                class="inline-block bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full"
              >
                Featured
              </div>

              <h3 class="font-bold text-xl">

                {{ form.name || "Product Name" }}

              </h3>

              <div class="space-y-1">

                <div
                  v-if="form.saleEnabled"
                  class="text-sm text-gray-400 line-through"
                >

                  PKR {{ Number(form.price || 0).toLocaleString() }}

                </div>

                <div class="text-2xl font-bold text-red-600">

                  PKR {{ calculatedSalePrice.toLocaleString() }}

                </div>

              </div>

              <p class="text-sm text-gray-500">

                {{ form.carBrand || "Brand" }}
                {{ form.carModel || "Model" }}

              </p>

              <span
                class="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full"
              >

                {{ form.availability }}

              </span>

            </div>

          </div>

          <!-- Save -->

          <button
            @click="saveProduct"
            :disabled="loading || !isValid"
            class="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-4 rounded-2xl transition"
          >

            {{ loading ? "Saving Product..." : "Save Product" }}

          </button>

        </div>

      </div>

    </div>
  </div>
</template>