<template>
  <nav class="bg-white border-b border-notion-border">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="flex justify-between h-14">
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="flex items-center">
              <img src="/logo.png" alt="Logo" class="h-8 w-8 object-contain" />
            </router-link>
          </div>
          <div v-if="isAuthenticated" class="hidden md:ml-8 md:flex md:space-x-1">
            <router-link
              to="/"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/' }"
            >
              Home
            </router-link>
            <router-link
              to="/dashboard"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/dashboard' }"
            >
              Dashboard
            </router-link>
            <router-link
              to="/form"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/form' }"
            >
              Form
            </router-link>
            <router-link
              to="/cards"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/cards' }"
            >
              Cards
            </router-link>
            <router-link
              to="/modals"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/modals' }"
            >
              Modals
            </router-link>
            <router-link
              to="/navigation"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/navigation' }"
            >
              Navigation
            </router-link>
            <router-link
              to="/users"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/users' }"
            >
              Users
            </router-link>
            <router-link
              to="/calendar"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/calendar' }"
            >
              Calendar
            </router-link>
          </div>
        </div>
        <div class="flex items-center">
          <div v-if="isAuthenticated" class="flex items-center space-x-3">
            <span class="text-sm text-notion-textLight hidden sm:inline">{{ user?.name || user?.email }}</span>
            <button
              @click="handleLogout"
              class="btn-secondary text-sm"
            >
              Logout
            </button>
          </div>
          <div v-else class="flex items-center space-x-3">
            <router-link
              to="/login"
              class="btn-secondary text-sm"
            >
              Login
            </router-link>
            <router-link
              to="/signup"
              class="btn-primary text-sm"
            >
              Sign Up
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

