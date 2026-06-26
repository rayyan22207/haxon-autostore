<script setup>
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import { collection, getDocs, limit, query, where } from 'firebase/firestore'
import { db } from '../firebase/config'
import OrderStatusBadge from '../components/OrderStatusBadge.vue'
import {
  formatPrice,
  getOrderStatusSteps,
  getPhoneCandidates,
  normalizePhone,
  orderStatus,
  orderTotal,
} from '../lib/catalog'

const orderNumber = ref('')
const phone = ref('')
const results = ref([])
const selectedId = ref('')
const loading = ref(false)
const error = ref('')

const selectedOrder = computed(
  () =>
    results.value.find((order) => order.id === selectedId.value) ||
    (results.value.length === 1 ? results.value[0] : null),
)

const dedupe = (docs) => [...new Map(docs.map((order) => [order.id, order])).values()]

const addQuery = async (bucket, q) => {
  const snap = await getDocs(q)
  bucket.push(...snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
}

const phoneMatches = (order, normalized) => {
  if (!normalized) return true

  const candidates = [
    order.normalizedPhone,
    order.customer?.normalizedPhone,
    order.phone,
    order.customer?.phone,
  ].map(normalizePhone)

  return candidates.includes(normalized)
}

const track = async () => {
  const number = orderNumber.value.trim()
  const normalized = normalizePhone(phone.value)

  if (!number && !normalized) {
    error.value = 'Enter an order number, phone number, or both.'
    toast.error(error.value)
    return
  }

  loading.value = true
  error.value = ''
  results.value = []
  selectedId.value = ''

  try {
    const found = []

    if (number) {
      await addQuery(
        found,
        query(collection(db, 'orders'), where('orderNumber', '==', number), limit(10)),
      )
    }

    if (normalized) {
      for (const candidate of getPhoneCandidates(phone.value)) {
        await addQuery(
          found,
          query(
            collection(db, 'orders'),
            where('normalizedPhone', '==', normalizePhone(candidate)),
            limit(20),
          ),
        )

        await addQuery(
          found,
          query(
            collection(db, 'orders'),
            where('customer.normalizedPhone', '==', normalizePhone(candidate)),
            limit(20),
          ),
        )
      }
    }

    let merged = dedupe(found)

    if (number && normalized) {
      merged = merged.filter(
        (order) =>
          (order.orderNumber || '').toLowerCase() === number.toLowerCase() &&
          phoneMatches(order, normalized),
      )
    } else if (normalized) {
      merged = merged.filter((order) => phoneMatches(order, normalized))
    }

    results.value = merged

    if (merged.length === 1) {
      selectedId.value = merged[0].id
    }

    if (!merged.length) {
      error.value = 'No matching order found. Check the order number or phone format and try again.'
      toast.warning('No matching order found')
    } else {
      toast.success('Order found')
    }
  } catch (err) {
    console.error(err)
    error.value = 'Unable to check Firestore right now. Please try again or contact Haxon.'
    toast.error('Tracking lookup failed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="min-h-screen bg-black pt-[74px] text-white">
    <section class="relative overflow-hidden border-b border-white/10 bg-[#050607]">
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(229,9,20,0.12),transparent_34%),radial-gradient(circle_at_12%_80%,rgba(255,255,255,0.07),transparent_32%)]"
      ></div>

      <p
        class="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 text-[clamp(7rem,18vw,19rem)] font-black uppercase leading-none tracking-[-0.09em] text-white/[0.035] lg:block"
      >
        Track
      </p>

      <div class="relative mx-auto max-w-[1500px] px-5 py-14 sm:px-8 lg:px-12">
        <div class="max-w-4xl">
          <div class="mb-6 h-1 w-10 bg-[#E50914] shadow-[0_0_18px_rgba(229,9,20,.7)]"></div>

          <p class="text-[11px] font-black uppercase tracking-[0.32em] text-white/45">
            Precision tracking
          </p>

          <h1 class="mt-5 text-[clamp(3rem,7vw,7.2rem)] font-black uppercase leading-[0.84] tracking-[-0.075em]">
            Locate your Haxon order.
          </h1>

          <p class="mt-7 max-w-2xl text-base leading-8 text-white/55 sm:text-lg">
            Search by order number, phone number, or both. Phone matching handles common +92, 92, and 0 formats.
          </p>

          <div
            class="mt-9 grid gap-3 border border-white/10 bg-black/30 p-4 backdrop-blur md:grid-cols-[1fr_1fr_auto]"
          >
            <input
              v-model="orderNumber"
              placeholder="HXN-2026-123456"
              class="track-input"
              @keyup.enter="track"
            />

            <input
              v-model="phone"
              placeholder="03XX XXXXXXX or +92..."
              class="track-input"
              @keyup.enter="track"
            />

            <button
              class="h-12 border border-[#E50914] bg-[#E50914] px-8 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="loading"
              @click="track"
            >
              {{ loading ? 'Checking...' : 'Track' }}
            </button>
          </div>

          <p
            v-if="error"
            class="mt-5 border border-amber-300/25 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100/85"
          >
            {{ error }}
          </p>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-[1500px] px-5 py-10 sm:px-8 lg:px-12">
      <div
        v-if="results.length > 1 && !selectedOrder"
        class="grid gap-4 md:grid-cols-2"
      >
        <button
          v-for="order in results"
          :key="order.id"
          type="button"
          class="border border-white/10 bg-[#050607] p-6 text-left transition hover:border-white/25 hover:bg-[#08090b]"
          @click="selectedId = order.id"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.22em] text-white/38">
                Matching order
              </p>

              <h2 class="mt-2 text-2xl font-black uppercase tracking-[-0.04em]">
                {{ order.orderNumber || order.id }}
              </h2>
            </div>

            <OrderStatusBadge :status="orderStatus(order)" />
          </div>

          <p class="mt-4 text-sm text-white/48">
            {{ order.customer?.name || order.customerName || 'Customer' }}
            ·
            {{ order.customer?.city || order.city || 'City not listed' }}
          </p>

          <p class="mt-5 text-xl font-black">
            {{ formatPrice(orderTotal(order)) }}
          </p>
        </button>
      </div>

      <div
        v-if="selectedOrder"
        class="border border-white/10 bg-[#050607]"
      >
        <div class="border-b border-white/10 p-6 sm:p-8">
          <div class="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p class="text-[11px] font-black uppercase tracking-[0.24em] text-white/40">
                Order Status
              </p>

              <h2 class="mt-3 text-[clamp(2rem,4vw,4.8rem)] font-black uppercase leading-none tracking-[-0.06em]">
                {{ selectedOrder.orderNumber || selectedOrder.id }}
              </h2>

              <p class="mt-4 text-sm text-white/50">
                {{ selectedOrder.customer?.city || selectedOrder.city || 'City not listed' }}
                ·
                {{ selectedOrder.paymentMethod || 'Payment method not listed' }}
                ·
                {{ selectedOrder.paymentStatus || 'Unpaid' }}
              </p>
            </div>

            <OrderStatusBadge :status="orderStatus(selectedOrder)" />
          </div>
        </div>

        <div class="grid gap-0 lg:grid-cols-[1fr_390px]">
          <div class="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <p class="text-[11px] font-black uppercase tracking-[0.24em] text-white/40">
              Progress
            </p>

            <div class="mt-6 grid gap-3 md:grid-cols-5">
              <div
                v-for="step in getOrderStatusSteps(orderStatus(selectedOrder))"
                :key="step.status"
                class="border p-4 transition"
                :class="
                  step.complete
                    ? 'border-[#E50914]/45 bg-[#E50914]/10'
                    : 'border-white/10 bg-black/25'
                "
              >
                <p
                  class="text-[10px] font-black uppercase tracking-[0.16em]"
                  :class="step.complete ? 'text-white' : 'text-white/38'"
                >
                  {{ step.label }}
                </p>
              </div>
            </div>

            <div class="mt-9">
              <p class="text-[11px] font-black uppercase tracking-[0.24em] text-white/40">
                Products
              </p>

              <div class="mt-5 divide-y divide-white/10">
                <div
                  v-for="item in selectedOrder.items || selectedOrder.products || []"
                  :key="item.id || item.name"
                  class="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p class="font-black text-white/85">
                      {{ item.name }}
                    </p>

                    <p class="mt-1 text-xs text-white/38">
                      Qty {{ item.quantity || 1 }}
                    </p>
                  </div>

                  <b class="shrink-0 text-sm">
                    {{ formatPrice(Number(item.price || 0) * Number(item.quantity || 1)) }}
                  </b>
                </div>
              </div>
            </div>
          </div>

          <aside class="p-6 sm:p-8">
            <p class="text-[11px] font-black uppercase tracking-[0.24em] text-white/40">
              Timeline
            </p>

            <div class="mt-5 space-y-3">
              <div
                v-for="entry in selectedOrder.timeline || []"
                :key="`${entry.status}-${entry.createdAt || entry.at}`"
                class="border border-white/10 bg-black/25 p-4"
              >
                <p class="font-black text-white/80">
                  {{ entry.label || entry.status }}
                </p>

                <p class="mt-2 text-sm leading-6 text-white/42">
                  {{ entry.note }}
                  {{ entry.createdAt || entry.at }}
                </p>
              </div>
            </div>

            <div class="mt-7 border-t border-white/10 pt-6">
              <p class="text-sm text-white/42">
                Total
              </p>

              <p class="mt-2 text-3xl font-black tracking-[-0.05em]">
                {{ formatPrice(orderTotal(selectedOrder)) }}
              </p>
            </div>
          </aside>
        </div>
      </div>

      <div
        v-if="!results.length && !error"
        class="border border-white/10 bg-[#050607] px-6 py-16 text-center"
      >
        <p class="text-[11px] font-black uppercase tracking-[0.24em] text-white/40">
          Waiting for lookup
        </p>

        <h2 class="mt-4 text-4xl font-black uppercase tracking-[-0.05em]">
          Enter your details above.
        </h2>

        <p class="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/45">
          Your order status will appear here once a matching Haxon order is found.
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.track-input {
  height: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
  padding: 0 1rem;
  color: white;
  outline: none;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.track-input::placeholder {
  color: rgba(255, 255, 255, 0.32);
}

.track-input:focus {
  border-color: rgba(229, 9, 20, 0.7);
}
</style>