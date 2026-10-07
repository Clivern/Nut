<template>
  <div class="min-h-screen bg-theme-bg">
    <NavBar />

    <main class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div class="page-header">
        <h1 class="page-title">Charts</h1>
        <p class="page-subtitle">Dependency-free SVG charts that follow the active theme. Hover or focus any chart for values.</p>
      </div>

      <h2 class="text-lg font-semibold text-theme-text mb-4">Stat tiles</h2>
      <div class="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="tile in tiles" :key="tile.label" class="stat-card">
          <p class="stat-label">{{ tile.label }}</p>
          <div class="flex items-baseline justify-between gap-2">
            <p class="stat-value">{{ tile.value }}</p>
            <span class="text-xs font-medium" :class="tile.good ? 'text-green-700' : 'text-red-700'">
              {{ tile.delta }}
            </span>
          </div>
          <p class="mt-0.5 text-xs text-theme-textLight">vs previous 7 days</p>
          <Sparkline :values="tile.trend" class="mt-3" />
        </div>
      </div>

      <div class="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title="Line chart" subtitle="Weekly active users by region" :table="tableFor(weeks, regions)">
          <LineChart :labels="weeks" :series="regions" />
        </ChartCard>

        <ChartCard title="Area chart" subtitle="Bandwidth served, GB per day" :table="tableFor(days, [bandwidth])">
          <LineChart :labels="days" :series="[bandwidth]" area :value-format="(v) => `${formatCompact(v)} GB`" />
        </ChartCard>

        <ChartCard title="Column chart" subtitle="Deployments per day" :table="tableFor(shortDays, [deploys])">
          <BarChart :labels="shortDays" :series="[deploys]" />
        </ChartCard>

        <ChartCard title="Stacked columns" subtitle="New signups by plan" :table="tableFor(months, plans)">
          <BarChart :labels="months" :series="plans" />
        </ChartCard>
      </div>

      <div class="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartCard title="Heatmap" subtitle="Requests by weekday and hour" class="xl:col-span-2">
          <Heatmap :rows="weekdays" :columns="hours" :values="heatmap" />
        </ChartCard>

        <ChartCard title="Ranked bars" subtitle="Traffic share by country">
          <ul class="space-y-3">
            <li v-for="country in countries" :key="country.name">
              <div class="mb-1 flex justify-between text-xs">
                <span class="text-theme-text">{{ country.name }}</span>
                <span class="tabular-nums text-theme-textLight">{{ country.share }}%</span>
              </div>
              <div class="h-2 rounded-r bg-theme-hover">
                <div class="h-2 rounded-r" :style="{ width: `${(country.share / countries[0].share) * 100}%`, backgroundColor: 'var(--chart-1)' }" />
              </div>
            </li>
          </ul>
        </ChartCard>
      </div>

      <ChartCard title="Meters" subtitle="Quota usage; fill color carries severity, with a label so color is never alone">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div v-for="meter in meters" :key="meter.label">
            <div class="mb-1.5 flex items-baseline justify-between text-sm">
              <span class="font-medium text-theme-text">{{ meter.label }}</span>
              <span class="tabular-nums text-theme-textLight">{{ meter.used }} / {{ meter.limit }}</span>
            </div>
            <div
              class="h-2 rounded-full bg-theme-hover"
              role="meter"
              :aria-valuenow="meter.pct"
              aria-valuemin="0"
              aria-valuemax="100"
              :aria-label="meter.label"
            >
              <div class="h-2 rounded-full" :style="{ width: `${meter.pct}%`, backgroundColor: severity(meter.pct).color }" />
            </div>
            <p class="mt-1.5 text-xs text-theme-textLight">{{ meter.pct }}% used · {{ severity(meter.pct).label }}</p>
          </div>
        </div>
      </ChartCard>
    </main>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import ChartCard from '@/components/charts/ChartCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import Sparkline from '@/components/charts/Sparkline.vue'
import Heatmap from '@/components/charts/Heatmap.vue'
import { formatCompact } from '@/lib/chart'
import { generateSeries, createRandom } from '@/lib/telemetry'

const weeks = Array.from({ length: 16 }, (_, i) => `W${i + 1}`)
const regions = [
  { name: 'Europe', values: generateSeries(16, { base: 4200, amplitude: 0.15, seed: 11 }).map(Math.round) },
  { name: 'North America', values: generateSeries(16, { base: 3100, amplitude: 0.2, seed: 12 }).map(Math.round) },
  { name: 'Asia Pacific', values: generateSeries(16, { base: 1800, amplitude: 0.25, seed: 13 }).map(Math.round) }
]

const days = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(Date.now() - (29 - i) * 86400000)
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
})
const bandwidth = { name: 'Bandwidth', values: generateSeries(30, { base: 820, amplitude: 0.18, seed: 21 }) }

const shortDays = days.slice(-14)
const deploys = { name: 'Deployments', values: generateSeries(14, { base: 9, amplitude: 0.4, noise: 0.5, seed: 31 }).map(Math.round) }

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
const plans = [
  { name: 'Free', values: generateSeries(9, { base: 640, seed: 41 }).map(Math.round) },
  { name: 'Pro', values: generateSeries(9, { base: 260, seed: 42 }).map(Math.round) },
  { name: 'Team', values: generateSeries(9, { base: 90, seed: 43 }).map(Math.round) }
]

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const hours = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`)
const random = createRandom(7)
const heatmap = weekdays.map((_, d) =>
  hours.map((_, h) => {
    const daytime = Math.exp(-((h - 14) ** 2) / 30)
    const weekend = d >= 5 ? 0.45 : 1
    return Math.round((200 + 2400 * daytime * weekend) * (0.85 + random() * 0.3))
  })
)

const countries = [
  { name: 'United States', share: 34 },
  { name: 'Germany', share: 14 },
  { name: 'United Kingdom', share: 11 },
  { name: 'India', share: 9 },
  { name: 'Brazil', share: 6 },
  { name: 'Japan', share: 5 }
]

const tiles = [
  { label: 'Revenue', value: '$48.2K', delta: '+8.1%', good: true, trend: generateSeries(12, { base: 40, seed: 51 }) },
  { label: 'Active users', value: '12.9K', delta: '+3.4%', good: true, trend: generateSeries(12, { base: 12, seed: 52 }) },
  { label: 'Churn', value: '2.1%', delta: '+0.3pt', good: false, trend: generateSeries(12, { base: 2, seed: 53 }) },
  { label: 'Avg session', value: '6m 12s', delta: '−4.0%', good: false, trend: generateSeries(12, { base: 6, seed: 54 }) }
]

const meters = [
  { label: 'API calls', used: '412K', limit: '1M', pct: 41 },
  { label: 'Storage', used: '78 GB', limit: '100 GB', pct: 78 },
  { label: 'Seats', used: '19', limit: '20', pct: 95 }
]

function severity(pct) {
  if (pct >= 90) return { color: 'var(--status-critical)', label: 'Critical' }
  if (pct >= 75) return { color: 'var(--status-warning)', label: 'Warning' }
  return { color: 'var(--chart-1)', label: 'Healthy' }
}

function tableFor(labels, series) {
  return {
    columns: ['', ...series.map((s) => s.name)],
    rows: labels.map((label, i) => [label, ...series.map((s) => formatCompact(s.values[i]))])
  }
}
</script>
