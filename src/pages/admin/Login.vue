<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const isValid = computed(() => {
  return (
    email.value.trim() &&
    password.value.trim() &&
    password.value.length >= 6
  )
})

const handleLogin = async () => {
  if (!isValid.value) {
    error.value = 'Please enter a valid email and password.'
    return
  }

  try {
    loading.value = true
    error.value = ''

    await authStore.login(
      email.value.trim(),
      password.value
    )

    router.push('/admin')
  } catch (err) {
    console.error(err)
    error.value = 'Invalid email or password.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-red-600 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-bold shadow">
          H
        </div>

        <h1 class="text-4xl font-bold text-gray-900 mt-5">
          Haxon Admin
        </h1>

        <p class="text-gray-500 mt-2">
          Sign in to manage products, orders, and store settings.
        </p>
      </div>

      <div class="bg-white border shadow-sm rounded-3xl p-8">
        <div
          v-if="error"
          class="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm mb-5"
        >
          {{ error }}
        </div>

        <form
          class="space-y-5"
          @submit.prevent="handleLogin"
        >
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="admin@haxon.store"
              class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Enter password"
                class="w-full border rounded-xl p-3 pr-24 focus:ring-2 focus:ring-red-500 outline-none"
              />

              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-red-600"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading || !isValid"
            class="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white py-4 rounded-xl font-semibold transition"
          >
            {{ loading ? 'Signing In...' : 'Login' }}
          </button>
        </form>

        <div class="mt-6 border-t pt-5 text-sm text-gray-500">
          Firebase Auth handles the session securely. No password is stored in the app.
        </div>
      </div>

      <p class="text-center text-xs text-gray-400 mt-6">
        Haxon Store Control Panel
      </p>
    </div>
  </div>
</template>