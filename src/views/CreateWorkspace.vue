<template>
  <div class="min-h-screen flex items-center justify-center bg-theme-bg px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-10">
        <div class="flex justify-center mb-8">
          <img src="/logo.png" alt="Logo" class="h-24 w-24 object-contain" />
        </div>
      </div>

      <div class="bg-white rounded-lg border border-theme-border p-8 shadow-sm">
        <h2 class="text-2xl font-semibold text-theme-text mb-2 text-center">Create a Workspace</h2>
        <p class="text-sm text-theme-textLight text-center mb-6">
          Enter a name for your new workspace.
        </p>

        <form class="space-y-5" @submit.prevent="handleCreate">
          <div>
            <label for="workspace-name" class="form-label">Workspace name</label>
            <input
              id="workspace-name"
              v-model="name"
              type="text"
              required
              class="input-field"
              placeholder="My Workspace"
              :disabled="loading"
            >
          </div>

          <div>
            <button
              type="submit"
              class="w-full btn-primary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading || !name.trim()"
            >
              <span v-if="!loading">Create workspace</span>
              <span v-else class="flex items-center justify-center">
                <svg class="spinner -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </span>
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <router-link
            to="/select-workspace"
            class="text-sm text-theme-textLight hover:text-theme-text transition-colors flex items-center justify-center"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to workspaces
          </router-link>
        </div>
      </div>

      <p class="text-center text-xs text-theme-textLight mt-8">
        Copyright © 2026 Nut. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showFlash } from '@/lib/flash'
import { useWorkspaceStore } from '@/stores/workspace'

const router = useRouter()
const workspaceStore = useWorkspaceStore()

const name = ref('')
const loading = ref(false)

async function handleCreate() {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 600))
  workspaceStore.create(name.value)
  showFlash('Workspace created')
  router.push('/dashboard')
}
</script>
