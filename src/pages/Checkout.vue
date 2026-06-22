<script setup>
import { ref, computed } from 'vue'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { db } from '../firebase/config'
import { useCartStore } from '../stores/cartStore'
import { toast } from 'vue-sonner'

const router = useRouter()
const cartStore = useCartStore()

const form = ref({
  name: '',
  phone: '',
  city: '',
  address: '',
  notes: '',
  paymentMethod: 'Cash on Delivery',
})

const loading = ref(false)

const formatPrice = (value) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

const getItemPrice = (item) => {
  if (
    item.saleEnabled &&
    item.salePrice &&
    Number(item.salePrice) < Number(item.price)
  ) {
    return Number(item.salePrice)
  }

  return Number(item.price || 0)
}

const subtotal = computed(() => {
  return cartStore.items.reduce((total, item) => {
    return total + getItemPrice(item) * Number(item.quantity || 1)
  }, 0)
})

const isValid = computed(() => {
  return (
    form.value.name.trim() &&
    form.value.phone.trim() &&
    form.value.city.trim() &&
    form.value.address.trim()
  )
})

const generateOrderNumber = () => {
  const year = new Date().getFullYear()
  const random = Math.floor(100000 + Math.random() * 900000)

  return `HXN-${year}-${random}`
}

const placeOrder = async () => {
  if (!cartStore.items.length) {
    toast.warning('Cart is empty.')
    return
  }

  if (!isValid.value) {
    toast.success('Please complete all required fields.')
    return
  } else {
    toast.error('Something went wrong.')
  }

  try {
    loading.value = true

    const orderNumber = generateOrderNumber()

    const orderItems = cartStore.items.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category || '',
      image: item.image || '',
      price: getItemPrice(item),
      originalPrice: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
      carBrand: item.carBrand || '',
      carModel: item.carModel || '',
    }))

    await addDoc(collection(db, 'orders'), {
      orderNumber,

      customerName: form.value.name.trim(),
      phone: form.value.phone.trim(),
      city: form.value.city.trim(),
      address: form.value.address.trim(),
      notes: form.value.notes.trim(),
      paymentMethod: form.value.paymentMethod,

      products: orderItems,
      items: orderItems,

      subtotal: subtotal.value,
      delivery: 0,
      discount: 0,
      total: subtotal.value,
      totalAmount: subtotal.value,

      status: 'Pending Confirmation',

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    cartStore.clearCart()

    alert(`Order placed successfully. Your order number is ${orderNumber}.`)

    router.push('/')
  } catch (err) {
    console.error(err)
    alert('Failed to place order.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#121212] text-white">
    <section class="relative bg-[#17191B] border-b border-white/10 overflow-hidden">
      <div class="absolute inset-0 bg-[linear-gradient(135deg,#101112_0%,#1B1E21_45%,#252A2F_55%,#111213_100%)]"></div>

      <div class="relative max-w-7xl mx-auto px-6 py-12">
        <div class="flex items-center gap-4 mb-4">
          <span class="h-px w-10 bg-[#D90429]"></span>

          <p class="uppercase tracking-[0.34em] text-[#C0C0C0] text-[11px] font-semibold">
            Secure Checkout
          </p>

          <span class="h-px w-10 bg-[#D90429]"></span>
        </div>

        <h1 class="text-4xl md:text-6xl font-black tracking-tight">
          Checkout.
        </h1>

        <p class="text-[#C0C0C0] mt-4 max-w-2xl">
          Submit your order details. Haxon will confirm availability and delivery before dispatch.
        </p>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 py-10">
      <div
        v-if="cartStore.items.length"
        class="grid lg:grid-cols-3 gap-8"
      >
        <div class="lg:col-span-2 bg-[#181A1D] border border-white/10 rounded-[2rem] p-6 md:p-8">
          <h2 class="text-2xl font-black mb-6">
            Customer Details
          </h2>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs uppercase tracking-[0.24em] text-[#C0C0C0] mb-2">
                Full Name *
              </label>

              <input
                v-model="form.name"
                placeholder="Your full name"
                class="w-full bg-[#121212] border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-[#C0C0C0]/50 focus:outline-none focus:border-[#D90429] transition"
              />
            </div>

            <div>
              <label class="block text-xs uppercase tracking-[0.24em] text-[#C0C0C0] mb-2">
                Phone Number *
              </label>

              <input
                v-model="form.phone"
                placeholder="03XX XXXXXXX"
                class="w-full bg-[#121212] border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-[#C0C0C0]/50 focus:outline-none focus:border-[#D90429] transition"
              />
            </div>

            <div>
              <label class="block text-xs uppercase tracking-[0.24em] text-[#C0C0C0] mb-2">
                City *
              </label>

              <input
                v-model="form.city"
                placeholder="Karachi"
                class="w-full bg-[#121212] border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-[#C0C0C0]/50 focus:outline-none focus:border-[#D90429] transition"
              />
            </div>

            <div>
              <label class="block text-xs uppercase tracking-[0.24em] text-[#C0C0C0] mb-2">
                Payment Method
              </label>

              <select
                v-model="form.paymentMethod"
                class="w-full bg-[#121212] border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-[#D90429] transition"
              >
                <option>Cash on Delivery</option>
                <option>Bank Transfer</option>
                <option>Easypaisa</option>
                <option>JazzCash</option>
              </select>
            </div>
          </div>

          <div class="mt-4">
            <label class="block text-xs uppercase tracking-[0.24em] text-[#C0C0C0] mb-2">
              Delivery Address *
            </label>

            <textarea
              v-model="form.address"
              placeholder="House, street, area, landmark..."
              rows="4"
              class="w-full bg-[#121212] border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-[#C0C0C0]/50 focus:outline-none focus:border-[#D90429] transition"
            />
          </div>

          <div class="mt-4">
            <label class="block text-xs uppercase tracking-[0.24em] text-[#C0C0C0] mb-2">
              Order Notes
            </label>

            <textarea
              v-model="form.notes"
              placeholder="Car model, preferred timing, fitting notes..."
              rows="3"
              class="w-full bg-[#121212] border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-[#C0C0C0]/50 focus:outline-none focus:border-[#D90429] transition"
            />
          </div>
        </div>

        <aside class="bg-[#181A1D] border border-white/10 rounded-[2rem] p-6 h-fit sticky top-28 shadow-2xl shadow-black/20">
          <h2 class="text-2xl font-black">
            Order Summary
          </h2>

          <div class="mt-6 space-y-4">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex gap-3 border-b border-white/10 pb-4"
            >
              <img
                :src="item.image || '/images/no-image.jpg'"
                :alt="item.name"
                class="w-16 h-16 object-cover rounded-xl border border-white/10"
                @error="$event.target.src = '/images/no-image.jpg'"
              />

              <div class="flex-1">
                <p class="font-bold text-sm line-clamp-2">
                  {{ item.name }}
                </p>

                <p class="text-[#C0C0C0] text-xs mt-1">
                  Qty: {{ item.quantity }}
                </p>
              </div>

              <p class="font-bold text-sm text-[#D90429]">
                {{ formatPrice(getItemPrice(item) * Number(item.quantity || 1)) }}
              </p>
            </div>
          </div>

          <div class="mt-6 space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-[#C0C0C0]">
                Subtotal
              </span>

              <span class="font-bold">
                {{ formatPrice(subtotal) }}
              </span>
            </div>

            <div class="flex justify-between">
              <span class="text-[#C0C0C0]">
                Delivery
              </span>

              <span class="font-bold">
                Confirmed later
              </span>
            </div>
          </div>

          <div class="border-t border-white/10 mt-6 pt-6 flex justify-between items-center">
            <span class="text-[#C0C0C0]">
              Estimated Total
            </span>

            <span class="text-3xl font-black text-[#D90429]">
              {{ formatPrice(subtotal) }}
            </span>
          </div>

          <button
            @click="placeOrder"
            :disabled="loading || !isValid"
            class="w-full mt-6 bg-[#D90429] hover:bg-red-700 disabled:bg-red-900 disabled:text-white/50 text-white px-6 py-4 rounded-2xl text-center font-black transition shadow-xl shadow-black/30"
          >
            {{ loading ? 'Placing Order...' : 'Place Order' }}
          </button>

          <p class="text-xs text-[#C0C0C0] mt-4 leading-relaxed">
            This is not a final invoice. Haxon will confirm availability, delivery charges, and dispatch details before sending.
          </p>
        </aside>
      </div>

      <div
        v-else
        class="bg-[#181A1D] border border-white/10 rounded-[2rem] p-12 text-center"
      >
        <div class="text-6xl mb-5">
          🛒
        </div>

        <h2 class="text-3xl font-black">
          Your cart is empty
        </h2>

        <p class="text-[#C0C0C0] mt-3">
          Add products before checkout.
        </p>

        <router-link
          to="/products"
          class="inline-block mt-6 bg-[#D90429] hover:bg-red-700 text-white px-7 py-4 rounded-2xl font-black transition"
        >
          Browse Products
        </router-link>
      </div>
    </section>
  </div>
</template>