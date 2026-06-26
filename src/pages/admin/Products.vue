<script setup>
import { toast } from 'vue-sonner'
import { ref, computed, onMounted } from 'vue'
import HaxonImage from '../../components/ui/HaxonImage.vue'
import { archiveProduct, deleteProduct, getAdminProducts, toggleFeaturedProduct } from '../../services/productService'
import { productBrand, productImage } from '../../lib/catalog'

const products = ref([])
const loading = ref(true)
const savingId = ref('')
const error = ref('')
const search = ref('')
const selectedCategory = ref('')
const selectedAvailability = ref('')
const selectedStatus = ref('')
const sort = ref('newest')

const formatPrice = (value) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(value || 0)

const fetchProducts = async () => {
  try {
    loading.value = true
    error.value = ''
    products.value = await getAdminProducts()
  } catch (err) {
    error.value = err.message || 'Failed to load products.'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

const categories = computed(() => [...new Set(products.value.map((p) => p.category).filter(Boolean))].sort())
const availabilityOptions = computed(() => [...new Set(products.value.map((p) => p.availability || p.availabilityStatus).filter(Boolean))].sort())

const filteredProducts = computed(() => {
  const term = search.value.toLowerCase().trim()
  const filtered = products.value.filter((product) => {
    const searchableText = [product.name, product.sku, product.category, productBrand(product), product.carModel, product.slug, ...(product.compatibleMakes || []), ...(product.compatibleModels || [])].join(' ').toLowerCase()
    const active = product.active !== false && product.isActive !== false && product.archived !== true
    return (!term || searchableText.includes(term)) &&
      (!selectedCategory.value || product.category === selectedCategory.value) &&
      (!selectedAvailability.value || product.availability === selectedAvailability.value || product.availabilityStatus === selectedAvailability.value) &&
      (!selectedStatus.value ||
        (selectedStatus.value === 'active' && active) ||
        (selectedStatus.value === 'inactive' && !active) ||
        (selectedStatus.value === 'featured' && (product.featured === true || product.isFeatured === true)) ||
        (selectedStatus.value === 'sale' && product.saleEnabled === true))
  })
  return [...filtered].sort((a, b) => sort.value === 'price-low' ? Number(a.salePrice || a.price || 0) - Number(b.salePrice || b.price || 0) : sort.value === 'price-high' ? Number(b.salePrice || b.price || 0) - Number(a.salePrice || a.price || 0) : sort.value === 'sortOrder' ? Number(a.sortOrder || 0) - Number(b.sortOrder || 0) : String(b.createdAt?.seconds || b.createdAt || '').localeCompare(String(a.createdAt?.seconds || a.createdAt || '')))
})

const stats = computed(() => ({
  total: products.value.length,
  active: products.value.filter((p) => p.active !== false && p.isActive !== false && p.archived !== true).length,
  featured: products.value.filter((p) => p.featured === true || p.isFeatured === true).length,
  sale: products.value.filter((p) => p.saleEnabled === true).length,
}))

const runProductAction = async (product, action, label) => {
  try {
    savingId.value = `${label}-${product.id}`
    await action()
    toast.success(`Product ${label}.`)
    await fetchProducts()
  } catch (err) {
    toast.error(err.message || `Failed to ${label} product.`)
  } finally {
    savingId.value = ''
  }
}
const removeProduct = (product) => { if (confirm(`Delete "${product.name}"?\n\nThis action cannot be undone.`)) runProductAction(product, () => deleteProduct(product.id), 'deleted') }
const archive = (product) => runProductAction(product, () => archiveProduct(product.id), 'archived')
const toggleFeatured = (product) => runProductAction(product, () => toggleFeaturedProduct(product.id, !(product.featured || product.isFeatured)), (product.featured || product.isFeatured) ? 'unfeatured' : 'featured')
const clearFilters = () => { search.value = ''; selectedCategory.value = ''; selectedAvailability.value = ''; selectedStatus.value = ''; sort.value = 'newest' }

onMounted(fetchProducts)
</script>

<template>
  <div class="admin-shell">
    <div class="admin-page">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 class="admin-title">
            Products
          </h1>

          <p class="admin-muted mt-3">
            Manage Haxon products, pricing, availability, images, and visibility.
          </p>
        </div>

        <router-link
          to="/admin/products/add"
          class="admin-btn-primary"
        >
          Add Product
        </router-link>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="admin-card p-5">
          <p class="text-slate-400 text-sm">
            Total Products
          </p>

          <h2 class="text-3xl font-black mt-2 text-white">
            {{ stats.total }}
          </h2>
        </div>

        <div class="admin-card p-5">
          <p class="text-slate-400 text-sm">
            Active
          </p>

          <h2 class="text-3xl font-black mt-2 text-white text-green-600">
            {{ stats.active }}
          </h2>
        </div>

        <div class="admin-card p-5">
          <p class="text-slate-400 text-sm">
            Featured
          </p>

          <h2 class="text-3xl font-black mt-2 text-white text-red-600">
            {{ stats.featured }}
          </h2>
        </div>

        <div class="admin-card p-5">
          <p class="text-slate-400 text-sm">
            On Sale
          </p>

          <h2 class="text-3xl font-black mt-2 text-white text-blue-600">
            {{ stats.sale }}
          </h2>
        </div>
      </div>

      <div class="admin-card p-5 mb-8">
        <div class="grid grid-cols-1 lg:grid-cols-6 gap-4">
          <input
            v-model="search"
            placeholder="Search name, brand, model, category..."
            class="admin-input lg:col-span-2"
          />

          <select
            v-model="selectedCategory"
            class="admin-input"
          >
            <option value="">
              All Categories
            </option>

            <option
              v-for="category in categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>

          <select
            v-model="selectedAvailability"
            class="admin-input"
          >
            <option value="">
              All Availability
            </option>

            <option
              v-for="item in availabilityOptions"
              :key="item"
              :value="item"
            >
              {{ item }}
            </option>
          </select>

          <select
            v-model="selectedStatus"
            class="admin-input"
          >
            <option value="">
              All Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

            <option value="featured">
              Featured
            </option>

            <option value="sale">
              On Sale
            </option>
          </select>

          <select v-model="sort" class="admin-input">
            <option value="newest">Newest</option>
            <option value="sortOrder">Sort order</option>
            <option value="price-low">Price low</option>
            <option value="price-high">Price high</option>
          </select>
        </div>

        <div class="flex justify-between items-center mt-4 text-sm text-slate-400">
          <p>
            Showing {{ filteredProducts.length }} of {{ products.length }} products
          </p>

          <button
            @click="clearFilters"
            class="text-red-300 hover:text-red-200 font-bold"
          >
            Clear filters
          </button>
        </div>
      </div>

      <div
        v-if="loading"
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="admin-card p-5 animate-pulse"
        >
          <div class="h-48 bg-gray-100 rounded-xl mb-4"></div>
          <div class="h-5 bg-gray-100 rounded w-3/4 mb-3"></div>
          <div class="h-4 bg-gray-100 rounded w-1/2 mb-3"></div>
          <div class="h-8 bg-gray-100 rounded w-1/3"></div>
        </div>
      </div>

      <div
        v-else-if="error"
        class="rounded-3xl border border-red-400/30 bg-red-500/10 p-6 text-red-100"
      >
        {{ error }}
      </div>

      <div
        v-else-if="filteredProducts.length === 0"
        class="admin-card p-12 text-center"
      >
        <div class="text-5xl mb-4">
          📦
        </div>

        <h2 class="text-2xl font-black text-white">
          No products found
        </h2>

        <p class="admin-muted mt-3">
          Add a new product or clear your filters.
        </p>

        <div class="mt-6 flex justify-center gap-3">
          <button
            @click="clearFilters"
            class="border px-5 py-3 rounded-xl hover:bg-gray-50"
          >
            Clear Filters
          </button>

          <router-link
            to="/admin/products/add"
            class="bg-red-600 text-white px-5 py-3 rounded-xl hover:bg-red-700"
          >
            Add Product
          </router-link>
        </div>
      </div>

      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="admin-card overflow-hidden transition hover:border-white/20"
        >
          <div class="relative h-56 bg-gray-100">
            <HaxonImage :src="productImage(product)" :alt="product.name" ratio="h-56" />

            <div class="absolute top-3 left-3 flex gap-2 flex-wrap">
              <span
                v-if="product.featured || product.isFeatured"
                class="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full"
              >
                Featured
              </span>

              <span
                v-if="product.saleEnabled"
                class="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full"
              >
                Sale
              </span>
            </div>

            <span
              class="absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full"
              :class="{
                'bg-green-100 text-green-700': product.active !== false && product.isActive !== false,
                'bg-gray-200 text-gray-700': product.active === false || product.isActive === false
              }"
            >
              {{
                product.active === false || product.isActive === false
                  ? 'Inactive'
                  : 'Active'
              }}
            </span>
          </div>

          <div class="p-5">
            <div class="mb-3">
              <h2 class="text-xl font-black text-white line-clamp-1">
                {{ product.name }}
              </h2>

              <p class="text-sm text-slate-400 mt-1">
                {{ product.category || 'No category' }}
              </p>
            </div>

            <div class="text-sm text-slate-300 mb-4">
              {{ productBrand(product) }}
              {{ product.compatibleModels?.[0] || product.carModel || 'Universal fitment' }}
            </div>

            <div class="mb-4">
              <p
                v-if="product.saleEnabled && product.salePrice"
                class="text-sm text-gray-400 line-through"
              >
                {{ formatPrice(product.price) }}
              </p>

              <p class="text-2xl font-black text-white text-red-600">
                {{
                  product.saleEnabled && product.salePrice
                    ? formatPrice(product.salePrice)
                    : formatPrice(product.price)
                }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2 mb-5">
              <span
                class="text-xs px-3 py-1 rounded-full"
                :class="{
                  'bg-green-100 text-green-700': product.availability === 'Available' || product.availabilityStatus === 'Available',
                  'bg-yellow-100 text-yellow-700': product.availability === 'Check Availability' || product.availabilityStatus === 'Check Availability',
                  'bg-blue-100 text-blue-700': product.availability === 'Pre Order',
                  'bg-red-100 text-red-700': product.availability === 'Unavailable' || product.availabilityStatus === 'Out of Stock',
                  'bg-gray-100 text-gray-700': !product.availability && !product.availabilityStatus
                }"
              >
                {{ product.availability || product.availabilityStatus || 'No availability' }}
              </span>

              <span class="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {{ product.estimatedDelivery || 'No delivery set' }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <router-link :to="`/admin/products/edit/${product.id}`" class="admin-btn-secondary text-center">Edit</router-link>
              <button @click="toggleFeatured(product)" :disabled="savingId.includes(product.id)" class="admin-btn-secondary">{{ product.featured || product.isFeatured ? 'Unfeature' : 'Feature' }}</button>
              <button @click="archive(product)" :disabled="savingId.includes(product.id)" class="admin-btn-secondary">Archive</button>
              <button @click="removeProduct(product)" :disabled="savingId.includes(product.id)" class="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-100 transition hover:bg-red-500/20">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>