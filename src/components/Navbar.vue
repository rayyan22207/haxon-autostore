<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const auth = useAuthStore()

const mobileMenu = ref(false)
const heroPassed = ref(false)

const isAdmin = computed(() => route.path.startsWith('/admin'))
const isHome = computed(() => route.path === '/')

const whitePages = [
  '/products',
  '/brands',
  '/cars',
  '/about',
  '/contact',
  '/cart',
  '/account',
]

const isWhitePage = computed(() =>
  whitePages.some((path) => route.path === path || route.path.startsWith(`${path}/`)),
)

const navMode = computed(() => {
  if (isAdmin.value) return 'black'
  if (isHome.value && !heroPassed.value) return 'clear'
  if (isWhitePage.value) return 'white'
  return 'black'
})

const isWhiteNav = computed(() => navMode.value === 'white')

const logoSrc = computed(() =>
  isWhiteNav.value ? '/image/haxon-logo-black.png' : '/image/haxon-logo.png',
)

const storeLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
  { label: 'Brands', to: '/brands' },
  { label: 'Cars', to: '/cars' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const allAdminLinks = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Products', to: '/admin/products', permission: 'manage_products' },
  { label: 'Orders', to: '/admin/orders', permission: 'manage_orders' },
  { label: 'Content', to: '/admin/content', permission: 'manage_content' },
  { label: 'View Store', to: '/' },
]

const adminLinks = computed(() =>
  allAdminLinks.filter((link) => !link.permission || auth.hasPermission(link.permission)),
)

const links = computed(() => (isAdmin.value ? adminLinks.value : storeLinks))

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const closeMobileMenu = () => {
  mobileMenu.value = false
}

const updateNavbarState = () => {
  if (!isHome.value || isAdmin.value) {
    heroPassed.value = true
    return
  }

  const hero = document.querySelector('[data-hero-section]')
  const threshold = hero ? hero.offsetHeight - 96 : window.innerHeight * 0.82

  heroPassed.value = window.scrollY >= threshold
}

const logout = async () => {
  await auth.logout()
  toast.success('Admin signed out')
  closeMobileMenu()
  router.push('/admin/login')
}

watch(
  () => route.path,
  () => {
    closeMobileMenu()
    requestAnimationFrame(updateNavbarState)
  },
)

onMounted(() => {
  updateNavbarState()
  window.addEventListener('scroll', updateNavbarState, { passive: true })
  window.addEventListener('resize', updateNavbarState, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateNavbarState)
  window.removeEventListener('resize', updateNavbarState)
})
</script>

<template>
  <header class="fixed left-0 right-0 top-0 z-50">
    <nav
      class="transition-all duration-500"
      :class="{
        'bg-transparent text-white': navMode === 'clear',
        'border-b border-black/10 bg-white/90 text-black shadow-sm backdrop-blur-xl': navMode === 'white',
        'border-b border-white/10 bg-black/90 text-white backdrop-blur-xl': navMode === 'black',
      }"
    >
      <div class="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <router-link
          :to="isAdmin ? '/admin' : '/'"
          class="flex items-center gap-3 leading-none"
          @click="closeMobileMenu"
        >
          <div class="grid h-10 w-10 place-items-center">
            <img
              :src="logoSrc"
              alt="Haxon"
              class="h-9 w-9 object-contain"
            />
          </div>

          <div>
            <div class="text-[22px] font-black uppercase tracking-[0.22em]">
              Haxon
            </div>

            <div
              class="mt-1 text-[9px] font-bold uppercase tracking-[0.42em]"
              :class="isWhiteNav ? 'text-black/55' : 'text-white/55'"
            >
              {{ isAdmin ? 'Control Panel' : 'Automotive' }}
            </div>
          </div>
        </router-link>

        <div class="hidden items-center gap-9 lg:flex">
          <router-link
            v-for="link in links"
            :key="link.label"
            :to="link.to"
            class="text-[12px] font-black uppercase tracking-[0.18em] transition"
            :class="[
              isWhiteNav
                ? 'text-black/45 hover:text-black'
                : 'text-white/45 hover:text-white',
              isActive(link.to)
                ? isWhiteNav
                  ? 'text-black'
                  : 'text-white'
                : '',
            ]"
          >
            {{ link.label }}
          </router-link>
        </div>

        <div class="hidden items-center gap-5 lg:flex">
          <router-link
            v-if="!isAdmin"
            to="/products"
            class="transition hover:opacity-70"
            aria-label="Search"
          >
            <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none">
              <path
                d="M11 19a8 8 0 1 1 5.657-13.657A8 8 0 0 1 11 19Zm6-2 4 4"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
              />
            </svg>
          </router-link>

          <router-link
            v-if="!isAdmin"
            to="/account"
            class="transition hover:opacity-70"
            aria-label="Account"
          >
            <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none">
              <path
                d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
                stroke="currentColor"
                stroke-width="2.1"
                stroke-linecap="round"
              />
            </svg>
          </router-link>

          <router-link
            v-if="!isAdmin"
            to="/cart"
            class="relative transition hover:opacity-70"
            aria-label="Cart"
          >
            <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none">
              <path
                d="M6 6h15l-2 9H8L6 6Zm0 0L5 3H2m7 18h.01M18 21h.01"
                stroke="currentColor"
                stroke-width="2.1"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span
              v-if="cartStore.totalItems"
              class="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#E50914] px-1 text-[10px] font-black text-white"
            >
              {{ cartStore.totalItems }}
            </span>
          </router-link>

          <router-link
            v-if="isAdmin && auth.hasPermission('manage_products')"
            to="/admin/products/add"
            class="rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.16em] transition"
            :class="isWhiteNav ? 'bg-black text-white hover:bg-[#E50914]' : 'bg-white text-black hover:bg-[#E50914] hover:text-white'"
          >
            + Add Product
          </router-link>

          <button
            v-if="isAdmin"
            class="rounded-full border px-5 py-3 text-xs font-black uppercase tracking-[0.16em] transition"
            :class="isWhiteNav ? 'border-black/15 text-black hover:bg-black hover:text-white' : 'border-white/15 text-white hover:bg-white/10'"
            @click="logout"
          >
            Logout
          </button>
        </div>

        <div class="flex items-center gap-3 lg:hidden">
          <router-link
            v-if="!isAdmin"
            to="/cart"
            class="relative transition hover:opacity-70"
            @click="closeMobileMenu"
          >
            <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none">
              <path
                d="M6 6h15l-2 9H8L6 6Zm0 0L5 3H2m7 18h.01M18 21h.01"
                stroke="currentColor"
                stroke-width="2.1"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span
              v-if="cartStore.totalItems"
              class="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#E50914] px-1 text-[10px] font-black text-white"
            >
              {{ cartStore.totalItems }}
            </span>
          </router-link>

          <button
            type="button"
            class="text-3xl leading-none transition hover:opacity-70"
            aria-label="Toggle menu"
            @click="mobileMenu = !mobileMenu"
          >
            {{ mobileMenu ? '×' : '☰' }}
          </button>
        </div>
      </div>

      <transition name="hero-fade">
        <div
          v-if="mobileMenu"
          class="border-t px-5 py-4 backdrop-blur-xl lg:hidden"
          :class="isWhiteNav ? 'border-black/10 bg-white/95 text-black' : 'border-white/10 bg-black/95 text-white'"
        >
          <router-link
            v-for="link in links"
            :key="link.label"
            :to="link.to"
            class="block py-4 text-sm font-black uppercase tracking-[0.18em] transition"
            :class="[
              isWhiteNav
                ? 'text-black/50 hover:text-black'
                : 'text-white/50 hover:text-white',
              isActive(link.to)
                ? isWhiteNav
                  ? 'text-black'
                  : 'text-white'
                : '',
            ]"
            @click="closeMobileMenu"
          >
            {{ link.label }}
          </router-link>

          <button
            v-if="isAdmin"
            class="block w-full py-4 text-left text-sm font-black uppercase tracking-[0.18em]"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </transition>
    </nav>
  </header>
</template>