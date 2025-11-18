<template>
  <div class="min-h-screen bg-notion-bg">
    <NavBar />

    <main class="max-w-7xl mx-auto py-8 px-6 lg:px-8">
      <div class="page-header">
        <h1 class="page-title">Modal Components</h1>
        <p class="page-subtitle">Various modal patterns and examples</p>
      </div>

      <!-- Basic Modal Examples -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-notion-text mb-4">Basic Modals</h2>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button @click="showBasicModal = true" class="btn-primary">
            Basic Modal
          </button>
          <button @click="showConfirmModal = true" class="btn-primary">
            Confirmation Modal
          </button>
          <button @click="showAlertModal = true" class="btn-primary">
            Alert Modal
          </button>
        </div>
      </div>

      <!-- Form Modal Examples -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-notion-text mb-4">Form Modals</h2>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button @click="showFormModal = true" class="btn-secondary">
            Form Modal
          </button>
          <button @click="showDeleteModal = true" class="btn-danger">
            Delete Confirmation
          </button>
        </div>
      </div>

      <!-- Size Examples -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-notion-text mb-4">Modal Sizes</h2>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button @click="showSmallModal = true" class="btn-secondary">
            Small Modal
          </button>
          <button @click="showMediumModal = true" class="btn-secondary">
            Medium Modal
          </button>
          <button @click="showLargeModal = true" class="btn-secondary">
            Large Modal
          </button>
          <button @click="showXLargeModal = true" class="btn-secondary">
            X-Large Modal
          </button>
        </div>
      </div>

      <!-- Basic Modal -->
      <Modal v-model="showBasicModal" title="Basic Modal">
        <p class="text-sm text-notion-textLight mb-4">
          This is a basic modal with a title and content. You can add any content here.
        </p>
        <template #footer>
          <button @click="showBasicModal = false" class="btn-secondary">Cancel</button>
          <button @click="showBasicModal = false" class="btn-primary">OK</button>
        </template>
      </Modal>

      <!-- Confirmation Modal -->
      <Modal v-model="showConfirmModal" title="Confirm Action">
        <p class="text-sm text-notion-textLight mb-4">
          Are you sure you want to proceed with this action?
        </p>
        <template #footer>
          <button @click="showConfirmModal = false" class="btn-secondary">Cancel</button>
          <button @click="handleConfirm" class="btn-primary">Confirm</button>
        </template>
      </Modal>

      <!-- Alert Modal -->
      <Modal v-model="showAlertModal" title="Alert" :show-close="false">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm text-notion-textLight">
              This is an important alert message. Please review the information carefully.
            </p>
          </div>
        </div>
        <template #footer>
          <button @click="showAlertModal = false" class="btn-primary w-full">Got it</button>
        </template>
      </Modal>

      <!-- Form Modal -->
      <Modal v-model="showFormModal" title="Create New Item" size="lg">
        <form @submit.prevent="handleFormSubmit" class="space-y-4">
          <div>
            <label class="form-label">Name</label>
            <input
              v-model="formData.name"
              type="text"
              class="input-field"
              placeholder="Enter name"
              required
            >
          </div>
          <div>
            <label class="form-label">Description</label>
            <textarea
              v-model="formData.description"
              rows="4"
              class="input-field"
              placeholder="Enter description"
            ></textarea>
          </div>
          <div>
            <label class="form-label">Category</label>
            <select v-model="formData.category" class="input-field" required>
              <option value="">Select a category</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>
        </form>
        <template #footer>
          <button @click="showFormModal = false" class="btn-secondary">Cancel</button>
          <button @click="handleFormSubmit" class="btn-primary">Create</button>
        </template>
      </Modal>

      <!-- Delete Confirmation Modal -->
      <Modal v-model="showDeleteModal" title="Delete Item" size="sm">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <p class="text-sm text-notion-textLight mb-2">
            Are you sure you want to delete this item?
          </p>
          <p class="text-xs text-notion-textLight">
            This action cannot be undone.
          </p>
        </div>
        <template #footer>
          <button @click="showDeleteModal = false" class="btn-secondary">Cancel</button>
          <button @click="handleDelete" class="btn-danger">Delete</button>
        </template>
      </Modal>

      <!-- Small Modal -->
      <Modal v-model="showSmallModal" title="Small Modal" size="sm">
        <p class="text-sm text-notion-textLight">This is a small modal.</p>
        <template #footer>
          <button @click="showSmallModal = false" class="btn-primary w-full">Close</button>
        </template>
      </Modal>

      <!-- Medium Modal -->
      <Modal v-model="showMediumModal" title="Medium Modal" size="md">
        <p class="text-sm text-notion-textLight">This is a medium-sized modal with more content space.</p>
        <template #footer>
          <button @click="showMediumModal = false" class="btn-secondary">Cancel</button>
          <button @click="showMediumModal = false" class="btn-primary">OK</button>
        </template>
      </Modal>

      <!-- Large Modal -->
      <Modal v-model="showLargeModal" title="Large Modal" size="lg">
        <p class="text-sm text-notion-textLight mb-4">
          This is a large modal with even more space for content. Perfect for forms, detailed information, or complex interactions.
        </p>
        <div class="bg-[#F7F6F3] p-4 rounded">
          <p class="text-xs text-notion-textLight">
            You can include any content here, such as forms, tables, or rich media.
          </p>
        </div>
        <template #footer>
          <button @click="showLargeModal = false" class="btn-secondary">Cancel</button>
          <button @click="showLargeModal = false" class="btn-primary">Save</button>
        </template>
      </Modal>

      <!-- X-Large Modal -->
      <Modal v-model="showXLargeModal" title="X-Large Modal" size="xl">
        <p class="text-sm text-notion-textLight mb-4">
          This is an extra-large modal with maximum space for content. Ideal for complex forms, data tables, or detailed views.
        </p>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="bg-[#F7F6F3] p-4 rounded">
            <p class="text-xs font-medium text-notion-text mb-2">Column 1</p>
            <p class="text-xs text-notion-textLight">Content goes here</p>
          </div>
          <div class="bg-[#F7F6F3] p-4 rounded">
            <p class="text-xs font-medium text-notion-text mb-2">Column 2</p>
            <p class="text-xs text-notion-textLight">Content goes here</p>
          </div>
        </div>
        <template #footer>
          <button @click="showXLargeModal = false" class="btn-secondary">Cancel</button>
          <button @click="showXLargeModal = false" class="btn-primary">Save Changes</button>
        </template>
      </Modal>

      <!-- Usage Documentation -->
      <div class="card">
        <h3 class="text-sm font-semibold text-notion-text mb-4">Usage</h3>
        <div class="space-y-4">
          <div>
            <p class="text-sm font-medium text-notion-text mb-2">Basic Usage</p>
            <div class="bg-[#F7F6F3] p-4 rounded text-xs overflow-x-auto">
              <pre class="text-notion-text"><code>&lt;Modal v-model="showModal" title="Modal Title"&gt;
  &lt;p&gt;Modal content&lt;/p&gt;
  &lt;template #footer&gt;
    &lt;button @click="showModal = false"&gt;Close&lt;/button&gt;
  &lt;/template&gt;
&lt;/Modal&gt;</code></pre>
            </div>
          </div>
          <div>
            <p class="text-sm font-medium text-notion-text mb-2">Props</p>
            <ul class="text-xs text-notion-textLight space-y-1">
              <li><code class="bg-[#F7F6F3] px-1 rounded">v-model</code> - Boolean to control modal visibility</li>
              <li><code class="bg-[#F7F6F3] px-1 rounded">title</code> - Modal title (optional)</li>
              <li><code class="bg-[#F7F6F3] px-1 rounded">size</code> - Modal size: sm, md, lg, xl (default: md)</li>
              <li><code class="bg-[#F7F6F3] px-1 rounded">showClose</code> - Show close button (default: true)</li>
              <li><code class="bg-[#F7F6F3] px-1 rounded">closeOnBackdrop</code> - Close on backdrop click (default: true)</li>
            </ul>
          </div>
          <div>
            <p class="text-sm font-medium text-notion-text mb-2">Slots</p>
            <ul class="text-xs text-notion-textLight space-y-1">
              <li><code class="bg-[#F7F6F3] px-1 rounded">default</code> - Main modal content</li>
              <li><code class="bg-[#F7F6F3] px-1 rounded">header</code> - Custom header content</li>
              <li><code class="bg-[#F7F6F3] px-1 rounded">footer</code> - Footer content (buttons, etc.)</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import NavBar from '../components/NavBar.vue'
import Modal from '../components/Modal.vue'

const showBasicModal = ref(false)
const showConfirmModal = ref(false)
const showAlertModal = ref(false)
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const showSmallModal = ref(false)
const showMediumModal = ref(false)
const showLargeModal = ref(false)
const showXLargeModal = ref(false)

const formData = reactive({
  name: '',
  description: '',
  category: ''
})

const handleConfirm = () => {
  showConfirmModal.value = false
  alert('Action confirmed!')
}

const handleFormSubmit = () => {
  alert(`Form submitted: ${JSON.stringify(formData)}`)
  showFormModal.value = false
  // Reset form
  formData.name = ''
  formData.description = ''
  formData.category = ''
}

const handleDelete = () => {
  showDeleteModal.value = false
  alert('Item deleted!')
}
</script>

