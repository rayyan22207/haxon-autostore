<script setup>
defineProps({ status: { type: String, default: 'Pending' } })
const colors = { Pending: 'border-amber-300/30 bg-amber-300/10 text-amber-100', Confirmed: 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100', Processing: 'border-blue-300/30 bg-blue-300/10 text-blue-100', Packed: 'border-indigo-300/30 bg-indigo-300/10 text-indigo-100', Dispatched: 'border-purple-300/30 bg-purple-300/10 text-purple-100', Delivered: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100', Cancelled: 'border-red-300/30 bg-red-300/10 text-red-100' }
</script><template><span class="rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[.18em]" :class="colors[status] || colors.Pending">{{ status }}</span></template>
