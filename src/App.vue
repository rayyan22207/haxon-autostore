<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import FloatingActions from './components/FloatingActions.vue'
import LoadingScreen from './components/ui/LoadingScreen.vue'
import { ref } from 'vue'
import router from './router'
const routeLoading = ref(false)
router.beforeEach(() => { routeLoading.value = true })
router.afterEach(() => { window.setTimeout(() => { routeLoading.value = false }, 180) })

import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
</script>

<template>
  <div
    class="min-h-screen bg-[#050608] text-white flex flex-col"
  >
    <Transition name="fade"><LoadingScreen v-if="routeLoading" /></Transition>
    <Navbar />

    <main class="flex-1">
      <RouterView />
    </main>

    <Footer />

    <!-- Toasts -->
    <Toaster
      position="top-right"
      theme="dark"
      richColors
      closeButton
      expand
    />

    <!-- Floating Quick Actions -->
    <!-- <FloatingActions /> -->
  </div>
</template>