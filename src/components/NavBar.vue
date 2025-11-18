<template>
  <nav class="bg-white border-b border-notion-border relative">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="flex justify-between h-14">
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="flex items-center">
              <img src="/logo.png" alt="Logo" class="h-8 w-8 object-contain" />
            </router-link>
          </div>
          <!-- Desktop Navigation -->
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
            <router-link
              to="/profile"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/profile' }"
            >
              Profile
            </router-link>
            <router-link
              to="/subscription"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/subscription' }"
            >
              Subscription
            </router-link>
            <router-link
              to="/copilot"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/copilot' }"
            >
              Copilot Chat
            </router-link>
          </div>
        </div>
        <div class="flex items-center">
          <div v-if="isAuthenticated" class="flex items-center space-x-3">
            <router-link
              to="/profile"
              class="text-sm text-notion-textLight hidden sm:inline hover:text-notion-text transition-colors"
            >
              {{ user?.name || user?.email }}
            </router-link>
            <button
              @click="handleLogout"
              class="btn-secondary text-sm hidden sm:inline-flex"
            >
              Logout
            </button>
            <!-- Mobile Menu Button -->
            <button
              @click="toggleMobileMenu"
              class="md:hidden p-2 rounded-md text-notion-text hover:bg-notion-hover focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                v-if="!mobileMenuOpen"
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                v-else
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
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

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="mobileMenuOpen && isAuthenticated"
        class="md:hidden border-t border-notion-border bg-white"
      >
        <div class="px-6 py-4 space-y-1">
          <router-link
            to="/"
            @click="closeMobileMenu"
            class="block px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="
              $route.path === '/'
                ? 'bg-notion-hover text-notion-text'
                : 'text-notion-textLight hover:bg-notion-hover hover:text-notion-text'
            "
          >
            Home
          </router-link>
          <router-link
            to="/dashboard"
            @click="closeMobileMenu"
            class="block px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="
              $route.path === '/dashboard'
                ? 'bg-notion-hover text-notion-text'
                : 'text-notion-textLight hover:bg-notion-hover hover:text-notion-text'
            "
          >
            Dashboard
          </router-link>
          <router-link
            to="/form"
            @click="closeMobileMenu"
            class="block px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="
              $route.path === '/form'
                ? 'bg-notion-hover text-notion-text'
                : 'text-notion-textLight hover:bg-notion-hover hover:text-notion-text'
            "
          >
            Form
          </router-link>
          <router-link
            to="/cards"
            @click="closeMobileMenu"
            class="block px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="
              $route.path === '/cards'
                ? 'bg-notion-hover text-notion-text'
                : 'text-notion-textLight hover:bg-notion-hover hover:text-notion-text'
            "
          >
            Cards
          </router-link>
          <router-link
            to="/modals"
            @click="closeMobileMenu"
            class="block px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="
              $route.path === '/modals'
                ? 'bg-notion-hover text-notion-text'
                : 'text-notion-textLight hover:bg-notion-hover hover:text-notion-text'
            "
          >
            Modals
          </router-link>
          <router-link
            to="/navigation"
            @click="closeMobileMenu"
            class="block px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="
              $route.path === '/navigation'
                ? 'bg-notion-hover text-notion-text'
                : 'text-notion-textLight hover:bg-notion-hover hover:text-notion-text'
            "
          >
            Navigation
          </router-link>
          <router-link
            to="/users"
            @click="closeMobileMenu"
            class="block px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="
              $route.path === '/users'
                ? 'bg-notion-hover text-notion-text'
                : 'text-notion-textLight hover:bg-notion-hover hover:text-notion-text'
            "
          >
            Users
          </router-link>
          <router-link
            to="/calendar"
            @click="closeMobileMenu"
            class="block px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="
              $route.path === '/calendar'
                ? 'bg-notion-hover text-notion-text'
                : 'text-notion-textLight hover:bg-notion-hover hover:text-notion-text'
            "
          >
            Calendar
          </router-link>
          <router-link
            to="/profile"
            @click="closeMobileMenu"
            class="block px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="
              $route.path === '/profile'
                ? 'bg-notion-hover text-notion-text'
                : 'text-notion-textLight hover:bg-notion-hover hover:text-notion-text'
            "
          >
            Profile
          </router-link>
          <router-link
            to="/subscription"
            @click="closeMobileMenu"
            class="block px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="
              $route.path === '/subscription'
                ? 'bg-notion-hover text-notion-text'
                : 'text-notion-textLight hover:bg-notion-hover hover:text-notion-text'
            "
          >
            Subscription
          </router-link>
          <router-link
            to="/copilot"
            @click="closeMobileMenu"
            class="block px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="
              $route.path === '/copilot'
                ? 'bg-notion-hover text-notion-text'
                : 'text-notion-textLight hover:bg-notion-hover hover:text-notion-text'
            "
          >
            Copilot Chat
          </router-link>
          <div class="border-t border-notion-border mt-2 pt-2">
            <div class="px-3 py-2 text-sm text-notion-textLight">
              {{ user?.name || user?.email }}
            </div>
            <button
              @click="handleMobileLogout"
              class="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-notion-textLight hover:bg-notion-hover hover:text-notion-text transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const mobileMenuOpen = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  mobileMenuOpen.value = false
  router.push('/login')
}

const handleMobileLogout = () => {
  handleLogout()
}

// Close mobile menu when route changes
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

