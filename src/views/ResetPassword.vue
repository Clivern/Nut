<template>
  <div class="min-h-screen flex items-center justify-center bg-theme-bg px-4">
    <div class="max-w-md w-full">
      <!-- Logo and Header -->
      <div class="text-center mb-10">
        <div class="flex justify-center mb-8">
          <img src="/logo.png" alt="Logo" class="h-24 w-24 object-contain" />
        </div>
      </div>

      <!-- Reset Password Form -->
      <div class="bg-white rounded-lg border border-theme-border p-8 shadow-sm">
        <div v-if="!passwordReset">
          <h2 class="text-2xl font-semibold text-theme-text mb-2 text-center">Reset your password</h2>
          <p class="text-sm text-theme-textLight text-center mb-6">
            Enter your new password below.
          </p>

          <form class="space-y-5" @submit.prevent="handleResetPassword">
            <!-- Email Field -->
            <div>
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="input-field"
                placeholder="Enter your email"
                :disabled="loading || emailFromUrl"
              >
            </div>

            <!-- Token Field (hidden, populated from URL) -->
            <div v-if="!tokenFromUrl">
              <label for="token" class="form-label">Reset Token</label>
              <input
                id="token"
                v-model="form.token"
                type="text"
                required
                class="input-field"
                placeholder="Enter reset token"
                :disabled="loading"
              >
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="form-label">New Password</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                class="input-field"
                placeholder="Enter new password (min. 6 characters)"
                :disabled="loading"
              >
            </div>

            <!-- Confirm Password Field -->
            <div>
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                required
                class="input-field"
                placeholder="Confirm new password"
                :disabled="loading"
              >
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
                :disabled="loading || !form.email || !form.token || !form.password || !form.confirmPassword"
              >
                <span v-if="!loading">Reset password</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="spinner -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Resetting...
                </span>
              </button>
            </div>
          </form>

          <!-- Back to Login -->
          <div class="mt-6 text-center">
            <router-link
              to="/login"
              class="text-sm text-theme-textLight hover:text-theme-text transition-colors flex items-center justify-center"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to login
            </router-link>
          </div>
        </div>

        <!-- Success Message -->
        <div v-else class="text-center">
          <div class="mb-6">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-semibold text-theme-text mb-2">Password reset successful</h2>
            <p class="text-sm text-theme-textLight">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
          </div>

          <router-link
            to="/login"
            class="block w-full btn-primary text-center"
          >
            Go to login
          </router-link>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-xs text-theme-textLight mt-8">
        Copyright © 2025 Luchian. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  token: '',
  password: '',
  confirmPassword: ''
})

const passwordReset = ref(false)
const tokenFromUrl = ref(false)
const emailFromUrl = ref(false)

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

// Get email and token from URL parameters
onMounted(() => {
  // Force reset loading state
  loading.value = false
  error.value = null
  passwordReset.value = false
  authStore.reset()
  authStore.resetLoading()

  // Extract email from route params
  const email = route.params.email
  if (email) {
    // Decode email if it's URL encoded
    form.email = decodeURIComponent(email)
    emailFromUrl.value = true
  }

  // Extract token from route params
  const token = route.params.token
  if (token) {
    form.token = token
    tokenFromUrl.value = true
  }
})

// Reset loading state when component unmounts
onUnmounted(() => {
  authStore.reset()
})

const handleResetPassword = async () => {
  if (loading.value) return // Prevent double submission

  // Validate passwords match
  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  // Validate password length
  if (form.password.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  try {
    const result = await authStore.resetPassword(form.email, form.token, form.password)
    if (result.success) {
      passwordReset.value = true
      loading.value = false
    }
  } catch (err) {
    console.error('Reset password error:', err)
    authStore.resetLoading()
    loading.value = false
  }
}
</script>

