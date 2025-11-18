<template>
  <div class="min-h-screen flex items-center justify-center bg-notion-bg px-4 py-8">
    <div class="max-w-md w-full">
      <!-- Logo and Header -->
      <div class="text-center mb-10">
        <div class="flex justify-center mb-8">
          <div class="h-24 w-24 bg-notion-text rounded-lg flex items-center justify-center">
            <span class="text-white text-2xl font-bold">Nut</span>
          </div>
        </div>
      </div>

      <!-- Signup Form -->
      <div class="bg-white rounded-lg border border-notion-border p-8 shadow-sm">
        <h2 class="text-2xl font-semibold text-notion-text mb-6 text-center">Create an account</h2>
        <form class="space-y-5" @submit.prevent="handleSignup">
          <!-- Name Field -->
          <div>
            <label for="name" class="form-label">Full Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="input-field"
              placeholder="Enter your full name"
              :disabled="loading"
            >
          </div>

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

          <!-- Password Field -->
          <div>
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="input-field"
              placeholder="Create a password (min. 8 characters)"
              :disabled="loading"
            >
            <p class="text-xs text-notion-textLight mt-1">Must be at least 8 characters</p>
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
              placeholder="Confirm your password"
              :disabled="loading"
            >
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start">
            <input
              id="terms"
              v-model="form.acceptTerms"
              type="checkbox"
              required
              class="checkbox mt-1"
              :disabled="loading"
            >
            <label for="terms" class="ml-3 block">
              <span class="text-sm text-notion-text">I agree to the</span>
              <a href="#" class="text-sm text-notion-text font-medium hover:underline">Terms and Conditions</a>
              <span class="text-sm text-notion-text"> and </span>
              <a href="#" class="text-sm text-notion-text font-medium hover:underline">Privacy Policy</a>
            </label>
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
              :disabled="loading || !form.name || !form.email || !form.password || !form.confirmPassword || !form.acceptTerms"
            >
              <span v-if="!loading">Create account</span>
              <span v-else class="flex items-center justify-center">
                <svg class="spinner -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating account...
              </span>
            </button>
          </div>
        </form>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-notion-textLight">
            Already have an account?
            <router-link
              to="/login"
              class="text-notion-text font-medium hover:underline"
            >
              Sign in
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
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
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

const handleSignup = async () => {
  if (loading.value) return // Prevent double submission

  try {
    const result = await authStore.signup(
      form.name,
      form.email,
      form.password,
      form.confirmPassword
    )
    if (result.success) {
      await new Promise(resolve => setTimeout(resolve, 100))
      router.push('/')
    }
  } catch (err) {
    console.error('Signup error:', err)
    authStore.resetLoading()
    loading.value = false
  }
}
</script>

