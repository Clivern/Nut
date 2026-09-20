<template>
  <div class="min-h-screen bg-theme-bg">
    <NavBar />

    <main class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div class="page-header">
        <h1 class="page-title">Themes</h1>
        <p class="page-subtitle">Switch the design tokens used across every Nut component</p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        <button
          v-for="item in THEMES"
          :key="item.id"
          type="button"
          class="card text-left hover:shadow-md transition-shadow"
          :class="{ 'ring-2 ring-primary-800': theme === item.id }"
          @click="selectTheme(item.id)"
        >
          <span class="mb-4 flex h-10 w-10 rounded-full border border-theme-border" :style="{ background: item.swatch }" />
          <p class="text-sm font-semibold text-theme-text">{{ item.label }}</p>
          <p class="text-xs text-theme-textLight mt-1">{{ item.id }}</p>
        </button>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-8">
        <div class="stat-card">
          <p class="stat-label">Primary</p>
          <p class="stat-value">Aa</p>
        </div>
        <div class="card">
          <h3 class="text-sm font-semibold text-theme-text mb-4">Buttons</h3>
          <div class="flex flex-wrap gap-2">
            <button type="button" class="btn-primary">Primary</button>
            <button type="button" class="btn-secondary">Secondary</button>
            <button type="button" class="btn-danger">Danger</button>
          </div>
        </div>
        <div class="card">
          <label class="form-label">Input</label>
          <input class="input-field" placeholder="Themed input field">
        </div>
      </div>

      <div class="section overflow-hidden !p-0">
        <div class="border-b border-theme-border px-6 py-4">
          <h2 class="text-lg font-semibold text-theme-text">Section header</h2>
          <p class="mt-0.5 text-sm text-theme-textLight">Used on dashboard lists and profile cards</p>
        </div>
        <div class="px-6 py-5 text-sm text-theme-textLight">
          Surfaces, borders, and text all follow CSS variables so a theme change is one class on <code class="text-theme-text">&lt;html&gt;</code>.
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { THEMES, applyTheme, readStoredTheme } from '@/lib/preferences'
import { showFlash } from '@/lib/flash'

const theme = ref(readStoredTheme())

function selectTheme(id) {
  theme.value = applyTheme(id)
  showFlash(`Theme set to ${id}`)
}
</script>
