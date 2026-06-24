<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useAuthStore } from '../../stores/authStore'
const props = defineProps({ mode: { type: String, default: 'access' } })
const auth = useAuthStore(); const router = useRouter()
const title = computed(() => props.mode === 'permission' ? 'Not enough permissions' : 'Access denied')
const message = computed(() => props.mode === 'permission' ? 'Your admin role does not include permission for this control room.' : 'This account is not an active Haxon admin.')
const signOut = async () => { await auth.logout(); toast.success('Signed out'); router.push('/admin/login') }
</script>
<template><section class="admin-shell pt-28"><div class="admin-page"><div class="admin-card mx-auto max-w-2xl p-10 text-center"><p class="admin-eyebrow">Haxon security</p><h1 class="admin-title">{{ title }}</h1><p class="admin-muted mt-4">{{ message }}</p><button class="admin-btn-primary mt-8" @click="signOut">Sign out</button></div></div></section></template>
