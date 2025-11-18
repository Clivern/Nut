<template>
  <div class="min-h-screen bg-notion-bg">
    <NavBar />

    <main class="w-full py-8 px-6 lg:px-8">
      <div class="page-header">
        <h1 class="page-title">Card Components</h1>
        <p class="page-subtitle">Various card styles and patterns</p>
      </div>

      <!-- Standard Cards -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-notion-text mb-4">Standard Cards</h2>
        <div class="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div class="card">
            <h3 class="text-sm font-semibold text-notion-text mb-2">Card Title</h3>
            <p class="text-sm text-notion-textLight">This is a standard card with padding and border.</p>
          </div>

          <div class="card">
            <h3 class="text-sm font-semibold text-notion-text mb-2">Another Card</h3>
            <p class="text-sm text-notion-textLight">Cards can contain any content you need.</p>
          </div>

          <div class="card">
            <h3 class="text-sm font-semibold text-notion-text mb-2">Third Card</h3>
            <p class="text-sm text-notion-textLight">Perfect for displaying related information.</p>
          </div>
        </div>
      </div>

      <!-- Compact Cards -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-notion-text mb-4">Compact Cards</h2>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div class="card-compact">
            <p class="stat-label">Label</p>
            <p class="stat-value">Value</p>
          </div>
          <div class="card-compact">
            <p class="stat-label">Users</p>
            <p class="stat-value">1,234</p>
          </div>
          <div class="card-compact">
            <p class="stat-label">Revenue</p>
            <p class="stat-value">$5,678</p>
          </div>
          <div class="card-compact">
            <p class="stat-label">Growth</p>
            <p class="stat-value">+12%</p>
          </div>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-notion-text mb-4">Stat Cards</h2>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div class="stat-card">
            <p class="stat-label">Total Requests</p>
            <p class="stat-value">42,853</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">Active Users</p>
            <p class="stat-value">1,234</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">Avg Response</p>
            <p class="stat-value">145ms</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">Uptime</p>
            <p class="stat-value">99.9%</p>
          </div>
        </div>
      </div>

      <!-- Section Cards -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-notion-text mb-4">Section Cards</h2>
        <div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div class="section">
            <h2 class="section-title">Section Title</h2>
            <div class="section-divider"></div>
            <p class="text-sm text-notion-textLight">Section content goes here. This style includes a divider below the title.</p>
          </div>

          <div class="section">
            <h2 class="section-title">Another Section</h2>
            <div class="section-divider"></div>
            <p class="text-sm text-notion-textLight">Perfect for grouping related settings or information.</p>
          </div>
        </div>
      </div>

      <!-- Alert Cards -->
      <div>
        <h2 class="text-lg font-semibold text-notion-text mb-4">Alert Messages</h2>
        <div class="space-y-3">
          <div class="alert-success">
            <p class="alert-text-success">This is a success message. Everything worked correctly!</p>
          </div>
          <div class="alert-error">
            <p class="alert-text-error">This is an error message. Something went wrong.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
</script>

