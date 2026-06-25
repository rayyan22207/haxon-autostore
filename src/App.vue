<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import FloatingActions from './components/FloatingActions.vue'

import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
</script>

<template>
  <div
    class="min-h-screen bg-[#050608] text-white flex flex-col"
  >
    <Navbar />

    <main class="flex-1">
      <!-- <RouterView /> -->
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