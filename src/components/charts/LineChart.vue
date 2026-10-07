<template>
  <div>
    <ChartLegend v-if="series.length > 1" :items="legendItems" shape="line" class="mb-3" />
    <div ref="el" class="relative w-full" :style="{ height: `${height}px` }">
      <svg
        :width="width"
        :height="height"
        class="block overflow-visible outline-none"
        role="img"
        :aria-label="ariaLabel"
        tabindex="0"
        @pointermove="onPointerMove"
        @pointerleave="active = null"
        @keydown="onKeydown"
        @blur="active = null"
      >
        <g>
          <g v-for="tick in yTicks" :key="tick">
            <line
              :x1="margin.left"
              :x2="width - margin.right"
              :y1="y(tick)"
              :y2="y(tick)"
              :style="{ stroke: tick === 0 ? 'var(--chart-axis)' : 'var(--chart-grid)' }"
              stroke-width="1"
              shape-rendering="crispEdges"
            />
            <text :x="margin.left - 8" :y="y(tick)" dy="0.32em" text-anchor="end" class="chart-axis-label">
              {{ yFormat(tick) }}
            </text>
          </g>
          <text
            v-for="i in xTickIndexes"
            :key="`x${i}`"
            :x="x(i)"
            :y="height - 6"
            :text-anchor="i === 0 ? 'start' : i === labels.length - 1 ? 'end' : 'middle'"
            class="chart-axis-label"
          >
            {{ labels[i] }}
          </text>
        </g>

        <g v-for="(s, si) in series" :key="s.name">
          <path v-if="area" :d="areaPath(s.values)" :style="{ fill: colorOf(si) }" fill-opacity="0.1" />
          <path
            :d="linePath(s.values)"
            fill="none"
            :style="{ stroke: colorOf(si) }"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
          <circle
            :cx="x(s.values.length - 1)"
            :cy="y(s.values[s.values.length - 1])"
            r="4"
            :style="{ fill: colorOf(si), stroke: 'var(--surface)' }"
            stroke-width="2"
          />
        </g>

        <g v-if="active !== null">
          <line
            :x1="x(active)"
            :x2="x(active)"
            :y1="margin.top"
            :y2="height - margin.bottom"
            :style="{ stroke: 'var(--chart-axis)' }"
            stroke-width="1"
          />
          <circle
            v-for="(s, si) in series"
            :key="`a${s.name}`"
            :cx="x(active)"
            :cy="y(s.values[active])"
            r="4"
            :style="{ fill: colorOf(si), stroke: 'var(--surface)' }"
            stroke-width="2"
          />
        </g>
      </svg>

      <div v-if="active !== null" class="chart-tooltip" :style="tooltipStyle">
        <p class="mb-1.5 text-theme-textLight">{{ labels[active] }}</p>
        <div v-for="(s, si) in series" :key="`t${s.name}`" class="flex items-center gap-2 py-0.5">
          <span class="inline-block h-0.5 w-3 rounded-full" :style="{ backgroundColor: colorOf(si) }" />
          <span class="font-semibold tabular-nums text-theme-text">{{ valueFormat(s.values[active]) }}</span>
          <span class="text-theme-textLight">{{ s.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import ChartLegend from './ChartLegend.vue'
import { useElementWidth } from './useElementWidth'
import { niceTicks, formatCompact, seriesColor } from '@/lib/chart'

const props = defineProps({
  labels: { type: Array, required: true },
  // [{ name, values: number[], color? }]
  series: { type: Array, required: true },
  height: { type: Number, default: 240 },
  area: { type: Boolean, default: false },
  yMax: { type: Number, default: null },
  yFormat: { type: Function, default: formatCompact },
  valueFormat: { type: Function, default: formatCompact }
})

const { el, width } = useElementWidth()
const active = ref(null)
const margin = { top: 8, right: 8, bottom: 24, left: 48 }

const colorOf = (i) => props.series[i].color || seriesColor(i)
const legendItems = computed(() => props.series.map((s, i) => ({ name: s.name, color: colorOf(i) })))

const maxValue = computed(() => props.yMax ?? Math.max(...props.series.flatMap((s) => s.values), 0))
const yTicks = computed(() => niceTicks(maxValue.value))
const yTop = computed(() => yTicks.value[yTicks.value.length - 1])

const innerWidth = computed(() => width.value - margin.left - margin.right)
const innerHeight = computed(() => props.height - margin.top - margin.bottom)

function x(i) {
  const n = Math.max(1, props.labels.length - 1)
  return margin.left + (i / n) * innerWidth.value
}

function y(value) {
  return margin.top + innerHeight.value - (value / yTop.value) * innerHeight.value
}

const xTickIndexes = computed(() => {
  const n = props.labels.length
  const count = Math.max(2, Math.floor(innerWidth.value / 110))
  const step = Math.ceil((n - 1) / (count - 1))
  const ticks = []
  for (let i = 0; i < n - step / 2; i += step) ticks.push(i)
  ticks.push(n - 1)
  return ticks
})

function linePath(values) {
  return values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('')
}

function areaPath(values) {
  const base = y(0)
  return `${linePath(values)}L${x(values.length - 1)},${base}L${x(0)},${base}Z`
}

function onPointerMove(event) {
  const rect = event.currentTarget.getBoundingClientRect()
  const px = event.clientX - rect.left
  const n = props.labels.length - 1
  const i = Math.round(((px - margin.left) / innerWidth.value) * n)
  active.value = Math.min(n, Math.max(0, i))
}

function onKeydown(event) {
  const n = props.labels.length - 1
  if (event.key === 'ArrowRight') active.value = Math.min(n, (active.value ?? -1) + 1)
  else if (event.key === 'ArrowLeft') active.value = Math.max(0, (active.value ?? n + 1) - 1)
  else if (event.key === 'Escape') active.value = null
  else return
  event.preventDefault()
}

const tooltipStyle = computed(() => {
  const px = x(active.value)
  const flip = px > width.value * 0.6
  return {
    top: `${margin.top}px`,
    left: flip ? 'auto' : `${px + 12}px`,
    right: flip ? `${width.value - px + 12}px` : 'auto'
  }
})

const ariaLabel = computed(
  () => `Line chart of ${props.series.map((s) => s.name).join(', ')}. Use arrow keys to read values.`
)
</script>
