<template>
  <div class="min-h-screen flex items-center justify-center bg-notion-bg px-4">
    <div class="max-w-md w-full">
      <!-- Logo and Header -->
      <div class="text-center mb-10">
        <div class="flex justify-center mb-8">
          <img src="/logo.png" alt="Logo" class="h-24 w-24 object-contain" />
        </div>
      </div>

      <!-- Login Form -->
      <div class="bg-white rounded-lg border border-notion-border p-8 shadow-sm">
        <h2 class="text-2xl font-semibold text-notion-text mb-6 text-center">Welcome back</h2>
        <form class="space-y-5" @submit.prevent="handleLogin">
          <!-- Email Field -->
          <div>
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="input-field"
              placeholder="Enter your email"
              :disabled="loading"
            >
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              autocomplete="current-password"
              class="input-field"
              placeholder="Enter your password"
              :disabled="loading"
            >
          </div>

          <!-- Remember Me and Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.rememberMe"
                type="checkbox"
                class="checkbox"
                :disabled="loading"
              >
              <label for="remember-me" class="ml-2 block text-sm text-notion-textLight cursor-pointer">
                Remember me
              </label>
            </div>
            <router-link
              to="/forgot-password"
              class="text-sm text-notion-textLight hover:text-notion-text transition-colors"
            >
              Forgot password?
            </router-link>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="alert-error">
            <p class="alert-text-error">{{ error }}</p>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              class="w-full btn-primary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading || !form.email || !form.password"
            >
              <span v-if="!loading">Sign in</span>
              <span v-else class="flex items-center justify-center">
                <svg class="spinner -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </span>
            </button>
          </div>
        </form>

        <!-- Sign Up Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-notion-textLight">
            Don't have an account?
            <router-link
              to="/signup"
              class="text-notion-text font-medium hover:underline"
            >
              Sign up
            </router-link>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-xs text-notion-textLight mt-8">
        Copyright © 2025 Nut. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

// Use local refs that sync with store
const loading = ref(false)
const error = ref(null)

// Sync with store state
watch(() => authStore.loading, (newVal) => {
  loading.value = newVal
}, { immediate: true })

watch(() => authStore.error, (newVal) => {
  error.value = newVal
}, { immediate: true })

// Reset state when component mounts
onMounted(() => {
  // Force reset loading state
  loading.value = false
  error.value = null
  authStore.reset()
  authStore.resetLoading()
})

// Reset loading state when component unmounts
onUnmounted(() => {
  authStore.reset()
})

const handleLogin = async () => {
  if (loading.value) return // Prevent double submission

  try {
    const result = await authStore.login(form.email, form.password, form.rememberMe)
    if (result.success) {
      await new Promise(resolve => setTimeout(resolve, 100))
      router.push('/')
    }
  } catch (err) {
    console.error('Login error:', err)
    authStore.resetLoading()
    loading.value = false
  }
}
</script>

