<script setup>
import { computed, ref } from 'vue'
import { collection, getDocs, limit, query, where } from 'firebase/firestore'
import { db } from '../firebase/config'
import OrderStatusBadge from '../components/OrderStatusBadge.vue'
import { formatPrice, getOrderStatusSteps, getPhoneCandidates, normalizePhone, orderStatus, orderTotal } from '../lib/catalog'

const orderNumber = ref('')
const phone = ref('')
const results = ref([])
const selectedId = ref('')
const loading = ref(false)
const error = ref('')
const selectedOrder = computed(() => results.value.find((o) => o.id === selectedId.value) || (results.value.length === 1 ? results.value[0] : null))

const dedupe = (docs) => [...new Map(docs.map((o) => [o.id, o])).values()]
const addQuery = async (queries, q) => { const snap = await getDocs(q); queries.push(...snap.docs.map((d) => ({ id: d.id, ...d.data() }))) }
const phoneMatches = (order, normalized) => {
  if (!normalized) return true
  const candidates = [order.normalizedPhone, order.customer?.normalizedPhone, order.phone, order.customer?.phone].map(normalizePhone)
  return candidates.includes(normalized)
}

const track = async () => {
  const number = orderNumber.value.trim()
  const normalized = normalizePhone(phone.value)
  if (!number && !normalized) { error.value = 'Enter an order number, phone number, or both.'; return }
  loading.value = true; error.value = ''; results.value = []; selectedId.value = ''
  try {
    const found = []
    if (number) await addQuery(found, query(collection(db, 'orders'), where('orderNumber', '==', number), limit(10)))
    if (normalized) {
      for (const candidate of getPhoneCandidates(phone.value)) {
        await addQuery(found, query(collection(db, 'orders'), where('normalizedPhone', '==', normalizePhone(candidate)), limit(20)))
        await addQuery(found, query(collection(db, 'orders'), where('customer.normalizedPhone', '==', normalizePhone(candidate)), limit(20)))
      }
    }
    let merged = dedupe(found)
    if (number && normalized) merged = merged.filter((o) => (o.orderNumber || '').toLowerCase() === number.toLowerCase() && phoneMatches(o, normalized))
    else if (normalized) merged = merged.filter((o) => phoneMatches(o, normalized))
    results.value = merged
    if (merged.length === 1) selectedId.value = merged[0].id
    if (!merged.length) error.value = 'No matching order found. Check the order number or phone format and try again.'
  } catch (err) { console.error(err); error.value = 'Unable to check Firestore right now. Please try again or contact Haxon.' }
  finally { loading.value = false }
}
</script>
<template>
  <div class="min-h-screen bg-[#080a0d] text-[#F5F5F2]">
    <section class="relative overflow-hidden px-6 py-20"><div class="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(220,38,38,.18),transparent_32%),linear-gradient(135deg,#111827,#05070a)]"></div><div class="relative mx-auto max-w-6xl"><p class="text-xs uppercase tracking-[.45em] text-white/45">Precision tracking</p><h1 class="mt-4 max-w-4xl text-6xl font-black tracking-[-.06em] md:text-8xl">Locate your Haxon order.</h1><p class="mt-6 max-w-2xl text-lg text-white/55">Search by order number only, phone only, or combine both for a tighter match. Phone matching handles common +92 / 92 / 0 formats.</p>
      <div class="mt-10 grid gap-3 rounded-[2rem] border border-white/10 bg-black/30 p-4 backdrop-blur md:grid-cols-[1fr_1fr_auto]"><input v-model="orderNumber" placeholder="HXN-2026-123456" class="input" @keyup.enter="track"/><input v-model="phone" placeholder="03XX XXXXXXX or +92..." class="input" @keyup.enter="track"/><button class="rounded-2xl bg-white px-8 py-4 font-black uppercase tracking-[.16em] text-black" @click="track">{{ loading ? 'Checking...' : 'Track' }}</button></div><p v-if="error" class="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-amber-100">{{ error }}</p></div></section>
    <section class="mx-auto max-w-6xl px-6 pb-20">
      <div v-if="results.length > 1 && !selectedOrder" class="grid gap-4 md:grid-cols-2"><button v-for="order in results" :key="order.id" class="rounded-[2rem] border border-white/10 bg-white/[.04] p-6 text-left transition hover:bg-white/[.08]" @click="selectedId = order.id"><div class="flex items-center justify-between gap-3"><h2 class="text-2xl font-black">{{ order.orderNumber || order.id }}</h2><OrderStatusBadge :status="orderStatus(order)" /></div><p class="mt-3 text-white/50">{{ order.customer?.name || order.customerName }} · {{ order.customer?.city || order.city }}</p><p class="mt-4 font-black">{{ formatPrice(orderTotal(order)) }}</p></button></div>
      <div v-if="selectedOrder" class="rounded-[2.5rem] border border-white/10 bg-white/[.04] p-6 md:p-8"><div class="flex flex-wrap items-start justify-between gap-4"><div><p class="text-xs uppercase tracking-[.35em] text-white/40">Order status</p><h2 class="mt-2 text-4xl font-black">{{ selectedOrder.orderNumber || selectedOrder.id }}</h2><p class="mt-2 text-white/55">{{ selectedOrder.customer?.city || selectedOrder.city }} · {{ selectedOrder.paymentMethod }} · {{ selectedOrder.paymentStatus || 'Unpaid' }}</p></div><OrderStatusBadge :status="orderStatus(selectedOrder)" /></div>
        <div class="mt-8 grid gap-3 md:grid-cols-6"><div v-for="step in getOrderStatusSteps(orderStatus(selectedOrder))" :key="step.status" class="rounded-2xl border p-4" :class="step.complete ? 'border-white/25 bg-white/10' : 'border-white/10 bg-black/20'"><p class="text-[10px] font-bold uppercase tracking-[.18em]">{{ step.label }}</p></div></div>
        <div class="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><div><h3 class="text-2xl font-black">Products</h3><div v-for="item in (selectedOrder.items || selectedOrder.products || [])" :key="item.id || item.name" class="mt-4 flex justify-between border-t border-white/10 pt-4"><span>{{ item.name }} × {{ item.quantity || 1 }}</span><b>{{ formatPrice(Number(item.price||0) * Number(item.quantity||1)) }}</b></div></div><div><h3 class="text-2xl font-black">Timeline</h3><div class="mt-4 space-y-3"><div v-for="entry in (selectedOrder.timeline || [])" :key="`${entry.status}-${entry.createdAt || entry.at}`" class="rounded-2xl border border-white/10 p-4"><p class="font-bold">{{ entry.label || entry.status }}</p><p class="text-sm text-white/45">{{ entry.note }} {{ entry.createdAt || entry.at }}</p></div></div><p class="mt-6 text-2xl font-black">Total {{ formatPrice(orderTotal(selectedOrder)) }}</p></div></div>
      </div>
    </section>
  </div>
</template>
<style scoped>.input{border-radius:1rem;border:1px solid rgba(255,255,255,.1);background:#07090d;padding:1rem;color:white;outline:none}.input:focus{border-color:rgba(255,255,255,.35)}</style>
