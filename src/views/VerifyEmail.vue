<template>
  <div class="min-h-screen flex items-center justify-center bg-theme-bg px-4">
    <div class="max-w-md w-full">
      <!-- Logo and Header -->
      <div class="text-center mb-10">
        <div class="flex justify-center mb-8">
          <img src="/logo.png" alt="Logo" class="h-24 w-24 object-contain" />
        </div>
      </div>

      <!-- Verify Email Content -->
      <div class="bg-white rounded-lg border border-theme-border p-8 shadow-sm">
        <!-- Loading State -->
        <div v-if="verifying" class="text-center">
          <div class="mb-6">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <svg class="spinner h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h2 class="text-2xl font-semibold text-theme-text mb-2">Verifying your email</h2>
            <p class="text-sm text-theme-textLight">
              Please wait while we verify your email address...
            </p>
          </div>
        </div>

        <!-- Success Message -->
        <div v-else-if="emailVerified" class="text-center">
          <div class="mb-6">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-semibold text-theme-text mb-2">Email verified successfully</h2>
            <p class="text-sm text-theme-textLight">
              Your email address has been verified. You can now log in to your account.
            </p>
          </div>

          <router-link
            to="/login"
            class="block w-full btn-primary text-center"
          >
            Go to login
          </router-link>
        </div>

        <!-- Error Message -->
        <div v-else class="text-center">
          <div class="mb-6">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 class="text-2xl font-semibold text-theme-text mb-2">Verification failed</h2>
            <p class="text-sm text-theme-textLight mb-4">
              {{ error || 'The verification link is invalid or has expired. Please request a new verification email.' }}
            </p>
          </div>

          <div class="space-y-3">
            <router-link
              to="/login"
              class="block w-full btn-primary text-center"
            >
              Go to login
            </router-link>
          </div>
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
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const verifying = ref(true)
const emailVerified = ref(false)
const error = ref(null)

// Use local refs that sync with store
const loading = ref(false)

// Sync with store state
watch(() => authStore.loading, (newVal) => {
  loading.value = newVal
}, { immediate: true })

watch(() => authStore.error, (newVal) => {
  error.value = newVal
}, { immediate: true })

// Verify email on mount
onMounted(async () => {
  // Reset state
  verifying.value = true
  emailVerified.value = false
  error.value = null
  authStore.reset()
  authStore.resetLoading()

  // Extract email and token from route params
  const email = route.params.email
  const token = route.params.token

  if (!email || !token) {
    error.value = 'Invalid verification link. Email and token are required.'
    verifying.value = false
    return
  }

  try {
    const result = await authStore.verifyEmail(email, token)
    if (result.success) {
      emailVerified.value = true
    } else {
      error.value = authStore.error || 'Failed to verify email. Please try again.'
    }
  } catch (err) {
    console.error('Verify email error:', err)
    error.value = err.message || 'Failed to verify email. Please try again.'
  } finally {
    verifying.value = false
  }
})

// Reset loading state when component unmounts
onUnmounted(() => {
  authStore.reset()
})
</script>

