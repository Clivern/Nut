<template>
  <div class="min-h-screen bg-notion-bg">
    <NavBar />

    <main class="max-w-7xl mx-auto py-8 px-6 lg:px-8">
      <div class="page-header">
        <h1 class="page-title">Nut Style Guide</h1>
        <p class="page-subtitle">A reusable dashboard style guide with Vue.js components</p>
      </div>

      <!-- Welcome message for authenticated users -->
      <div v-if="isAuthenticated" class="mb-6">
        <div class="alert-success">
          <p class="alert-text-success">
            Welcome back, <span class="font-semibold">{{ user?.name || user?.email }}</span>!
          </p>
        </div>
      </div>

      <!-- Call to action for unauthenticated users -->
      <div v-else class="mb-6">
        <div class="card bg-gradient-to-r from-notion-bg to-white">
          <div class="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-notion-text mb-2">Get Started</h3>
              <p class="text-sm text-notion-textLight">Sign up to explore all the dashboard components</p>
            </div>
            <div class="flex gap-3 mt-4 sm:mt-0">
              <router-link to="/login" class="btn-secondary">Login</router-link>
              <router-link to="/signup" class="btn-primary">Sign Up</router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-3 lg:grid-cols-2 mb-8">
        <router-link
          v-if="isAuthenticated"
          to="/dashboard"
          class="card hover:shadow-md transition-shadow"
        >
          <h3 class="text-sm font-semibold text-notion-text mb-2">Dashboard</h3>
          <p class="text-sm text-notion-textLight">Complete dashboard layout with stats, activity feed, and system information</p>
        </router-link>

        <router-link
          v-if="isAuthenticated"
          to="/form"
          class="card hover:shadow-md transition-shadow"
        >
          <h3 class="text-sm font-semibold text-notion-text mb-2">Forms</h3>
          <p class="text-sm text-notion-textLight">Form patterns with inputs, checkboxes, and validation examples</p>
        </router-link>

        <router-link
          v-if="isAuthenticated"
          to="/cards"
          class="card hover:shadow-md transition-shadow"
        >
          <h3 class="text-sm font-semibold text-notion-text mb-2">Cards</h3>
          <p class="text-sm text-notion-textLight">Various card styles including stat cards, sections, and alerts</p>
        </router-link>

        <router-link
          v-if="isAuthenticated"
          to="/modals"
          class="card hover:shadow-md transition-shadow"
        >
          <h3 class="text-sm font-semibold text-notion-text mb-2">Modals</h3>
          <p class="text-sm text-notion-textLight">Modal components with various sizes and patterns</p>
        </router-link>

        <router-link
          v-if="isAuthenticated"
          to="/navigation"
          class="card hover:shadow-md transition-shadow"
        >
          <h3 class="text-sm font-semibold text-notion-text mb-2">Navigation</h3>
          <p class="text-sm text-notion-textLight">Navigation bar patterns and routing examples</p>
        </router-link>

        <!-- Public examples -->
        <div class="card">
          <h3 class="text-sm font-semibold text-notion-text mb-2">Authentication</h3>
          <p class="text-sm text-notion-textLight mb-3">Login, signup, and password reset pages</p>
          <div class="flex gap-2">
            <router-link to="/login" class="btn-secondary text-xs">Login</router-link>
            <router-link to="/signup" class="btn-secondary text-xs">Signup</router-link>
            <router-link to="/forgot-password" class="btn-secondary text-xs">Reset</router-link>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="text-sm font-semibold text-notion-text mb-4">Getting Started</h3>
        <div class="space-y-3">
          <p class="text-sm text-notion-textLight">
            Nut provides a comprehensive set of Vue.js components and styles for building modern dashboard applications.
          </p>
          <div class="bg-[#F7F6F3] p-4 rounded text-xs overflow-x-auto">
            <code class="text-notion-text">
              npm install<br>
              npm run dev
            </code>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import NavBar from '../components/NavBar.vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
</script>

