<template>
  <div class="min-h-screen bg-theme-bg">
    <NavBar />

    <main class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div class="page-header">
        <h1 class="page-title">Metrics</h1>
        <p class="page-subtitle">Throughput, latency, errors, and saturation across services</p>
      </div>

      <div class="mb-6 flex flex-wrap items-end gap-3">
        <div class="w-44">
          <label for="range" class="form-label">Time range</label>
          <select id="range" v-model="rangeId" class="input-field">
            <option v-for="range in TIME_RANGES" :key="range.id" :value="range.id">{{ range.label }}</option>
          </select>
        </div>
        <div class="w-44">
          <label for="service" class="form-label">Service</label>
          <select id="service" v-model="service" class="input-field">
            <option value="">All services</option>
            <option v-for="name in SERVICES" :key="name" :value="name">{{ name }}</option>
          </select>
        </div>
        <button type="button" class="btn-secondary" @click="refresh">Refresh</button>
        <p class="ml-auto text-xs text-theme-textLight">Updated {{ updatedAt.toLocaleTimeString() }}</p>
      </div>

      <div class="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="tile in tiles" :key="tile.label" class="stat-card">
          <p class="stat-label">{{ tile.label }}</p>
          <div class="flex items-baseline justify-between gap-2">
            <p class="stat-value">{{ tile.value }}</p>
            <span class="text-xs font-medium" :class="tile.good ? 'text-green-700' : 'text-red-700'">{{ tile.delta }}</span>
          </div>
          <Sparkline :values="tile.trend" class="mt-3" />
        </div>
      </div>

      <div class="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title="Throughput" subtitle="Requests per minute" :table="tableFor(throughput)">
          <LineChart :labels="labels" :series="throughput" :value-format="(v) => `${formatCompact(v)} rpm`" />
        </ChartCard>

        <ChartCard title="Latency" subtitle="Response time percentiles" :table="tableFor(latency, formatDuration)">
          <LineChart :labels="labels" :series="latency" :y-format="formatDuration" :value-format="formatDuration" />
        </ChartCard>

        <ChartCard title="Errors" subtitle="5xx responses per interval" :table="tableFor(errors)">
          <BarChart :labels="labels" :series="errors" />
        </ChartCard>

        <ChartCard title="Latency distribution" subtitle="Share of requests per latency bucket over time">
          <Heatmap :rows="buckets" :columns="labels" :values="distribution" :cell-height="22" :value-format="(v) => `${v}%`" />
        </ChartCard>

        <ChartCard title="CPU" subtitle="Average utilisation across instances" :table="tableFor(cpu, pct)">
          <LineChart :labels="labels" :series="cpu" area :y-max="100" :y-format="pct" :value-format="pct" :height="180" />
        </ChartCard>

        <ChartCard title="Memory" subtitle="Resident set size" :table="tableFor(memory, gb)">
          <LineChart :labels="labels" :series="memory" area :y-format="gb" :value-format="gb" :height="180" />
        </ChartCard>
      </div>

      <section class="section !p-0 overflow-hidden">
        <header class="border-b border-theme-border px-5 py-4">
          <h2 class="text-sm font-semibold text-theme-text">Endpoints</h2>
          <p class="mt-0.5 text-xs text-theme-textLight">Slowest routes for the selected range</p>
        </header>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-theme-border text-xs text-theme-textLight">
                <th class="px-5 py-2.5 text-left font-medium">Endpoint</th>
                <th class="px-5 py-2.5 text-right font-medium">Requests</th>
                <th class="px-5 py-2.5 text-left font-medium w-1/3">p95 latency</th>
                <th class="px-5 py-2.5 text-right font-medium">Error rate</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in endpoints" :key="row.route" class="border-b border-theme-border last:border-0 hover:bg-theme-hover">
                <td class="px-5 py-2.5 font-mono text-xs text-theme-text">{{ row.route }}</td>
                <td class="px-5 py-2.5 text-right tabular-nums text-theme-textLight">{{ formatCompact(row.requests) }}</td>
                <td class="px-5 py-2.5">
                  <div class="flex items-center gap-3">
                    <div class="h-1.5 flex-1 rounded-r bg-theme-hover">
                      <div class="h-1.5 rounded-r" :style="{ width: `${(row.p95 / maxP95) * 100}%`, backgroundColor: 'var(--chart-1)' }" />
                    </div>
                    <span class="w-14 text-right text-xs tabular-nums text-theme-text">{{ formatDuration(row.p95) }}</span>
                  </div>
                </td>
                <td class="px-5 py-2.5 text-right">
                  <span
                    class="badge"
                    :class="row.errorRate >= 2 ? 'bg-red-50 text-red-800' : row.errorRate >= 1 ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-800'"
                  >
                    <span aria-hidden="true">{{ row.errorRate >= 2 ? '▲' : row.errorRate >= 1 ? '!' : '✓' }}</span>
                    {{ row.errorRate.toFixed(2) }}%
                  </span>
                </td>
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
import NavBar from '@/components/NavBar.vue'
import ChartCard from '@/components/charts/ChartCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import Heatmap from '@/components/charts/Heatmap.vue'
import Sparkline from '@/components/charts/Sparkline.vue'
import { formatCompact, formatDuration, seriesColor } from '@/lib/chart'
import { SERVICES, TIME_RANGES, generateSeries, timeLabels, hashSeed, createRandom } from '@/lib/telemetry'

const rangeId = ref('1h')
const service = ref('')
const updatedAt = ref(new Date())

const range = computed(() => TIME_RANGES.find((r) => r.id === rangeId.value))
const labels = computed(() => timeLabels(range.value, updatedAt.value))
const n = computed(() => range.value.points)
const seed = (...parts) => hashSeed(rangeId.value, service.value, updatedAt.value.getTime(), ...parts)

const pct = (v) => `${Math.round(v)}%`
const gb = (v) => `${+v.toFixed(1)} GB`

function refresh() {
  updatedAt.value = new Date()
}

// Colour follows the service, not its rank, so filtering never repaints a line.
const colorForService = (name) => seriesColor(SERVICES.indexOf(name))
const visibleServices = computed(() => (service.value ? [service.value] : SERVICES.slice(0, 3)))

const throughput = computed(() =>
  visibleServices.value.map((name) => ({
    name,
    color: colorForService(name),
    values: generateSeries(n.value, { base: [1800, 900, 1200, 600, 400][SERVICES.indexOf(name)], seed: seed('rpm', name), spikes: 0.02 }).map(Math.round)
  }))
)

const latency = computed(() => {
  const p50 = generateSeries(n.value, { base: 48, amplitude: 0.1, seed: seed('p50') })
  const p95 = p50.map((v, i) => v * 2.6 * (1 + 0.15 * Math.sin(i / 3)))
  const p99 = p95.map((v, i) => v * (1.9 + 0.25 * Math.sin(i / 5)))
  return [
    { name: 'p50', values: p50 },
    { name: 'p95', values: p95 },
    { name: 'p99', values: p99 }
  ]
})

const errors = computed(() => [
  { name: '5xx errors', values: generateSeries(n.value, { base: 6, amplitude: 0.3, noise: 0.6, spikes: 0.06, seed: seed('err') }).map(Math.round) }
])

const cpu = computed(() => [{ name: 'CPU', values: generateSeries(n.value, { base: 52, amplitude: 0.25, seed: seed('cpu') }).map((v) => Math.min(100, v)) }])
const memory = computed(() => [{ name: 'Memory', values: generateSeries(n.value, { base: 3.2, amplitude: 0.08, noise: 0.03, seed: seed('mem') }) }])

const buckets = ['>1s', '500ms', '250ms', '100ms', '50ms', '<25ms']
const distribution = computed(() => {
  const random = createRandom(seed('dist'))
  const shape = [1, 3, 8, 22, 38, 28]
  return buckets.map((_, b) => labels.value.map(() => Math.max(0, Math.round(shape[b] * (0.7 + random() * 0.6)))))
})

const sum = (values) => values.reduce((a, b) => a + b, 0)
const avg = (values) => sum(values) / values.length

const tiles = computed(() => {
  const rpm = throughput.value.map((s) => s.values).reduce((acc, v) => acc.map((x, i) => x + v[i]))
  const errs = errors.value[0].values
  const errorRate = rpm.map((r, i) => (errs[i] / r) * 100)
  return [
    { label: 'Request rate', value: `${formatCompact(avg(rpm))} rpm`, delta: '+6.2%', good: true, trend: rpm.slice(-24) },
    { label: 'Error rate', value: `${avg(errorRate).toFixed(2)}%`, delta: '+0.12pt', good: false, trend: errorRate.slice(-24) },
    { label: 'p95 latency', value: formatDuration(avg(latency.value[1].values)), delta: '−4.8%', good: true, trend: latency.value[1].values.slice(-24) },
    { label: 'CPU', value: pct(avg(cpu.value[0].values)), delta: '+2.0pt', good: false, trend: cpu.value[0].values.slice(-24) }
  ]
})

const endpoints = computed(() => {
  const random = createRandom(seed('endpoints'))
  return ['POST /api/checkout', 'GET /api/orders', 'GET /api/products', 'POST /api/login', 'GET /api/cart', 'GET /api/health']
    .map((route, i) => ({
      route,
      requests: Math.round(4000 + random() * 60000),
      p95: Math.round([620, 380, 240, 180, 120, 8][i] * (0.85 + random() * 0.3)),
      errorRate: [2.4, 0.6, 0.3, 1.2, 0.1, 0][i] * (0.8 + random() * 0.4)
    }))
    .sort((a, b) => b.p95 - a.p95)
})
const maxP95 = computed(() => Math.max(...endpoints.value.map((e) => e.p95)))

function tableFor(series, format = formatCompact) {
  return {
    columns: ['Time', ...series.map((s) => s.name)],
    rows: labels.value.map((label, i) => [label, ...series.map((s) => format(s.values[i]))])
  }
}
</script>
