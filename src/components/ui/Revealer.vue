<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
const props = defineProps({ delay: { type: Number, default: 0 }, as: { type: String, default: 'div' } })
const el = ref(null); const visible = ref(false); let observer
onMounted(() => {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { visible.value = true; return }
  observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { visible.value = true; observer.disconnect() } }, { threshold: 0.14 })
  if (el.value) observer.observe(el.value)
})
onUnmounted(() => observer?.disconnect())
</script>
<template><component :is="as" ref="el" class="reveal-build" :class="visible && 'is-visible'" :style="{ transitionDelay: `${delay}ms` }"><slot /></component></template>
