<template>
  <div class="min-h-screen bg-theme-bg">
    <NavBar />

    <main class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <header class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-semibold text-theme-text tracking-tight">Dashboard</h1>
        <p class="mt-1 text-sm text-theme-textLight">Overview of traffic, health, and recent activity</p>
      </header>

      <div class="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

      <section class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="section overflow-hidden !p-0">
          <div class="border-b border-theme-border px-6 py-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 class="text-lg font-semibold text-theme-text">Needs attention</h2>
                <p class="mt-0.5 text-sm text-theme-textLight">Items that should be reviewed</p>
              </div>
              <span class="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                Mock
              </span>
            </div>
          </div>
          <ul class="divide-y divide-theme-border">
            <li v-for="item in attentionItems" :key="item.id" class="flex gap-4 px-6 py-4">
              <span class="mt-1.5 h-2 w-2 shrink-0 rounded-full" :class="item.dot" aria-hidden="true" />
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-theme-text">{{ item.title }}</p>
                <p class="mt-0.5 text-sm text-theme-textLight leading-relaxed">{{ item.description }}</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="section overflow-hidden !p-0">
          <div class="border-b border-theme-border px-6 py-4">
            <h2 class="text-lg font-semibold text-theme-text">Recent activity</h2>
            <p class="mt-0.5 text-sm text-theme-textLight">Latest events on this workspace</p>
          </div>
          <div class="divide-y divide-theme-border">
            <div v-for="activity in recentActivities" :key="activity.id" class="px-6 py-4">
              <p class="text-sm font-medium text-theme-text">{{ activity.title }}</p>
              <p class="text-sm text-theme-textLight mt-1">{{ activity.description }}</p>
              <p class="text-xs text-theme-textLight mt-1.5">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </section>

      <div class="card">
        <h3 class="text-sm font-semibold text-theme-text mb-4">Quick Actions</h3>
        <div class="flex flex-wrap gap-2">
          <button type="button" class="btn-primary" @click="showFlash('Gateway added')">Add Gateway</button>
          <button type="button" class="btn-secondary">Configure</button>
          <button type="button" class="btn-secondary">View Analytics</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { showFlash } from '@/lib/flash'

const stats = ref({
  status: 'Online',
  totalRequests: 42853,
  avgResponse: 145,
  activeGateways: 3
})

const attentionItems = ref([
  {
    id: 1,
    title: 'Certificate expires in 7 days',
    description: 'Renew the TLS cert on gateway-prod before traffic is interrupted.',
    dot: 'bg-amber-500'
  },
  {
    id: 2,
    title: 'Error rate above 2%',
    description: 'Checkout API returned 5xx on 48 requests in the last hour.',
    dot: 'bg-red-500'
  },
  {
    id: 3,
    title: 'Unused integration',
    description: 'Slack notifications have not fired in 14 days.',
    dot: 'bg-sky-500'
  }
])

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
</script>
