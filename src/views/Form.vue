<template>
  <div class="min-h-screen bg-theme-bg">
    <NavBar />

    <main class="w-full py-8 px-6 lg:px-8">
      <div class="page-header">
        <h1 class="page-title">Settings</h1>
        <p class="page-subtitle">Manage your application settings</p>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="alert-success mb-6">
        <p class="alert-text-success">{{ successMessage }}</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="alert-error mb-6">
        <p class="alert-text-error">{{ errorMessage }}</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- General Settings Section -->
        <div class="section">
          <h2 class="section-title">General</h2>
          <div class="section-divider"></div>
          <div class="form-group">
            <div>
              <label for="name" class="form-label">Name</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="input-field max-w-md"
                placeholder="Enter name"
                :disabled="loading"
              >
            </div>
            <div>
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="input-field max-w-md"
                placeholder="admin@example.com"
                :disabled="loading"
              >
            </div>
            <div>
              <label for="url" class="form-label">URL</label>
              <input
                id="url"
                v-model="form.url"
                type="url"
                class="input-field max-w-md"
                placeholder="https://example.com"
                :disabled="loading"
              >
            </div>
            <div>
              <label for="description" class="form-label">Description</label>
              <textarea
                id="description"
                v-model="form.description"
                rows="4"
                class="input-field max-w-md"
                placeholder="Enter description"
                :disabled="loading"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Configuration Section -->
        <div class="section">
          <h2 class="section-title">Configuration</h2>
          <div class="section-divider"></div>
          <div class="form-group">
            <div>
              <label for="server" class="form-label">Server</label>
              <input
                id="server"
                v-model="form.server"
                type="text"
                class="input-field max-w-md"
                placeholder="smtp.example.com"
                :disabled="loading"
              >
            </div>
            <div>
              <label for="port" class="form-label">Port</label>
              <input
                id="port"
                v-model="form.port"
                type="text"
                class="input-field max-w-xs"
                placeholder="587"
                :disabled="loading"
              >
            </div>
            <div>
              <label for="password" class="form-label">Password</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                class="input-field max-w-md"
                placeholder="Enter password"
                :disabled="loading"
              >
            </div>
            <div class="flex items-start">
              <input
                id="useTLS"
                v-model="form.useTLS"
                type="checkbox"
                class="checkbox"
                :disabled="loading"
              >
              <label for="useTLS" class="ml-3 block">
                <span class="text-sm font-medium text-theme-text">Use TLS</span>
                <p class="text-xs text-theme-textLight mt-1">Enable TLS for secure connection</p>
              </label>
            </div>
          </div>
        </div>

        <!-- Options Section -->
        <div class="section">
          <h2 class="section-title">Options</h2>
          <div class="section-divider"></div>
          <div class="flex items-start">
            <input
              id="maintenance"
              v-model="form.maintenance"
              type="checkbox"
              class="checkbox"
              :disabled="loading"
            >
            <label for="maintenance" class="ml-3 block">
              <span class="text-sm font-medium text-theme-text">Enable Maintenance Mode</span>
              <p class="text-xs text-theme-textLight mt-1">Put the application in maintenance mode</p>
            </label>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end gap-3">
          <button type="button" class="btn-secondary" :disabled="loading">Cancel</button>
          <button type="submit" class="btn-primary" :disabled="loading">
            <span v-if="!loading">Save Settings</span>
            <span v-else class="flex items-center">
              <svg class="spinner -ml-1 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import NavBar from '../components/NavBar.vue'

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const form = reactive({
  name: '',
  email: '',
  url: '',
  description: '',
  server: '',
  port: '',
  password: '',
  useTLS: true,
  maintenance: false
})

const handleSubmit = async () => {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  // Simulate API call
  setTimeout(() => {
    successMessage.value = 'Settings saved successfully!'
    loading.value = false

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  }, 1000)
}
</script>

