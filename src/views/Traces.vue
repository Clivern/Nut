<template>
  <div class="min-h-screen bg-theme-bg">
    <NavBar />

    <main class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div class="page-header">
        <h1 class="page-title">Traces</h1>
        <p class="page-subtitle">Distributed request traces across services. Select a point or row to open its waterfall.</p>
      </div>

      <div class="mb-6 flex flex-wrap items-end gap-3">
        <div class="w-full sm:w-72">
          <label for="trace-search" class="form-label">Search</label>
          <input id="trace-search" v-model="query" type="text" class="input-field" placeholder="Trace ID or operation..." />
        </div>
        <div class="w-40">
          <label for="trace-service" class="form-label">Service</label>
          <select id="trace-service" v-model="service" class="input-field">
            <option value="">All services</option>
            <option v-for="name in SERVICES" :key="name" :value="name">{{ name }}</option>
          </select>
        </div>
        <div class="w-32">
          <label for="trace-status" class="form-label">Status</label>
          <select id="trace-status" v-model="status" class="input-field">
            <option value="">Any</option>
            <option value="ok">OK</option>
            <option value="error">Error</option>
          </select>
        </div>
        <div class="w-36">
          <label for="trace-min" class="form-label">Min duration</label>
          <select id="trace-min" v-model.number="minDuration" class="input-field">
            <option :value="0">Any</option>
            <option :value="100">≥ 100ms</option>
            <option :value="250">≥ 250ms</option>
            <option :value="1000">≥ 1s</option>
          </select>
        </div>
      </div>

      <div class="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div class="stat-card">
          <p class="stat-label">Traces</p>
          <p class="stat-value">{{ filtered.length }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">Errors</p>
          <p class="stat-value">{{ errorCount }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">p50 duration</p>
          <p class="stat-value">{{ percentile(0.5) }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">p95 duration</p>
          <p class="stat-value">{{ percentile(0.95) }}</p>
        </div>
      </div>

      <ChartCard title="Duration over time" subtitle="Each point is one trace" class="mb-6">
        <ScatterChart
          v-if="points.length"
          :points="points"
          :groups="groups"
          :x-format="formatTime"
          :y-format="formatDuration"
          @select="(point) => openTrace(point.id)"
        />
        <p v-else class="py-12 text-center text-sm text-theme-textLight">No traces match. Try widening the filters.</p>
      </ChartCard>

      <section class="section !p-0 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-theme-border text-xs text-theme-textLight">
                <th class="px-5 py-2.5 text-left font-medium">Trace</th>
                <th class="px-5 py-2.5 text-left font-medium">Services</th>
                <th class="px-5 py-2.5 text-right font-medium">Spans</th>
                <th class="px-5 py-2.5 text-left font-medium w-1/4">Duration</th>
                <th class="px-5 py-2.5 text-left font-medium">Status</th>
                <th class="px-5 py-2.5 text-right font-medium">Started</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="trace in filtered"
                :key="trace.id"
                class="cursor-pointer border-b border-theme-border last:border-0 hover:bg-theme-hover"
                tabindex="0"
                @click="openTrace(trace.id)"
                @keydown.enter="openTrace(trace.id)"
              >
                <td class="px-5 py-2.5">
                  <p class="font-medium text-theme-text">{{ trace.operation }}</p>
                  <p class="font-mono text-xs text-theme-textLight">{{ trace.id.slice(0, 16) }}</p>
                </td>
                <td class="px-5 py-2.5">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="name in trace.services"
                      :key="name"
                      class="badge border border-theme-border text-theme-textLight"
                    >
                      <span class="h-2 w-2 rounded-sm" :style="{ backgroundColor: seriesColor(SERVICES.indexOf(name)) }" aria-hidden="true" />
                      {{ name }}
                    </span>
                  </div>
                </td>
                <td class="px-5 py-2.5 text-right tabular-nums text-theme-textLight">{{ trace.spans.length }}</td>
                <td class="px-5 py-2.5">
                  <div class="flex items-center gap-3">
                    <div class="h-1.5 flex-1 rounded-r bg-theme-hover">
                      <div class="h-1.5 rounded-r" :style="{ width: `${(trace.duration / maxDuration) * 100}%`, backgroundColor: 'var(--chart-1)' }" />
                    </div>
                    <span class="w-16 text-right text-xs tabular-nums text-theme-text">{{ formatDuration(trace.duration) }}</span>
                  </div>
                </td>
                <td class="px-5 py-2.5">
                  <StatusBadge :status="trace.status" />
                </td>
                <td class="px-5 py-2.5 text-right text-xs tabular-nums text-theme-textLight">{{ formatTime(trace.startedAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import ChartCard from '@/components/charts/ChartCard.vue'
import ScatterChart from '@/components/charts/ScatterChart.vue'
import StatusBadge from '@/components/charts/StatusBadge.vue'
import { formatDuration, seriesColor } from '@/lib/chart'
import { SERVICES, getTraces } from '@/lib/telemetry'

const router = useRouter()
const traces = getTraces()

const query = ref('')
const service = ref('')
const status = ref('')
const minDuration = ref(0)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return traces
    .filter((t) => !q || t.id.includes(q) || t.operation.toLowerCase().includes(q))
    .filter((t) => !service.value || t.services.includes(service.value))
    .filter((t) => !status.value || t.status === status.value)
    .filter((t) => t.duration >= minDuration.value)
    .slice()
    .reverse()
})

const groups = [
  { name: 'OK', color: 'var(--chart-1)' },
  { name: 'Error', color: 'var(--status-critical)' }
]

const points = computed(() =>
  filtered.value.map((t) => ({
    id: t.id,
    x: t.startedAt.getTime(),
    y: t.duration,
    group: t.status === 'error' ? 'Error' : 'OK',
    label: t.operation
  }))
)

const errorCount = computed(() => filtered.value.filter((t) => t.status === 'error').length)
const maxDuration = computed(() => Math.max(1, ...filtered.value.map((t) => t.duration)))

function percentile(p) {
  const sorted = filtered.value.map((t) => t.duration).sort((a, b) => a - b)
  if (!sorted.length) return '–'
  return formatDuration(sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))])
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function openTrace(id) {
  router.push({ name: 'TraceDetail', params: { id } })
}
</script>
