<template>
  <div class="min-h-screen flex items-center justify-center bg-notion-bg px-4">
    <div class="max-w-md w-full">
      <!-- Logo and Header -->
      <div class="text-center mb-10">
        <div class="flex justify-center mb-8">
          <div class="h-24 w-24 bg-notion-text rounded-lg flex items-center justify-center">
            <span class="text-white text-2xl font-bold">Nut</span>
          </div>
        </div>
      </div>

      <!-- Forgot Password Form -->
      <div class="bg-white rounded-lg border border-notion-border p-8 shadow-sm">
        <div v-if="!emailSent">
          <h2 class="text-2xl font-semibold text-notion-text mb-2 text-center">Forgot password?</h2>
          <p class="text-sm text-notion-textLight text-center mb-6">
            No worries, we'll send you reset instructions.
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
                :disabled="loading || !form.email"
              >
                <span v-if="!loading">Reset password</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="spinner -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              </button>
            </div>
          </form>

          <!-- Back to Login -->
          <div class="mt-6 text-center">
            <router-link
              to="/login"
              class="text-sm text-notion-textLight hover:text-notion-text transition-colors flex items-center justify-center"
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
            <h2 class="text-2xl font-semibold text-notion-text mb-2">Check your email</h2>
            <p class="text-sm text-notion-textLight">
              We've sent password reset instructions to
              <span class="font-medium text-notion-text">{{ form.email }}</span>
            </p>
          </div>

          <div class="space-y-3">
            <button
              @click="emailSent = false"
              class="w-full btn-secondary"
            >
              Resend email
            </button>
            <router-link
              to="/login"
              class="block w-full btn-primary text-center"
            >
              Back to login
            </router-link>
          </div>
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
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const form = reactive({
  email: ''
})

const emailSent = ref(false)

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
  emailSent.value = false
  authStore.reset()
  authStore.resetLoading()
})

// Reset loading state when component unmounts
onUnmounted(() => {
  authStore.reset()
})

const handleResetPassword = async () => {
  if (loading.value) return // Prevent double submission

  try {
    const result = await authStore.resetPassword(form.email)
    if (result.success) {
      emailSent.value = true
      loading.value = false
    }
  } catch (err) {
    console.error('Reset password error:', err)
    authStore.resetLoading()
    loading.value = false
  }
}
</script>

