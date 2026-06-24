import { defineStore } from 'pinia'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'
import { login, logout } from '../services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null, authReady: false, authPromise: null }),
  getters: { isAuthenticated: (state) => Boolean(state.user) },
  actions: {
    async login(email, password) { const result = await login(email, password); this.user = result.user; return result },
    async logout() { await logout(); this.user = null },
    init() {
      if (this.authPromise) return this.authPromise
      this.authPromise = new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => { this.user = user; this.authReady = true; resolve(user) })
      })
      return this.authPromise
    },
    waitUntilReady() { return this.init() },
  },
})
