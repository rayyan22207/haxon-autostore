<script setup>
import { ref, watch } from 'vue'
import { FALLBACK_IMAGE } from '../../lib/catalog'
const props = defineProps({ src: String, alt: { type: String, default: 'Haxon image' }, fit: { type: String, default: 'cover' }, ratio: { type: String, default: 'aspect-square' }, imgClass: { type: String, default: '' } })
const loaded = ref(false)
const current = ref(props.src || FALLBACK_IMAGE)
watch(() => props.src, (value) => { loaded.value = false; current.value = value || FALLBACK_IMAGE })
const fail = () => { current.value = FALLBACK_IMAGE; loaded.value = true }
</script>
<template>
  <div class="relative overflow-hidden bg-[#07080a]" :class="ratio">
    <div v-if="!loaded" class="absolute inset-0 animate-pulse bg-gradient-to-br from-white/[0.03] via-white/[0.08] to-white/[0.03]"></div>
    <img :src="current" :alt="alt" loading="lazy" decoding="async" class="h-full w-full transition duration-500" :class="[loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm', fit === 'contain' ? 'object-contain' : 'object-cover', imgClass]" @load="loaded = true" @error="fail" />
  </div>
</template>
