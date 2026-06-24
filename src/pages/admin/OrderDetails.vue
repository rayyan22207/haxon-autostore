<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { buildTimelineEntry, formatPrice, orderStatus, orderTotal, orderStatuses, paymentStatuses, normalizePaymentStatus } from '../../lib/catalog'
import OrderStatusBadge from '../../components/OrderStatusBadge.vue'

const route = useRoute()
const order = ref(null)
const loading = ref(true)
const saving = ref(false)
const message = ref('')
const error = ref('')
const form = ref({ orderStatus: 'Pending', paymentStatus: 'Unpaid', deliveryCharges: 0, customAdjustment: 0, adminNotes: '' })

const items = computed(() => order.value?.items || order.value?.products || [])
const calculatedTotal = computed(() => Number(order.value?.subtotal || 0) + Number(form.value.deliveryCharges || 0) + Number(form.value.customAdjustment || 0) - Number(order.value?.discount || 0))

const load = async () => {
  loading.value = true; error.value = ''; message.value = ''
  try {
    const snap = await getDoc(doc(db, 'orders', route.params.id))
    if (!snap.exists()) throw new Error('Order not found')
    order.value = { id: snap.id, ...snap.data() }
    form.value = {
      orderStatus: orderStatus(order.value),
      paymentStatus: normalizePaymentStatus(order.value.paymentStatus),
      deliveryCharges: Number(order.value.deliveryCharges ?? order.value.delivery ?? 0),
      customAdjustment: Number(order.value.customAdjustment || 0),
      adminNotes: order.value.adminNotes || '',
    }
  } catch (err) { console.error(err); error.value = err.message || 'Failed to load order.' }
  finally { loading.value = false }
}

const save = async () => {
  if (!order.value?.id) return
  saving.value = true; error.value = ''; message.value = ''
  try {
    const previousStatus = orderStatus(order.value)
    const nextStatus = form.value.orderStatus
    const timeline = [...(order.value.timeline || [])]
    if (previousStatus !== nextStatus) timeline.push(buildTimelineEntry(nextStatus, `Admin updated status from ${previousStatus} to ${nextStatus}`))
    const total = calculatedTotal.value
    const updateData = {
      orderStatus: nextStatus,
      status: nextStatus,
      paymentStatus: form.value.paymentStatus,
      deliveryCharges: Number(form.value.deliveryCharges || 0),
      delivery: Number(form.value.deliveryCharges || 0),
      customAdjustment: Number(form.value.customAdjustment || 0),
      adminNotes: form.value.adminNotes || '',
      total,
      totalAmount: total,
      timeline,
      updatedAt: serverTimestamp(),
    }
    await updateDoc(doc(db, 'orders', order.value.id), updateData)
    order.value = { ...order.value, ...updateData }
    message.value = 'Order updates saved to Firestore.'
  } catch (err) { console.error(err); error.value = 'Failed to save order updates. Please try again.' }
  finally { saving.value = false }
}

onMounted(load)
</script>
<template>
  <div class="min-h-screen bg-[#07090d] px-6 py-10 text-white">
    <div class="mx-auto max-w-6xl">
      <router-link to="/admin/orders" class="text-sm text-white/50 hover:text-white">← Orders</router-link>
      <div v-if="loading" class="mt-8 rounded-[2rem] border border-white/10 bg-white/[.04] p-10">Loading order...</div>
      <div v-else-if="error && !order" class="mt-8 rounded-[2rem] border border-red-400/30 bg-red-400/10 p-10 text-red-100">{{ error }}</div>
      <div v-else-if="order" class="mt-6 space-y-6">
        <section class="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#111827,#05070a)] p-6 shadow-2xl shadow-black/30">
          <div class="flex flex-wrap justify-between gap-4">
            <div><p class="text-xs uppercase tracking-[.35em] text-white/40">Admin order details</p><h1 class="mt-2 text-4xl font-black">{{ order.orderNumber || order.id }}</h1><p class="mt-2 text-white/55">{{ order.customer?.name || order.customerName }} · {{ order.customer?.phone || order.phone }} · {{ order.customer?.city || order.city }}</p></div>
            <OrderStatusBadge :status="orderStatus(order)" />
          </div>
          <div class="mt-8 grid gap-4 md:grid-cols-2">
            <label class="space-y-2 text-sm text-white/60">Order status<select v-model="form.orderStatus" class="input"><option v-for="s in orderStatuses" :key="s">{{ s }}</option></select></label>
            <label class="space-y-2 text-sm text-white/60">Payment status<select v-model="form.paymentStatus" class="input"><option v-for="s in paymentStatuses" :key="s">{{ s }}</option></select></label>
            <label class="space-y-2 text-sm text-white/60">Delivery charges<input v-model.number="form.deliveryCharges" type="number" class="input" /></label>
            <label class="space-y-2 text-sm text-white/60">Custom adjustment<input v-model.number="form.customAdjustment" type="number" class="input" /></label>
            <label class="space-y-2 text-sm text-white/60 md:col-span-2">Admin notes<textarea v-model="form.adminNotes" class="input min-h-28"></textarea></label>
          </div>
          <div class="mt-5 flex flex-wrap items-center gap-3"><button class="rounded-full bg-white px-7 py-3 font-black uppercase tracking-[.16em] text-black disabled:opacity-50" :disabled="saving" @click="save">{{ saving ? 'Saving...' : 'Save order updates' }}</button><span v-if="message" class="text-emerald-200">{{ message }}</span><span v-if="error" class="text-red-200">{{ error }}</span></div>
        </section>
        <section class="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div class="rounded-[2rem] border border-white/10 bg-white/[.04] p-6"><h2 class="text-2xl font-black">Products</h2><div v-for="item in items" :key="item.id || item.name" class="mt-4 flex justify-between gap-4 border-t border-white/10 pt-4"><div><p class="font-bold">{{ item.name }}</p><p class="text-sm text-white/45">{{ item.productMode || 'Confirm Fitment' }} · Qty {{ item.quantity || 1 }}</p></div><b>{{ formatPrice(Number(item.price||0) * Number(item.quantity||1)) }}</b></div></div>
          <div class="rounded-[2rem] border border-white/10 bg-white/[.04] p-6"><h2 class="text-2xl font-black">Totals & timeline</h2><div class="mt-4 space-y-2 text-sm"><p class="flex justify-between"><span>Subtotal</span><b>{{ formatPrice(order.subtotal) }}</b></p><p class="flex justify-between"><span>Delivery</span><b>{{ formatPrice(form.deliveryCharges) }}</b></p><p class="flex justify-between"><span>Adjustment</span><b>{{ formatPrice(form.customAdjustment) }}</b></p><p class="flex justify-between border-t border-white/10 pt-3 text-xl"><span>Total</span><b>{{ formatPrice(orderTotal(order)) }}</b></p></div><div class="mt-6 space-y-3"><div v-for="entry in (order.timeline || [])" :key="`${entry.status}-${entry.createdAt || entry.at}`" class="rounded-2xl border border-white/10 p-3"><p class="font-bold">{{ entry.label || entry.status }}</p><p class="text-xs text-white/45">{{ entry.note }} {{ entry.createdAt || entry.at }}</p></div></div></div>
        </section>
      </div>
    </div>
  </div>
</template>
<style scoped>.input{width:100%;border-radius:1rem;border:1px solid rgba(255,255,255,.1);background:#05070a;padding:1rem;color:white;outline:none}.input:focus{border-color:rgba(255,255,255,.35)}</style>
