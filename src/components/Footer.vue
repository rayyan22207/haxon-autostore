<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useContentStore } from '../stores/contentStore'
const route = useRoute(); const year = new Date().getFullYear(); const isAdmin = computed(() => route.path.startsWith('/admin')); const auth = useAuthStore(); const content = useContentStore()
onMounted(() => content.loadStorefrontContent())
const links = [ { label: 'Shop', to: '/products' }, { label: 'Brands', to: '/brands' }, { label: 'Track Order', to: '/track-order' }, { label: 'Contact', to: '/contact' }]
const adminLinks = computed(() => [ { label: 'Dashboard', to: '/admin' }, auth.hasPermission('manage_products') && { label: 'Products', to: '/admin/products' }, auth.hasPermission('manage_orders') && { label: 'Orders', to: '/admin/orders' }, auth.hasPermission('manage_content') && { label: 'Content', to: '/admin/content' }, { label: 'View Store', to: '/' }].filter(Boolean))
</script>
<template>
  <footer v-if="!isAdmin" class="relative overflow-hidden border-t border-white/10 bg-[#050608] text-white">
    <div class="oversized-word left-1/2 top-8 -translate-x-1/2 !text-[20vw]">HAXON</div>
    <div class="premium-container relative py-14"><div class="grid gap-8 md:grid-cols-[1.2fr_.8fr]"><div><p class="text-4xl font-black tracking-[0.22em]">{{ content.siteSettings.brandName }}</p><p class="mt-4 max-w-xl text-sm leading-7 text-white/50">{{ content.siteSettings.footerStatement }}</p><div class="mt-6 flex flex-wrap gap-2"><span v-for="chip in ['WhatsApp concierge','Fitment checked','Premium imports']" :key="chip" class="rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-white/55">{{ chip }}</span></div></div><div class="flex flex-wrap gap-4 md:justify-end"><router-link v-for="link in links" :key="link.label" :to="link.to" class="text-sm text-white/55 hover:text-white">{{ link.label }}</router-link><router-link v-if="auth.isAdmin" to="/admin" class="text-sm text-red-300 hover:text-white">Admin</router-link></div></div><p class="mt-10 text-xs text-white/35">© {{ year }} {{ content.siteSettings.brandName }}. {{ content.siteSettings.location }}</p></div>
  </footer>
  <footer v-else class="border-t border-white/10 bg-[#070707] text-white"><div class="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 md:flex-row md:items-center md:justify-between"><p class="text-xl font-black tracking-[0.18em]">HAXON</p><div class="flex flex-wrap gap-4 text-sm"><router-link v-for="link in adminLinks" :key="link.label" :to="link.to" class="text-white/50 hover:text-white">{{ link.label }}</router-link></div><p class="text-xs text-white/35">© {{ year }} Haxon Admin</p></div></footer>
</template>
