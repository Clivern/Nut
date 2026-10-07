<template>
  <nav class="bg-white border-b border-theme-border">
    <div class="w-full px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-14">
        <div class="flex items-center min-w-0">
          <div class="shrink-0 flex items-center">
            <router-link to="/" class="flex items-center">
              <img src="/logo.png" alt="Nut" class="h-8 w-8 object-contain" />
            </router-link>
          </div>
          <div v-if="isAuthenticated" class="hidden xl:ml-8 xl:flex xl:space-x-1">
            <router-link
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              :class="[isActive(item.to) ? 'nav-link-active' : 'nav-link']"
            >
              {{ item.label }}
            </router-link>
          </div>
        </div>

        <div v-if="isAuthenticated" class="relative flex items-center" ref="dropdownRef">
          <button
            type="button"
            class="flex items-center gap-2 rounded-full border border-theme-border bg-white pl-1 pr-2.5 py-1 text-left hover:bg-theme-hover focus:outline-none focus:ring-2 focus:ring-primary-800 focus:ring-offset-1 transition-colors"
            :aria-expanded="open"
            aria-haspopup="true"
            aria-label="User menu"
            @click.stop="toggleDropdown"
          >
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-200 text-sm font-medium text-theme-text"
              aria-hidden="true"
            >
              {{ initials }}
            </span>
            <svg
              class="h-4 w-4 text-theme-textLight transition-transform"
              :class="{ 'rotate-180': open }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-show="open"
              class="absolute right-0 top-full z-50 mt-2 w-56 max-h-[24rem] overflow-y-auto rounded-lg border border-theme-border bg-white py-1 shadow-lg origin-top-right"
              role="menu"
            >
              <div class="xl:hidden border-b border-theme-border py-1">
                <router-link
                  v-for="item in navItems"
                  :key="item.to"
                  :to="item.to"
                  :class="[isActive(item.to) ? 'bg-theme-hover text-theme-text' : 'text-theme-text hover:bg-theme-hover']"
                  class="block px-4 py-2 text-sm font-medium"
                  role="menuitem"
                  @click="open = false"
                >
                  {{ item.label }}
                </router-link>
              </div>
              <div v-if="user?.name || user?.email" class="border-b border-theme-border px-4 py-3">
                <p v-if="user?.name" class="text-sm font-semibold text-theme-text truncate">
                  {{ user.name }}
                </p>
                <p v-if="user?.email" class="text-sm truncate" :class="user?.name ? 'text-theme-textLight' : 'text-theme-text'">
                  {{ user.email }}
                </p>
              </div>
              <div class="border-b border-theme-border py-1">
                <router-link
                  to="/select-workspace"
                  class="block px-4 py-2 text-sm text-theme-text hover:bg-theme-hover"
                  role="menuitem"
                  @click="open = false"
                >
                  Select Workspace
                </router-link>
                <router-link
                  to="/create-workspace"
                  class="block px-4 py-2 text-sm text-theme-text hover:bg-theme-hover"
                  role="menuitem"
                  @click="open = false"
                >
                  Create Workspace
                </router-link>
              </div>
              <div class="py-1">
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-theme-text hover:bg-theme-hover"
                  role="menuitem"
                  @click="open = false"
                >
                  Profile
                </router-link>
                <button
                  type="button"
                  class="block w-full px-4 py-2 text-left text-sm text-theme-text hover:bg-theme-hover"
                  role="menuitem"
                  @click="handleLogout"
                >
                  Logout
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <div v-else class="flex items-center space-x-3">
          <router-link to="/login" class="btn-secondary text-sm">Login</router-link>
          <router-link to="/signup" class="btn-primary text-sm">Sign Up</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const dropdownRef = ref(null)
const open = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/form', label: 'Form' },
  { to: '/cards', label: 'Cards' },
  { to: '/charts', label: 'Charts' },
  { to: '/metrics', label: 'Metrics' },
  { to: '/traces', label: 'Traces' },
  { to: '/modals', label: 'Modals' },
  { to: '/users', label: 'Users' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/themes', label: 'Themes' },
  { to: '/copilot', label: 'Copilot' },
]

const initials = computed(() => {
  const name = user.value?.name || user.value?.email || 'U'
  const parts = name.split(/[\s@]/).filter(Boolean)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || 'U'
})

function isActive(path) {
  return route.path === path || (path !== '/' && route.path.startsWith(path + '/'))
}

function toggleDropdown() {
  open.value = !open.value
}

function handleLogout() {
  open.value = false
  authStore.logout()
  router.push('/login')
}

function onClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>
