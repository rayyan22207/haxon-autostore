<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'

import { db } from '../../firebase/config'

const orders = ref([])
const loading = ref(true)
const error = ref('')

const search = ref('')
const selectedStatus = ref('')
const updatingOrderId = ref('')

const statuses = [
  'Pending Confirmation',
  'Vendor Checking',
  'Confirmed',
  'Bought from Vendor',
  'Packed',
  'Dispatched',
  'Delivered',
  'Cancelled',
]

const formatPrice = (value) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

const formatDate = (timestamp) => {
  const date = timestamp?.toDate?.()

  if (!date) return 'No date'

  return date.toLocaleString('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getOrderTotal = (order) => {
  return Number(
    order.total ||
    order.totalAmount ||
    order.grandTotal ||
    0
  )
}

const getOrderItems = (order) => {
  return order.products || order.items || []
}

const getStatusClass = (status) => {
  if (status === 'Delivered') {
    return 'bg-green-100 text-green-700'
  }

  if (status === 'Cancelled') {
    return 'bg-red-100 text-red-700'
  }

  if (
    status === 'Pending Confirmation' ||
    status === 'Vendor Checking'
  ) {
    return 'bg-yellow-100 text-yellow-700'
  }

  if (
    status === 'Dispatched' ||
    status === 'Packed'
  ) {
    return 'bg-blue-100 text-blue-700'
  }

  return 'bg-gray-100 text-gray-700'
}

const fetchOrders = async () => {
  try {
    loading.value = true
    error.value = ''

    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)

    orders.value = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }))
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load orders.'
  } finally {
    loading.value = false
  }
}

const filteredOrders = computed(() => {
  const term = search.value.toLowerCase().trim()

  return orders.value.filter((order) => {
    const searchableText = [
      order.customerName,
      order.phone,
      order.email,
      order.city,
      order.address,
      order.status,
      order.orderNumber,
      order.id,
    ]
      .join(' ')
      .toLowerCase()

    const matchesSearch =
      !term || searchableText.includes(term)

    const matchesStatus =
      !selectedStatus.value ||
      order.status === selectedStatus.value

    return matchesSearch && matchesStatus
  })
})

const stats = computed(() => {
  return {
    total: orders.value.length,
    pending: orders.value.filter(
      (order) => order.status === 'Pending Confirmation'
    ).length,
    delivered: orders.value.filter(
      (order) => order.status === 'Delivered'
    ).length,
    cancelled: orders.value.filter(
      (order) => order.status === 'Cancelled'
    ).length,
    revenue: orders.value
      .filter((order) => order.status === 'Delivered')
      .reduce((sum, order) => {
        return sum + getOrderTotal(order)
      }, 0),
  }
})

const updateStatus = async (order, status) => {
  try {
    updatingOrderId.value = order.id

    const updateData = {
      status,
      updatedAt: serverTimestamp(),
    }

    if (status === 'Delivered') {
      updateData.deliveredAt = serverTimestamp()
    }

    if (status === 'Cancelled') {
      updateData.cancelledAt = serverTimestamp()
    }

    await updateDoc(
      doc(db, 'orders', order.id),
      updateData
    )

    await fetchOrders()
  } catch (err) {
    console.error(err)
    alert('Failed to update order status.')
  } finally {
    updatingOrderId.value = ''
  }
}

const clearFilters = () => {
  search.value = ''
  selectedStatus.value = ''
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-4xl font-bold text-gray-900">
            Orders
          </h1>

          <p class="text-gray-500 mt-2">
            Manage customer orders, confirmations, dispatch, delivery, and receipts.
          </p>
        </div>

        <button
          @click="fetchOrders"
          class="border border-gray-300 hover:bg-gray-100 transition rounded-xl px-5 py-3"
        >
          Refresh
        </button>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div class="bg-white border rounded-2xl p-5 shadow-sm">
          <p class="text-gray-500 text-sm">
            Total Orders
          </p>

          <h2 class="text-3xl font-bold mt-2">
            {{ stats.total }}
          </h2>
        </div>

        <div class="bg-white border rounded-2xl p-5 shadow-sm">
          <p class="text-gray-500 text-sm">
            Pending
          </p>

          <h2 class="text-3xl font-bold mt-2 text-yellow-500">
            {{ stats.pending }}
          </h2>
        </div>

        <div class="bg-white border rounded-2xl p-5 shadow-sm">
          <p class="text-gray-500 text-sm">
            Delivered
          </p>

          <h2 class="text-3xl font-bold mt-2 text-green-600">
            {{ stats.delivered }}
          </h2>
        </div>

        <div class="bg-white border rounded-2xl p-5 shadow-sm">
          <p class="text-gray-500 text-sm">
            Cancelled
          </p>

          <h2 class="text-3xl font-bold mt-2 text-red-600">
            {{ stats.cancelled }}
          </h2>
        </div>

        <div class="bg-white border rounded-2xl p-5 shadow-sm col-span-2 lg:col-span-1">
          <p class="text-gray-500 text-sm">
            Delivered Revenue
          </p>

          <h2 class="text-2xl font-bold mt-2 text-red-600">
            {{ formatPrice(stats.revenue) }}
          </h2>
        </div>
      </div>

      <div class="bg-white border rounded-2xl shadow-sm p-5 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            v-model="search"
            placeholder="Search customer, phone, city, order number..."
            class="md:col-span-2 border rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none"
          />

          <select
            v-model="selectedStatus"
            class="border rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none"
          >
            <option value="">
              All Statuses
            </option>

            <option
              v-for="status in statuses"
              :key="status"
              :value="status"
            >
              {{ status }}
            </option>
          </select>
        </div>

        <div class="flex justify-between items-center mt-4 text-sm text-gray-500">
          <p>
            Showing {{ filteredOrders.length }} of {{ orders.length }} orders
          </p>

          <button
            @click="clearFilters"
            class="text-red-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      </div>

      <div
        v-if="loading"
        class="space-y-5"
      >
        <div
          v-for="i in 4"
          :key="i"
          class="bg-white border rounded-2xl p-6 shadow-sm animate-pulse"
        >
          <div class="h-5 bg-gray-100 rounded w-1/3 mb-4"></div>
          <div class="h-4 bg-gray-100 rounded w-1/2 mb-3"></div>
          <div class="h-4 bg-gray-100 rounded w-2/3 mb-3"></div>
          <div class="h-20 bg-gray-100 rounded-xl mt-6"></div>
        </div>
      </div>

      <div
        v-else-if="error"
        class="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6"
      >
        {{ error }}
      </div>

      <div
        v-else-if="filteredOrders.length === 0"
        class="bg-white border rounded-2xl shadow-sm p-12 text-center"
      >
        <div class="text-5xl mb-4">
          🧾
        </div>

        <h2 class="text-2xl font-bold">
          No orders found
        </h2>

        <p class="text-gray-500 mt-2">
          Either no orders exist yet, or your filters are hiding them.
        </p>

        <button
          @click="clearFilters"
          class="mt-6 border px-5 py-3 rounded-xl hover:bg-gray-50"
        >
          Clear Filters
        </button>
      </div>

      <div
        v-else
        class="space-y-6"
      >
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="bg-white border rounded-2xl shadow-sm overflow-hidden"
        >
          <div class="p-6 border-b">
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
              <div>
                <div class="flex flex-wrap items-center gap-3 mb-3">
                  <h2 class="text-2xl font-bold text-gray-900">
                    {{ order.customerName || 'Unnamed Customer' }}
                  </h2>

                  <span
                    class="text-xs font-semibold px-3 py-1 rounded-full"
                    :class="getStatusClass(order.status)"
                  >
                    {{ order.status || 'Pending Confirmation' }}
                  </span>
                </div>

                <div class="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                  <p>
                    <span class="font-medium text-gray-900">
                      Order:
                    </span>

                    {{ order.orderNumber || order.id }}
                  </p>

                  <p>
                    <span class="font-medium text-gray-900">
                      Date:
                    </span>

                    {{ formatDate(order.createdAt) }}
                  </p>

                  <p>
                    <span class="font-medium text-gray-900">
                      Phone:
                    </span>

                    {{ order.phone || '-' }}
                  </p>

                  <p>
                    <span class="font-medium text-gray-900">
                      Email:
                    </span>

                    {{ order.email || '-' }}
                  </p>

                  <p>
                    <span class="font-medium text-gray-900">
                      City:
                    </span>

                    {{ order.city || '-' }}
                  </p>

                  <p>
                    <span class="font-medium text-gray-900">
                      Payment:
                    </span>

                    {{ order.paymentMethod || 'Not selected' }}
                  </p>
                </div>

                <div class="mt-3 text-sm text-gray-600">
                  <span class="font-medium text-gray-900">
                    Address:
                  </span>

                  {{ order.address || '-' }}
                </div>

                <div
                  v-if="order.notes"
                  class="mt-3 bg-gray-50 border rounded-xl p-3 text-sm text-gray-600"
                >
                  <span class="font-medium text-gray-900">
                    Notes:
                  </span>

                  {{ order.notes }}
                </div>
              </div>

              <div class="w-full lg:w-72 space-y-3">
                <label class="block text-sm font-medium text-gray-700">
                  Update Status
                </label>

                <select
                  :value="order.status"
                  :disabled="updatingOrderId === order.id"
                  @change="updateStatus(order, $event.target.value)"
                  class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none disabled:bg-gray-100"
                >
                  <option
                    v-for="status in statuses"
                    :key="status"
                    :value="status"
                  >
                    {{ status }}
                  </option>
                </select>

                <p
                  v-if="updatingOrderId === order.id"
                  class="text-sm text-gray-500"
                >
                  Updating status...
                </p>

                <div class="bg-gray-50 border rounded-xl p-4">
                  <p class="text-sm text-gray-500">
                    Total
                  </p>

                  <h3 class="text-2xl font-bold text-red-600 mt-1">
                    {{ formatPrice(getOrderTotal(order)) }}
                  </h3>
                </div>

                <router-link
                  v-if="order.status === 'Delivered'"
                  :to="`/receipt/${order.orderNumber || order.id}`"
                  class="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition"
                >
                  View Receipt
                </router-link>
              </div>
            </div>
          </div>

          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-lg font-bold">
                  Products
                </h3>

                <p class="text-sm text-gray-500">
                  {{ getOrderItems(order).length }} item(s) in this order
                </p>
              </div>
            </div>

            <div class="space-y-3">
              <div
                v-for="item in getOrderItems(order)"
                :key="item.id || item.productId || item.name"
                class="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div class="flex items-center gap-4">
                  <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.name"
                    class="w-16 h-16 rounded-xl object-cover border bg-gray-50"
                  />

                  <div
                    v-else
                    class="w-16 h-16 rounded-xl border bg-gray-50 flex items-center justify-center text-gray-400 text-xs"
                  >
                    No image
                  </div>

                  <div>
                    <p class="font-semibold text-gray-900">
                      {{ item.name || 'Unnamed Product' }}
                    </p>

                    <p class="text-sm text-gray-500">
                      Qty: {{ item.quantity || 1 }}
                    </p>
                  </div>
                </div>

                <div class="text-left md:text-right">
                  <p class="text-sm text-gray-500">
                    Unit Price
                  </p>

                  <p class="font-semibold">
                    {{ formatPrice(item.price) }}
                  </p>
                </div>

                <div class="text-left md:text-right">
                  <p class="text-sm text-gray-500">
                    Total
                  </p>

                  <p class="font-bold text-red-600">
                    {{
                      formatPrice(
                        Number(item.price || 0) *
                        Number(item.quantity || 1)
                      )
                    }}
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-5 border-t pt-5 flex justify-end">
              <div class="w-full md:w-80 space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">
                    Subtotal
                  </span>

                  <span class="font-medium">
                    {{ formatPrice(order.subtotal || getOrderTotal(order)) }}
                  </span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-500">
                    Delivery
                  </span>

                  <span class="font-medium">
                    {{ formatPrice(order.delivery || order.deliveryCharges || 0) }}
                  </span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-500">
                    Discount
                  </span>

                  <span class="font-medium">
                    {{ formatPrice(order.discount || 0) }}
                  </span>
                </div>

                <div class="flex justify-between border-t pt-2 text-lg">
                  <span class="font-bold">
                    Grand Total
                  </span>

                  <span class="font-bold text-red-600">
                    {{ formatPrice(getOrderTotal(order)) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>