import { defineStore } from 'pinia'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase/config'
import { login, logout } from '../services/authService'
import { hasPermission } from '../lib/roles'

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null, adminUser: null, adminLoaded: false, authReady: false, authPromise: null }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
    isAdmin: (state) => Boolean(state.user && state.adminUser?.active),
    hasPermission: (state) => (permission) => hasPermission(state.adminUser, permission),
  },
  actions: {
    async loadAdminUser(user = this.user) {
      this.adminLoaded = false
      this.adminUser = null
      if (!user?.uid) { this.adminLoaded = true; return null }
      try {
        const snap = await getDoc(doc(db, 'adminUsers', user.uid))
        this.adminUser = snap.exists() ? { uid: user.uid, ...snap.data() } : null
      } catch (error) {
        console.warn('Unable to load admin role. Firestore rules must enforce roles server-side.', error)
        this.adminUser = null
      } finally { this.adminLoaded = true }
      return this.adminUser
    },
    async login(email, password) { const result = await login(email, password); this.user = result.user; await this.loadAdminUser(result.user); return result },
    async logout() { await logout(); this.user = null; this.adminUser = null; this.adminLoaded = true },
    init() {
      if (this.authPromise) return this.authPromise
      this.authPromise = new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => { this.user = user; await this.loadAdminUser(user); this.authReady = true; resolve(user) })
      })
      return this.authPromise
    },
    waitUntilReady() { return this.init() },
  },
})
