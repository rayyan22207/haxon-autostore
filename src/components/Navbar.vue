<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'

const route = useRoute(); const router = useRouter(); const cartStore = useCartStore(); const auth = useAuthStore(); const mobileMenu = ref(false)
const isAdmin = computed(() => route.path.startsWith('/admin'))
const storeLinks = [ { label: 'Home', to: '/' }, { label: 'Shop', to: '/products' }, { label: 'Track', to: '/track-order' }, { label: 'Brands', to: '/brands' }, { label: 'Contact', to: '/contact' }]
const allAdminLinks = [ { label: 'Dashboard', to: '/admin' }, { label: 'Products', to: '/admin/products', permission: 'manage_products' }, { label: 'Orders', to: '/admin/orders', permission: 'manage_orders' }, { label: 'Content', to: '/admin/content', permission: 'manage_content' }, { label: 'View Store', to: '/' }]
const adminLinks = computed(() => allAdminLinks.filter((link) => !link.permission || auth.hasPermission(link.permission)))
const links = computed(() => (isAdmin.value ? adminLinks.value : storeLinks))
const closeMobileMenu = () => { mobileMenu.value = false }
const isActive = (path) => path === '/' ? route.path === '/' : route.path.startsWith(path)
const logout = async () => { await auth.logout(); toast.success('Admin signed out'); closeMobileMenu(); router.push('/admin/login') }
</script>
<template>
  <header class="fixed left-0 right-0 top-0 z-50 px-3 pt-3 text-white sm:px-5 sm:pt-5">
    <nav class="mx-auto max-w-7xl glass-nav rounded-[1.6rem]">
      <div class="flex items-center justify-between px-4 py-3 sm:px-5">
        <router-link :to="isAdmin ? '/admin' : '/'" class="leading-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400" @click="closeMobileMenu"><span class="block text-2xl font-black tracking-[0.24em] md:text-3xl">HAXON</span><span class="mt-1 block text-[9px] font-black uppercase tracking-[0.42em] text-[#E50914]">{{ isAdmin ? 'Control Panel' : 'Autostore' }}</span></router-link>
        <div class="hidden items-center rounded-full border border-white/10 bg-white/[.045] p-1 lg:flex">
          <router-link v-for="link in links" :key="link.label" :to="link.to" class="nav-pill" :class="isActive(link.to) ? 'nav-pill-active' : ''">{{ link.label }}</router-link>
        </div>
        <div class="hidden items-center gap-2 lg:flex">
          <router-link v-if="!isAdmin" to="/products" class="icon-pill" aria-label="Search">⌕</router-link>
          <router-link v-if="!isAdmin" to="/cart" class="icon-pill relative" aria-label="Cart">☐<span v-if="cartStore.totalItems" class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E50914] px-1 text-[10px] font-black text-white">{{ cartStore.totalItems }}</span></router-link>
          <router-link v-if="isAdmin && auth.hasPermission('manage_products')" to="/admin/products/add" class="rounded-full bg-white px-5 py-3 text-xs font-black uppercase tracking-[.16em] text-black transition hover:bg-red-500 hover:text-white">+ Add Product</router-link>
          <button v-if="isAdmin" class="admin-btn-secondary !py-3" @click="logout">Logout</button>
        </div>
        <div class="flex items-center gap-2 lg:hidden"><router-link v-if="!isAdmin" to="/cart" class="icon-pill relative" @click="closeMobileMenu">☐<span v-if="cartStore.totalItems" class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E50914] px-1 text-[10px] font-black text-white">{{ cartStore.totalItems }}</span></router-link><button type="button" class="icon-pill text-xl" @click="mobileMenu = !mobileMenu" aria-label="Toggle menu">{{ mobileMenu ? '×' : '☰' }}</button></div>
      </div>
      <transition name="hero-fade"><div v-if="mobileMenu" class="border-t border-white/10 p-3 lg:hidden"><router-link v-for="link in links" :key="link.label" :to="link.to" class="nav-mobile-pill" :class="isActive(link.to) ? 'nav-pill-active' : ''" @click="closeMobileMenu">{{ link.label }}</router-link><button v-if="isAdmin" class="nav-mobile-pill w-full text-left" @click="logout">Logout</button></div></transition>
    </nav>
  </header>
</template>
