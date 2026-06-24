<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '../stores/cartStore'

const route = useRoute()
const cartStore = useCartStore()

const mobileMenu = ref(false)

const isAdmin = computed(() => route.path.startsWith('/admin'))

const storeLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
  { label: 'Track', to: '/track-order' },
  { label: 'Brands', to: '/brands' },
  { label: 'Contact', to: '/contact' },
]

const adminLinks = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Products', to: '/admin/products' },
  { label: 'Orders', to: '/admin/orders' },
  { label: 'View Store', to: '/' },
]

const links = computed(() => (isAdmin.value ? adminLinks : storeLinks))

const closeMobileMenu = () => {
  mobileMenu.value = false
}

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-black/10 bg-white/90 text-[#121212] backdrop-blur-xl">
    <div
      v-if="!isAdmin"
      class="border-b border-black/10 bg-[#121212] text-white"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-between px-5 py-2 text-[11px] font-medium sm:px-6 lg:px-8">
        <p class="tracking-wide text-white/70">
          Premium car accessories. Delivered across Pakistan.
        </p>

        <div class="hidden items-center gap-6 md:flex">
          <router-link
            to="/contact"
            class="text-white/55 transition hover:text-white"
          >
            Help
          </router-link>

          <router-link
            to="/track-order"
            class="text-white/55 transition hover:text-white"
          >
            Track Order
          </router-link>
        </div>
      </div>
    </div>

    <nav>
      <div class="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6 lg:px-8">
        <router-link
          :to="isAdmin ? '/admin' : '/'"
          class="group leading-none"
          @click="closeMobileMenu"
        >
          <span class="block text-3xl font-black tracking-[0.24em]">
            HAXON
          </span>

          <span class="mt-1 block text-[10px] font-bold uppercase tracking-[0.44em] text-[#D90429]">
            {{ isAdmin ? 'Control Panel' : 'Automotive' }}
          </span>
        </router-link>

        <div class="hidden items-center gap-1 lg:flex">
          <router-link
            v-for="link in links"
            :key="link.label"
            :to="link.to"
            class="relative px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#555] transition hover:text-[#D90429]"
            :class="isActive(link.to) ? 'text-[#121212]' : ''"
          >
            {{ link.label }}

            <span
              v-if="isActive(link.to)"
              class="absolute bottom-0 left-4 right-4 h-px bg-[#D90429]"
            ></span>
          </router-link>
        </div>

        <div class="hidden items-center gap-3 lg:flex">
          <button
            v-if="!isAdmin"
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-xl transition hover:border-[#D90429]/50 hover:text-[#D90429]"
            aria-label="Search"
          >
            ⌕
          </button>

          <router-link
            v-if="!isAdmin"
            to="/cart"
            class="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-lg transition hover:border-[#D90429]/50 hover:text-[#D90429]"
            aria-label="Cart"
          >
            🛒

            <span
              v-if="cartStore.totalItems"
              class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D90429] px-1 text-[10px] font-black text-white"
            >
              {{ cartStore.totalItems }}
            </span>
          </router-link>

          <router-link
            v-if="isAdmin"
            to="/admin/products/add"
            class="rounded-2xl bg-[#D90429] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b80322]"
          >
            + Add Product
          </router-link>
        </div>

        <div class="flex items-center gap-3 lg:hidden">
          <router-link
            v-if="!isAdmin"
            to="/cart"
            class="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/10"
            @click="closeMobileMenu"
          >
            🛒

            <span
              v-if="cartStore.totalItems"
              class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D90429] px-1 text-[10px] font-black text-white"
            >
              {{ cartStore.totalItems }}
            </span>
          </router-link>

          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-xl"
            @click="mobileMenu = !mobileMenu"
            aria-label="Toggle menu"
          >
            {{ mobileMenu ? '×' : '☰' }}
          </button>
        </div>
      </div>

      <div
        v-if="mobileMenu"
        class="border-t border-black/10 bg-white px-5 py-4 lg:hidden"
      >
        <router-link
          v-for="link in links"
          :key="link.label"
          :to="link.to"
          class="block rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#555] transition hover:bg-black/5 hover:text-[#D90429]"
          :class="isActive(link.to) ? 'bg-black/5 text-[#121212]' : ''"
          @click="closeMobileMenu"
        >
          {{ link.label }}
        </router-link>

        <router-link
          v-if="!isAdmin"
          to="/cart"
          class="mt-3 block rounded-2xl bg-[#121212] px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.16em] text-white"
          @click="closeMobileMenu"
        >
          Cart · {{ cartStore.totalItems }}
        </router-link>

        <router-link
          v-else
          to="/admin/products/add"
          class="mt-3 block rounded-2xl bg-[#D90429] px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.16em] text-white"
          @click="closeMobileMenu"
        >
          Add Product
        </router-link>
      </div>
    </nav>
  </header>
</template>