<script setup>
import { toast } from 'vue-sonner'
import { ref, computed, watch } from 'vue'
import { uploadProductImage } from '../../services/imageService'
import { createProduct } from '../../services/productService'

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
    toast.error(
      'Please upload JPG, PNG or WEBP.'
    )

    return
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error(
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
    toast.error(
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

    await createProduct({
      ...form.value,
      image: uploadedImage?.url || form.value.imagePreview || '',
      imagePath: uploadedImage?.path || '',
    })

    toast.success(
      'Product created successfully.'
    )

    resetForm()
  } catch (err) {
    toast.error(
      err.message ??
        'Failed to save product.'
    )
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="admin-shell">
    <div class="admin-page">

      <!-- Header -->

      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 class="admin-title">
            Add Product
          </h1>

          <p class="admin-muted mt-3">
            Create a new product for the Haxon Store.
          </p>
        </div>

        <button
          @click="resetForm"
          class="admin-btn-secondary"
        >
          Reset Form
        </button>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">

        <!-- LEFT -->

        <div class="xl:col-span-2 space-y-6">

          <!-- General -->

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
                >
              </div>

              <div>
                <label class="admin-label">
                  Slug
                </label>

                <input
                  v-model="form.slug"
                  readonly
                  class="admin-input"
                >
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
                  placeholder="Product description..."
                />

              </div>

            </div>

          </div>

          <!-- Compatibility -->

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
                  placeholder="Toyota"
                >

              </div>

              <div>

                <label class="admin-label">
                  Car Model *
                </label>

                <input
                  v-model="form.carModel"
                  class="admin-input"
                  placeholder="Corolla"
                >

              </div>

            </div>

          </div>

          <!-- Pricing -->

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

                  <label class="admin-label">
                    Sale Type
                  </label>

                  <select
                    v-model="form.saleType"
                    class="admin-input"
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

                  <label class="admin-label">
                    Sale Value
                  </label>

                  <input
                    v-model="form.saleValue"
                    type="number"
                    class="admin-input"
                  >

                </div>

              </div>

              <div
                v-if="form.saleEnabled"
                class="rounded-xl bg-white/10 p-4"
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
                >

              </div>

            </div>

          </div>

          <!-- Visibility -->

          <div class="admin-card p-6">

            <h2 class="admin-section-title mb-5">
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

          <div class="admin-card p-6">

            <h2 class="admin-section-title mb-5">
              Product Image
            </h2>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              @change="handleImage"
              class="admin-input"
            >

            <img
              v-if="form.imagePreview"
              :src="form.imagePreview"
              class="w-full h-72 mt-5 object-cover rounded-xl border"
            >

          </div>

          <!-- Live Preview -->

          <div class="admin-card overflow-hidden">

            <div
              class="aspect-square bg-white/10 flex items-center justify-center"
            >

              <img
                v-if="form.imagePreview"
                :src="form.imagePreview"
                class="w-full h-full object-cover"
              >

              <span
                v-else
                class="text-slate-500"
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

              <h3 class="font-black text-xl text-white">

                {{ form.name || "Product Name" }}

              </h3>

              <div class="space-y-1">

                <div
                  v-if="form.saleEnabled"
                  class="text-sm text-slate-500 line-through"
                >

                  PKR {{ Number(form.price || 0).toLocaleString() }}

                </div>

                <div class="text-2xl font-black text-red-300">

                  PKR {{ calculatedSalePrice.toLocaleString() }}

                </div>

              </div>

              <p class="text-sm text-slate-400">

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
            class="admin-btn-primary w-full py-4"
          >

            {{ loading ? "Saving Product..." : "Save Product" }}

          </button>

        </div>

      </div>

    </div>
  </div>
</template>