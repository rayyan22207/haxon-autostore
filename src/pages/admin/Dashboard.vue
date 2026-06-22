<script setup>
import { ref, onMounted } from 'vue'
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore'
import { db } from '../../firebase/config'

const loading = ref(true)
const error = ref('')

const stats = ref({
  totalProducts: 0,
  activeProducts: 0,
  featuredProducts: 0,
  outOfStockProducts: 0,
  totalOrders: 0,
  pendingOrders: 0,
  deliveredOrders: 0,
  estimatedRevenue: 0,
})

const recentOrders = ref([])

const formatPrice = (value) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

const loadStats = async () => {
  try {
    loading.value = true
    error.value = ''

    const productsSnapshot = await getDocs(
      collection(db, 'products')
    )

    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    const ordersSnapshot = await getDocs(
      collection(db, 'orders')
    )

    const orders = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    stats.value.totalProducts = products.length

    stats.value.activeProducts = products.filter(
      (product) => product.isActive !== false
    ).length

    stats.value.featuredProducts = products.filter(
      (product) => product.isFeatured === true
    ).length

    stats.value.outOfStockProducts = products.filter(
      (product) => product.availabilityStatus === 'Out of Stock'
    ).length

    stats.value.totalOrders = orders.length

    stats.value.pendingOrders = orders.filter(
      (order) => order.status === 'Pending Confirmation'
    ).length

    stats.value.deliveredOrders = orders.filter(
      (order) => order.status === 'Delivered'
    ).length

    stats.value.estimatedRevenue = orders
      .filter((order) => order.status === 'Delivered')
      .reduce((total, order) => {
        return total + Number(order.totalAmount || order.total || 0)
      }, 0)

    const recentOrdersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc'),
      limit(5)
    )

    const recentOrdersSnapshot = await getDocs(recentOrdersQuery)

    recentOrders.value = recentOrdersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load dashboard data.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
})
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 md:p-10">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
      <div>
        <h1 class="text-4xl font-bold">
          Dashboard
        </h1>

        <p class="text-gray-500 mt-2">
          Overview of Haxon products, orders, and admin activity.
        </p>
      </div>

      <div class="flex gap-3">
        <button
          @click="loadStats"
          class="border px-5 py-3 rounded-lg hover:bg-gray-50 transition"
        >
          Refresh
        </button>

        <router-link
          to="/admin/products/add"
          class="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg transition"
        >
          Add Product
        </router-link>
      </div>
    </div>

    <div
      v-if="loading"
      class="bg-white rounded-2xl shadow p-10 text-center text-gray-500"
    >
      Loading dashboard...
    </div>

    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6"
    >
      {{ error }}
    </div>

    <div v-else>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <p class="text-gray-500">
            Total Products
          </p>

          <h2 class="text-4xl font-bold mt-3">
            {{ stats.totalProducts }}
          </h2>

          <p class="text-sm text-gray-400 mt-2">
            {{ stats.activeProducts }} active
          </p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <p class="text-gray-500">
            Total Orders
          </p>

          <h2 class="text-4xl font-bold mt-3">
            {{ stats.totalOrders }}
          </h2>

          <p class="text-sm text-gray-400 mt-2">
            All customer orders
          </p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <p class="text-gray-500">
            Pending Confirmation
          </p>

          <h2 class="text-4xl font-bold mt-3 text-yellow-500">
            {{ stats.pendingOrders }}
          </h2>

          <p class="text-sm text-gray-400 mt-2">
            Needs admin action
          </p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <p class="text-gray-500">
            Delivered Orders
          </p>

          <h2 class="text-4xl font-bold mt-3 text-green-600">
            {{ stats.deliveredOrders }}
          </h2>

          <p class="text-sm text-gray-400 mt-2">
            Completed sales
          </p>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-6 mb-10">
        <div class="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <p class="text-gray-500">
            Estimated Revenue
          </p>

          <h2 class="text-3xl font-bold mt-3">
            {{ formatPrice(stats.estimatedRevenue) }}
          </h2>

          <p class="text-sm text-gray-400 mt-2">
            Based on delivered orders
          </p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <p class="text-gray-500">
            Featured Products
          </p>

          <h2 class="text-3xl font-bold mt-3">
            {{ stats.featuredProducts }}
          </h2>

          <p class="text-sm text-gray-400 mt-2">
            Shown as highlighted items
          </p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <p class="text-gray-500">
            Out of Stock
          </p>

          <h2 class="text-3xl font-bold mt-3 text-red-600">
            {{ stats.outOfStockProducts }}
          </h2>

          <p class="text-sm text-gray-400 mt-2">
            Should be reviewed
          </p>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white rounded-2xl shadow border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h2 class="text-xl font-bold">
                Recent Orders
              </h2>

              <p class="text-sm text-gray-500">
                Latest customer activity
              </p>
            </div>

            <router-link
              to="/admin/orders"
              class="text-red-600 font-medium hover:underline"
            >
              View all
            </router-link>
          </div>

          <div
            v-if="recentOrders.length === 0"
            class="text-gray-500 text-center py-10"
          >
            No orders yet.
          </div>

          <div
            v-else
            class="space-y-3"
          >
            <div
              v-for="order in recentOrders"
              :key="order.id"
              class="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <p class="font-semibold">
                  {{ order.customerName || 'Unnamed Customer' }}
                </p>

                <p class="text-sm text-gray-500">
                  {{ order.phone || order.email || 'No contact saved' }}
                </p>
              </div>

              <div class="text-left md:text-right">
                <p class="font-semibold">
                  {{ formatPrice(order.totalAmount || order.total) }}
                </p>

                <p
                  class="text-sm"
                  :class="{
                    'text-yellow-600': order.status === 'Pending Confirmation',
                    'text-green-600': order.status === 'Delivered',
                    'text-gray-500': order.status !== 'Pending Confirmation' && order.status !== 'Delivered'
                  }"
                >
                  {{ order.status || 'No status' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow border border-gray-100 p-6">
          <h2 class="text-xl font-bold mb-5">
            Quick Actions
          </h2>

          <div class="space-y-3">
            <router-link
              to="/admin/products"
              class="block w-full bg-green-600 hover:bg-green-700 text-white text-center px-6 py-3 rounded-lg transition"
            >
              Manage Products
            </router-link>

            <router-link
              to="/admin/orders"
              class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center px-6 py-3 rounded-lg transition"
            >
              View Orders
            </router-link>

            <router-link
              to="/admin/products/add"
              class="block w-full border border-gray-300 hover:bg-gray-50 text-center px-6 py-3 rounded-lg transition"
            >
              Add New Product
            </router-link>
          </div>

          <div class="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
            Keep product availability honest. “Available” without stock is how customers become angry final bosses.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>