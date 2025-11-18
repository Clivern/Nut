<template>
  <div class="min-h-screen bg-theme-bg">
    <NavBar />

    <main class="w-full py-8 px-6 lg:px-8">
      <div class="page-header">
        <h1 class="page-title">Navigation Example</h1>
        <p class="page-subtitle">This demonstrates the navigation bar pattern</p>
      </div>

      <div class="card">
        <h3 class="text-sm font-semibold text-theme-text mb-4">Usage</h3>
        <p class="text-sm text-theme-textLight mb-4">
          The navigation bar is implemented as a reusable Vue component. It automatically highlights the active route.
        </p>
        <div class="bg-[#F7F6F3] p-4 rounded text-xs overflow-x-auto">
          <pre class="text-theme-text"><code>&lt;NavBar /&gt;</code></pre>
        </div>
      </div>

      <div class="card mt-3">
        <h3 class="text-sm font-semibold text-theme-text mb-4">Features</h3>
        <ul class="space-y-2 text-sm text-theme-textLight">
          <li class="flex items-start">
            <span class="text-theme-text mr-2">•</span>
            <span>Automatic active route highlighting</span>
          </li>
          <li class="flex items-start">
            <span class="text-theme-text mr-2">•</span>
            <span>Responsive design with mobile-friendly navigation</span>
          </li>
          <li class="flex items-start">
            <span class="text-theme-text mr-2">•</span>
            <span>Consistent styling with the Nut design system</span>
          </li>
          <li class="flex items-start">
            <span class="text-theme-text mr-2">•</span>
            <span>Easy to customize and extend</span>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
</script>

