<template>
  <div class="min-h-screen bg-theme-bg">
    <NavBar />

    <main class="w-full py-8 px-6 lg:px-8">
      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
      </div>

      <!-- Stats Grid -->
      <div class="mb-6">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div class="stat-card">
            <p class="stat-label">Status</p>
            <p class="stat-value">{{ stats.status }}</p>
          </div>

          <div class="stat-card">
            <p class="stat-label">Total Requests</p>
            <p class="stat-value">{{ stats.totalRequests.toLocaleString() }}</p>
          </div>

          <div class="stat-card">
            <p class="stat-label">Avg Response</p>
            <p class="stat-value">{{ stats.avgResponse }}ms</p>
          </div>

          <div class="stat-card">
            <p class="stat-label">Active Gateways</p>
            <p class="stat-value">{{ stats.activeGateways }}</p>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <!-- Recent Activity -->
        <div class="card">
          <h3 class="text-sm font-semibold text-theme-text mb-5">Recent Activity</h3>
          <div class="space-y-4">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="pb-4 last:pb-0 border-b border-theme-border last:border-0"
            >
              <p class="text-sm font-medium text-theme-text">{{ activity.title }}</p>
              <p class="text-sm text-theme-textLight mt-1">{{ activity.description }}</p>
              <p class="text-xs text-theme-textLight mt-1.5">{{ activity.time }}</p>
            </div>
          </div>
        </div>

        <!-- System Info -->
        <div class="card">
          <h3 class="text-sm font-semibold text-theme-text mb-5">System Information</h3>
          <div class="space-y-3">
            <div class="flex justify-between py-2.5 border-b border-theme-border">
              <span class="text-sm text-theme-textLight">Version</span>
              <span class="text-sm font-medium text-theme-text">v0.1.0</span>
            </div>
            <div class="flex justify-between py-2.5 border-b border-theme-border">
              <span class="text-sm text-theme-textLight">Uptime</span>
              <span class="text-sm font-medium text-theme-text">{{ systemInfo.uptime }}</span>
            </div>
            <div class="flex justify-between py-2.5 border-b border-theme-border">
              <span class="text-sm text-theme-textLight">Memory Usage</span>
              <span class="text-sm font-medium text-theme-text">{{ systemInfo.memory }}</span>
            </div>
            <div class="flex justify-between py-2.5">
              <span class="text-sm text-theme-textLight">CPU Usage</span>
              <span class="text-sm font-medium text-theme-text">{{ systemInfo.cpu }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-3">
        <div class="card">
          <h3 class="text-sm font-semibold text-theme-text mb-4">Quick Actions</h3>
          <div class="flex flex-wrap gap-2">
            <button class="btn-primary">Add Gateway</button>
            <button class="btn-secondary">Configure</button>
            <button class="btn-secondary">View Analytics</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue'

const stats = ref({
  status: 'Online',
  totalRequests: 42853,
  avgResponse: 145,
  activeGateways: 3
})

const recentActivities = ref([
  {
    id: 1,
    title: 'Gateway Connected',
    description: 'New MCP gateway registered successfully',
    time: '2 minutes ago'
  },
  {
    id: 2,
    title: 'Request Processed',
    description: 'API request completed in 120ms',
    time: '5 minutes ago'
  },
  {
    id: 3,
    title: 'Configuration Updated',
    description: 'Gateway settings modified',
    time: '15 minutes ago'
  },
  {
    id: 4,
    title: 'Health Check',
    description: 'All systems operational',
    time: '30 minutes ago'
  }
])

const systemInfo = ref({
  uptime: '7 days, 14 hours',
  memory: '245 MB / 2 GB',
  cpu: '12%'
})
</script>

