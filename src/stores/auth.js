import { ref, computed } from 'vue'

// Simple auth store using Vue 3 Composition API
const isAuthenticated = ref(false)
const user = ref(null)
const loading = ref(false)
const error = ref(null)

export function useAuthStore() {
  const login = async (email, password, rememberMe = false) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock authentication - in real app, this would be an API call
      if (email && password) {
        isAuthenticated.value = true
        user.value = {
          email,
          name: email.split('@')[0]
        }

        if (rememberMe) {
          localStorage.setItem('auth_token', 'mock_token')
          localStorage.setItem('user', JSON.stringify(user.value))
        }

        return { success: true }
      } else {
        error.value = 'Email and password are required'
        return { success: false }
      }
    } catch (err) {
      error.value = err.message || 'Login failed. Please try again.'
      return { success: false }
    } finally {
      loading.value = false
    }
  }

  const signup = async (name, email, password, confirmPassword) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock validation
      if (!name || !email || !password) {
        error.value = 'All fields are required'
        return { success: false }
      }

      if (password !== confirmPassword) {
        error.value = 'Passwords do not match'
        return { success: false }
      }

      if (password.length < 8) {
        error.value = 'Password must be at least 8 characters'
        return { success: false }
      }

      // Mock successful signup
      isAuthenticated.value = true
      user.value = {
        email,
        name
      }

      localStorage.setItem('auth_token', 'mock_token')
      localStorage.setItem('user', JSON.stringify(user.value))

      return { success: true }
    } catch (err) {
      error.value = err.message || 'Signup failed. Please try again.'
      return { success: false }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    error.value = null
  }

  const resetPassword = async (email) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (!email) {
        error.value = 'Email is required'
        return { success: false }
      }

      // Mock successful password reset
      return { success: true }
    } catch (err) {
      error.value = err.message || 'Failed to send reset email. Please try again.'
      return { success: false }
    } finally {
      loading.value = false
    }
  }

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')

    if (token && storedUser) {
      isAuthenticated.value = true
      user.value = JSON.parse(storedUser)
    }
  }

  const clearError = () => {
    error.value = null
  }

  const resetLoading = () => {
    loading.value = false
  }

  const reset = () => {
    loading.value = false
    error.value = null
  }

  // Check auth on initialization
  checkAuth()

  return {
    isAuthenticated: computed(() => isAuthenticated.value),
    user: computed(() => user.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    login,
    signup,
    logout,
    resetPassword,
    checkAuth,
    clearError,
    resetLoading,
    reset
  }
}

