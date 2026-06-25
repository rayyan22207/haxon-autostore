<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useContentStore } from '../stores/contentStore'

const route = useRoute()
const auth = useAuthStore()
const content = useContentStore()

const year = new Date().getFullYear()
const isAdmin = computed(() => route.path.startsWith('/admin'))

onMounted(() => {
  content.loadStorefrontContent()
})

const links = [
  { label: 'Shop', to: '/products' },
  { label: 'Brands', to: '/brands' },
  { label: 'Categories', to: '/categories' },
  { label: 'Haxon Standard', to: '/standard' },
  { label: 'Track Order', to: '/track-order' },
  { label: 'Contact', to: '/contact' },
]

const adminLinks = computed(() =>
  [
    { label: 'Dashboard', to: '/admin' },
    auth.hasPermission('manage_products') && { label: 'Products', to: '/admin/products' },
    auth.hasPermission('manage_orders') && { label: 'Orders', to: '/admin/orders' },
    auth.hasPermission('manage_content') && { label: 'Content', to: '/admin/content' },
    { label: 'View Store', to: '/' },
  ].filter(Boolean),
)
</script>

<template>
  <footer
    v-if="!isAdmin"
    class="relative overflow-hidden border-t border-white/10 bg-black text-white"
  >
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.09),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_35%)]"
    ></div>

    <div
      class="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 text-[18vw] font-black uppercase tracking-[0.08em] text-white/[0.025]"
    >
      HAXON
    </div>

    <div class="relative mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:px-12">
      <div class="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-start">
        <div>
          <router-link to="/" class="inline-flex items-center gap-3">
            <div class="grid h-11 w-11 place-items-center">
              <img
                src="/image/haxon-logo.png"
                alt="Haxon"
                class="h-10 w-10 object-contain"
              />
            </div>

            <div>
              <p class="text-[24px] font-black uppercase tracking-[0.22em]">
                {{ content.siteSettings.brandName || 'Haxon' }}
              </p>
              <p class="mt-1 text-[9px] font-bold uppercase tracking-[0.42em] text-white/45">
                Automotive
              </p>
            </div>
          </router-link>

          <p class="mt-6 max-w-xl text-sm leading-7 text-white/50">
            {{ content.siteSettings.footerStatement }}
          </p>

          <div class="mt-7 flex flex-wrap gap-2">
            <span
              v-for="chip in ['WhatsApp Concierge', 'Fitment Checked', 'Premium Imports']"
              :key="chip"
              class="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/50"
            >
              {{ chip }}
            </span>
          </div>
        </div>

        <div class="grid gap-8 sm:grid-cols-2 lg:justify-items-end">
          <div>
            <p class="mb-4 text-[11px] font-black uppercase tracking-[0.24em] text-white">
              Explore
            </p>

            <div class="grid gap-3">
              <router-link
                v-for="link in links"
                :key="link.label"
                :to="link.to"
                class="text-sm font-semibold text-white/45 transition hover:text-white"
              >
                {{ link.label }}
              </router-link>
            </div>
          </div>

          <div>
            <p class="mb-4 text-[11px] font-black uppercase tracking-[0.24em] text-white">
              Haxon
            </p>

            <div class="grid gap-3 text-sm font-semibold text-white/45">
              <p>{{ content.siteSettings.location || 'Pakistan' }}</p>

              <router-link
                v-if="auth.isAdmin"
                to="/admin"
                class="text-red-300 transition hover:text-white"
              >
                Admin Panel
              </router-link>

              <router-link to="/contact" class="transition hover:text-white">
                Contact Support
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between"
      >
        <p>
          © {{ year }} {{ content.siteSettings.brandName || 'Haxon' }}. All rights reserved.
        </p>

        <p class="uppercase tracking-[0.22em]">
          Built for better drives
        </p>
      </div>
    </div>
  </footer>

  <footer
    v-else
    class="border-t border-white/10 bg-black text-white"
  >
    <div
      class="mx-auto flex max-w-[1500px] flex-col gap-5 px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12"
    >
      <p class="text-xl font-black uppercase tracking-[0.22em]">
        HAXON
      </p>

      <div class="flex flex-wrap gap-5 text-sm">
        <router-link
          v-for="link in adminLinks"
          :key="link.label"
          :to="link.to"
          class="font-semibold text-white/45 transition hover:text-white"
        >
          {{ link.label }}
        </router-link>
      </div>

      <p class="text-xs text-white/35">
        © {{ year }} Haxon Admin
      </p>
    </div>
  </footer>
</template>