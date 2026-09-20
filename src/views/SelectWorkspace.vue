<template>
  <div class="min-h-screen bg-theme-bg flex flex-col items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <div class="flex justify-center mb-6">
        <img src="/logo.png" alt="Logo" class="h-14 w-14 object-contain" />
      </div>

      <h1 class="text-xl font-semibold text-theme-text text-center">
        {{ workspaces.length ? 'Select a Workspace' : 'Create a Workspace' }}
      </h1>
      <p class="mt-2 text-sm text-theme-textLight text-center">
        {{ workspaces.length
          ? 'Choose a workspace to continue or create a new one.'
          : "You don't have any workspaces yet. Create one to get started." }}
      </p>

      <div v-if="workspaces.length" class="mt-6 space-y-3">
        <div
          v-for="workspace in workspaces"
          :key="workspace.id"
          class="flex items-center gap-2 rounded-lg border border-theme-border bg-white shadow-sm overflow-hidden"
        >
          <button
            type="button"
            class="flex-1 flex items-center justify-between px-4 py-3 text-left hover:bg-theme-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary-800 focus:ring-inset min-w-0"
            @click="selectWorkspace(workspace)"
          >
            <div class="flex min-w-0 flex-1 items-center gap-3">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-theme-text truncate">{{ workspace.name }}</p>
                <p class="text-xs text-theme-textLight mt-0.5">{{ formatDate(workspace.createdAt) }}</p>
              </div>
              <span
                v-if="current?.id === workspace.id"
                class="inline-flex shrink-0 rounded-full bg-primary-200 px-2.5 py-0.5 text-xs font-medium text-theme-text"
              >
                Active
              </span>
            </div>
            <svg class="ml-3 h-5 w-5 shrink-0 text-theme-textLight" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div class="mt-6">
        <router-link
          to="/create-workspace"
          :class="[
            'w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-800 focus:ring-offset-1 transition-colors',
            workspaces.length
              ? 'border border-theme-border bg-white text-theme-text hover:bg-theme-hover'
              : 'border-2 border-dashed border-primary-400 bg-primary-50/50 text-primary-800 hover:bg-primary-100'
          ]"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ workspaces.length ? 'Create New Workspace' : 'Create Your First Workspace' }}
        </router-link>
      </div>

      <p class="text-center text-xs text-theme-textLight mt-8">
        Copyright © 2026 Nut. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useWorkspaceStore } from '@/stores/workspace'

const router = useRouter()
const workspaceStore = useWorkspaceStore()

const workspaces = workspaceStore.workspaces
const current = workspaceStore.current

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function selectWorkspace(workspace) {
  workspaceStore.select(workspace)
  router.push('/dashboard')
}
</script>
