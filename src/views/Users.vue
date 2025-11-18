<template>
  <div class="min-h-screen bg-notion-bg">
    <NavBar />

    <main class="max-w-7xl mx-auto py-8 px-6 lg:px-8">
      <div class="page-header">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="page-title">Users</h1>
            <p class="page-subtitle">Manage your users and their permissions</p>
          </div>
          <button @click="openAddModal" class="btn-primary">
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </button>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="mb-6">
        <div class="card">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <label for="search" class="form-label">Search Users</label>
              <input
                id="search"
                v-model="searchQuery"
                type="text"
                class="input-field"
                placeholder="Search by name or email..."
              >
            </div>
            <div class="sm:w-48">
              <label for="role-filter" class="form-label">Filter by Role</label>
              <select
                id="role-filter"
                v-model="roleFilter"
                class="input-field"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="card">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-notion-border">
                <th class="text-left py-3 px-4 text-sm font-semibold text-notion-text">Name</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-notion-text">Email</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-notion-text">Role</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-notion-text">Status</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-notion-text">Created</th>
                <th class="text-right py-3 px-4 text-sm font-semibold text-notion-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in paginatedUsers"
                :key="user.id"
                class="border-b border-notion-border hover:bg-notion-hover transition-colors"
              >
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <div class="h-8 w-8 rounded-full bg-notion-text flex items-center justify-center mr-3">
                      <span class="text-white text-xs font-medium">
                        {{ user.name.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <span class="text-sm font-medium text-notion-text">{{ user.name }}</span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span class="text-sm text-notion-textLight">{{ user.email }}</span>
                </td>
                <td class="py-3 px-4">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getRoleBadgeClass(user.role)"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ user.status }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span class="text-sm text-notion-textLight">{{ formatDate(user.createdAt) }}</span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="openEditModal(user)"
                      class="p-1.5 text-notion-textLight hover:text-notion-text hover:bg-notion-hover rounded transition-colors"
                      title="Edit user"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="openDeleteModal(user)"
                      class="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Delete user"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedUsers.length === 0">
                <td colspan="6" class="py-8 px-4 text-center">
                  <p class="text-sm text-notion-textLight">No users found</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredUsers.length > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-notion-border px-4 py-3">
          <div class="text-sm text-notion-textLight">
            Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredUsers.length }} users
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <span class="text-sm text-notion-textLight px-2">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <svg class="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Add/Edit User Modal -->
      <Modal
        v-model="showUserModal"
        :title="isEditing ? 'Edit User' : 'Add New User'"
        size="md"
      >
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label for="name" class="form-label">Full Name</label>
            <input
              id="name"
              v-model="userForm.name"
              type="text"
              required
              class="input-field"
              placeholder="Enter full name"
            >
          </div>

          <div>
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="userForm.email"
              type="email"
              required
              class="input-field"
              placeholder="Enter email address"
            >
          </div>

          <div>
            <label for="role" class="form-label">Role</label>
            <select
              id="role"
              v-model="userForm.role"
              required
              class="input-field"
            >
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="user">User</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div>
            <label for="status" class="form-label">Status</label>
            <select
              id="status"
              v-model="userForm.status"
              required
              class="input-field"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div v-if="!isEditing">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="userForm.password"
              type="password"
              :required="!isEditing"
              class="input-field"
              placeholder="Enter password"
            >
          </div>

          <div v-if="error" class="alert-error">
            <p class="alert-text-error">{{ error }}</p>
          </div>
        </form>

        <template #footer>
          <button @click="showUserModal = false" class="btn-secondary">
            Cancel
          </button>
          <button @click="saveUser" class="btn-primary" :disabled="saving">
            <span v-if="!saving">{{ isEditing ? 'Update' : 'Create' }}</span>
            <span v-else class="flex items-center">
              <svg class="spinner -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          </button>
        </template>
      </Modal>

      <!-- Delete Confirmation Modal -->
      <Modal
        v-model="showDeleteModal"
        title="Delete User"
        size="sm"
      >
        <div class="space-y-4">
          <p class="text-sm text-notion-text">
            Are you sure you want to delete <strong>{{ userToDelete?.name }}</strong>?
          </p>
          <p class="text-sm text-notion-textLight">
            This action cannot be undone.
          </p>
        </div>

        <template #footer>
          <button @click="showDeleteModal = false" class="btn-secondary">
            Cancel
          </button>
          <button @click="confirmDelete" class="btn-danger" :disabled="deleting">
            <span v-if="!deleting">Delete</span>
            <span v-else class="flex items-center">
              <svg class="spinner -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Deleting...
            </span>
          </button>
        </template>
      </Modal>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import NavBar from '../components/NavBar.vue'
import Modal from '../components/Modal.vue'

// State
const users = ref([])
const searchQuery = ref('')
const roleFilter = ref('')
const showUserModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const deleting = ref(false)
const error = ref(null)
const userToDelete = ref(null)

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)

const userForm = reactive({
  id: null,
  name: '',
  email: '',
  role: '',
  status: 'active',
  password: ''
})

// Computed
const filteredUsers = computed(() => {
  let result = users.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }

  // Filter by role
  if (roleFilter.value) {
    result = result.filter(user => user.role === roleFilter.value)
  }

  return result
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage.value)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage.value, filteredUsers.value.length)
})

const paginatedUsers = computed(() => {
  return filteredUsers.value.slice(startIndex.value, endIndex.value)
})

// Watch for filter changes and reset to page 1
watch([searchQuery, roleFilter], () => {
  currentPage.value = 1
})

// Methods
const getRoleBadgeClass = (role) => {
  const classes = {
    admin: 'bg-red-100 text-red-800',
    editor: 'bg-blue-100 text-blue-800',
    user: 'bg-green-100 text-green-800',
    viewer: 'bg-gray-100 text-gray-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const openAddModal = () => {
  isEditing.value = false
  resetForm()
  error.value = null
  showUserModal.value = true
}

const openEditModal = (user) => {
  isEditing.value = true
  userForm.id = user.id
  userForm.name = user.name
  userForm.email = user.email
  userForm.role = user.role
  userForm.status = user.status
  userForm.password = ''
  error.value = null
  showUserModal.value = true
}

const openDeleteModal = (user) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const resetForm = () => {
  userForm.id = null
  userForm.name = ''
  userForm.email = ''
  userForm.role = ''
  userForm.status = 'active'
  userForm.password = ''
}

const saveUser = async () => {
  saving.value = true
  error.value = null

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    if (isEditing.value) {
      // Update existing user
      const index = users.value.findIndex(u => u.id === userForm.id)
      if (index !== -1) {
        users.value[index] = {
          ...users.value[index],
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          status: userForm.status
        }
      }
    } else {
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        status: userForm.status,
        createdAt: new Date().toISOString()
      }
      users.value.push(newUser)
    }

    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users.value))

    // Reset to first page if needed
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value || 1
    }

    showUserModal.value = false
    resetForm()
  } catch (err) {
    error.value = err.message || 'Failed to save user'
  } finally {
    saving.value = false
  }
}

const confirmDelete = async () => {
  if (!userToDelete.value) return

  deleting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    users.value = users.value.filter(u => u.id !== userToDelete.value.id)

    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users.value))

    // Reset to first page if current page is empty
    if (paginatedUsers.value.length === 0 && currentPage.value > 1) {
      currentPage.value = Math.max(1, currentPage.value - 1)
    }

    showDeleteModal.value = false
    userToDelete.value = null
  } catch (err) {
    error.value = err.message || 'Failed to delete user'
  } finally {
    deleting.value = false
  }
}

// Initialize
onMounted(() => {
  // Load users from localStorage or use default data
  const storedUsers = localStorage.getItem('users')
  if (storedUsers) {
    users.value = JSON.parse(storedUsers)
  } else {
    // Default users for demonstration
    users.value = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'admin',
        status: 'active',
        createdAt: new Date('2024-01-15').toISOString()
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'editor',
        status: 'active',
        createdAt: new Date('2024-02-20').toISOString()
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        role: 'user',
        status: 'active',
        createdAt: new Date('2024-03-10').toISOString()
      },
      {
        id: '4',
        name: 'Alice Williams',
        email: 'alice.williams@example.com',
        role: 'viewer',
        status: 'inactive',
        createdAt: new Date('2024-03-25').toISOString()
      }
    ]
    localStorage.setItem('users', JSON.stringify(users.value))
  }
})
</script>

<style scoped>
table {
  border-collapse: collapse;
}

tbody tr:last-child {
  border-bottom: none;
}
</style>

