<script setup>
import { onMounted, ref } from 'vue'
const visible = ref(false)
const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
onMounted(() => {
  if (sessionStorage.getItem('haxonIntroSeen')) return
  sessionStorage.setItem('haxonIntroSeen', 'true')
  visible.value = true
  window.setTimeout(() => { visible.value = false }, reduce ? 700 : 3600)
})
</script>
<template>
  <Transition name="intro-fade"><div v-if="visible" class="fixed inset-0 z-[9999] grid place-items-center bg-black text-white"><div class="text-center"><img src="/image/haxon-logo.png" alt="Haxon" class="mx-auto mb-7 h-16 w-16 object-contain opacity-90" /><h1 class="animate-intro-logo text-5xl font-black uppercase tracking-[.18em]">HAXON</h1><p class="mx-auto mt-4 w-[10ch] overflow-hidden whitespace-nowrap border-r border-[#E50914] text-sm font-black uppercase tracking-[.32em] text-white/55" :class="reduce ? '' : 'animate-type'">Automotive</p></div></div></Transition>
</template>
<style scoped>
.intro-fade-enter-active,.intro-fade-leave-active{transition:opacity .8s ease}.intro-fade-enter-from,.intro-fade-leave-to{opacity:0}.animate-intro-logo{animation:introLogo 1.1s ease both}.animate-type{animation:typing 1.1s steps(10,end) .9s both, caret .7s step-end infinite}@keyframes introLogo{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}@keyframes typing{from{width:0}to{width:10ch}}@keyframes caret{50%{border-color:transparent}}@media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}}
</style>
