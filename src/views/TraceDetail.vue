<template>
  <div class="min-h-screen bg-theme-bg">
    <NavBar />

    <main class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <router-link to="/traces" class="mb-4 inline-flex items-center gap-1 text-sm text-theme-textLight hover:text-theme-text">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        All traces
      </router-link>

      <template v-if="trace">
        <div class="page-header">
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="page-title">{{ trace.operation }}</h1>
            <StatusBadge :status="trace.status" />
          </div>
          <p class="page-subtitle font-mono">{{ trace.id }}</p>
        </div>

        <div class="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div class="stat-card">
            <p class="stat-label">Duration</p>
            <p class="stat-value">{{ formatDuration(trace.duration) }}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">Spans</p>
            <p class="stat-value">{{ trace.spans.length }}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">Services</p>
            <p class="stat-value">{{ trace.services.length }}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">Started</p>
            <p class="stat-value text-lg">{{ trace.startedAt.toLocaleTimeString() }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section class="section !p-0 overflow-hidden self-start xl:col-span-2">
            <header class="flex flex-wrap items-center justify-between gap-3 border-b border-theme-border px-5 py-4">
              <h2 class="text-sm font-semibold text-theme-text">Waterfall</h2>
              <ChartLegend :items="legend" />
            </header>

            <div class="overflow-x-auto">
              <div class="min-w-[640px]">
                <div class="flex border-b border-theme-border text-xs text-theme-textLight">
                  <div class="w-2/5 shrink-0 px-5 py-2 font-medium">Span</div>
                  <div class="relative h-8 flex-1 mr-16">
                    <span
                      v-for="tick in ticks"
                      :key="tick"
                      class="absolute top-2 -translate-x-1/2 tabular-nums first:translate-x-0"
                      :style="{ left: `${(tick / trace.duration) * 100}%` }"
                    >
                      {{ formatDuration(tick) }}
                    </span>
                  </div>
                </div>

                <div
                  v-for="span in visibleSpans"
                  :key="span.id"
                  class="flex cursor-pointer items-center border-b border-theme-border last:border-0 hover:bg-theme-hover"
                  :class="{ 'bg-theme-hover': selectedId === span.id }"
                  tabindex="0"
                  role="button"
                  :aria-pressed="selectedId === span.id"
                  @click="selectedId = span.id"
                  @keydown.enter="selectedId = span.id"
                >
                  <div class="flex w-2/5 shrink-0 items-center gap-1.5 py-1.5 pr-3 text-xs" :style="{ paddingLeft: `${20 + span.depth * 14}px` }">
                    <button
                      v-if="childCount[span.id]"
                      type="button"
                      class="flex h-4 w-4 shrink-0 items-center justify-center rounded text-theme-textLight hover:bg-theme-border"
                      :aria-label="collapsed.has(span.id) ? 'Expand' : 'Collapse'"
                      :aria-expanded="!collapsed.has(span.id)"
                      @click.stop="toggle(span.id)"
                    >
                      <svg class="h-3 w-3 transition-transform" :class="{ '-rotate-90': collapsed.has(span.id) }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <span v-else class="w-4 shrink-0" />
                    <span class="h-2.5 w-2.5 shrink-0 rounded-sm" :style="{ backgroundColor: colorOf(span.service) }" aria-hidden="true" />
                    <span class="truncate">
                      <span class="text-theme-textLight">{{ span.service }}</span>
                      <span class="ml-1 text-theme-text">{{ span.name }}</span>
                    </span>
                    <span v-if="span.status === 'error'" class="shrink-0 text-red-700" title="Error">✕</span>
                  </div>
                  <div class="relative mr-16 h-7 flex-1">
                    <div
                      class="absolute top-1/2 h-3 -translate-y-1/2 rounded-sm"
                      :style="{
                        left: `${(span.start / trace.duration) * 100}%`,
                        width: `max(2px, ${(span.duration / trace.duration) * 100}%)`,
                        backgroundColor: colorOf(span.service)
                      }"
                    />
                    <span
                      class="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pl-1.5 text-[11px] tabular-nums text-theme-textLight"
                      :style="{ left: `${((span.start + span.duration) / trace.duration) * 100}%` }"
                    >
                      {{ formatDuration(span.duration) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside v-if="selected" class="section self-start">
            <div class="mb-1 flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-sm" :style="{ backgroundColor: colorOf(selected.service) }" aria-hidden="true" />
              <p class="text-xs text-theme-textLight">{{ selected.service }}</p>
            </div>
            <h2 class="text-base font-semibold text-theme-text break-words">{{ selected.name }}</h2>
            <p class="mt-1 font-mono text-xs text-theme-textLight">{{ selected.id }}</p>

            <dl class="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt class="text-xs text-theme-textLight">Duration</dt>
                <dd class="font-medium text-theme-text tabular-nums">{{ formatDuration(selected.duration) }}</dd>
              </div>
              <div>
                <dt class="text-xs text-theme-textLight">Start offset</dt>
                <dd class="font-medium text-theme-text tabular-nums">+{{ formatDuration(selected.start) }}</dd>
              </div>
              <div>
                <dt class="text-xs text-theme-textLight">Share of trace</dt>
                <dd class="font-medium text-theme-text tabular-nums">{{ ((selected.duration / trace.duration) * 100).toFixed(1) }}%</dd>
              </div>
              <div>
                <dt class="text-xs text-theme-textLight">Status</dt>
                <dd><StatusBadge :status="selected.status" /></dd>
              </div>
            </dl>

            <h3 class="mt-6 mb-2 text-xs font-semibold uppercase tracking-wide text-theme-textLight">Attributes</h3>
            <table class="w-full text-xs">
              <tbody>
                <tr v-for="(value, key) in selected.attributes" :key="key" class="border-b border-theme-border last:border-0">
                  <td class="py-1.5 pr-3 align-top font-mono text-theme-textLight">{{ key }}</td>
                  <td class="py-1.5 font-mono text-theme-text break-all">{{ value }}</td>
                </tr>
              </tbody>
            </table>
          </aside>
        </div>
      </template>

      <div v-else class="card text-center">
        <p class="text-sm font-semibold text-theme-text">Trace not found</p>
        <p class="mt-1 text-sm text-theme-textLight">It may have expired from retention.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import ChartLegend from '@/components/charts/ChartLegend.vue'
import StatusBadge from '@/components/charts/StatusBadge.vue'
import { formatDuration, niceTicks, seriesColor } from '@/lib/chart'
import { SERVICES, getTrace } from '@/lib/telemetry'

const route = useRoute()
const trace = computed(() => getTrace(route.params.id))
const selectedId = ref(null)
const collapsed = ref(new Set())

watch(
  trace,
  (value) => {
    collapsed.value = new Set()
    selectedId.value = value?.spans.find((s) => s.status === 'error' && !value.spans.some((c) => c.parentId === s.id))?.id || value?.spans[0]?.id || null
  },
  { immediate: true }
)

const colorOf = (service) => seriesColor(SERVICES.indexOf(service))
const legend = computed(() => trace.value.services.map((name) => ({ name, color: colorOf(name) })))

const ticks = computed(() => niceTicks(trace.value.duration, 4).filter((t) => t <= trace.value.duration))

const childCount = computed(() => {
  const counts = {}
  for (const span of trace.value.spans) if (span.parentId) counts[span.parentId] = (counts[span.parentId] || 0) + 1
  return counts
})

// Spans are generated depth-first, so hiding descendants of collapsed rows keeps tree order.
const visibleSpans = computed(() => {
  const hidden = new Set()
  return trace.value.spans.filter((span) => {
    if (span.parentId && (hidden.has(span.parentId) || collapsed.value.has(span.parentId))) {
      hidden.add(span.id)
      return false
    }
    return true
  })
})

const selected = computed(() => trace.value?.spans.find((s) => s.id === selectedId.value) || null)

function toggle(id) {
  const next = new Set(collapsed.value)
  next.has(id) ? next.delete(id) : next.add(id)
  collapsed.value = next
}
</script>
