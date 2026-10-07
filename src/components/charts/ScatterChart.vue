<template>
  <div>
    <ChartLegend v-if="groups.length > 1" :items="groups" class="mb-3" />
    <div ref="el" class="relative w-full" :style="{ height: `${height}px` }">
      <svg :width="width" :height="height" class="block overflow-visible" role="img" :aria-label="ariaLabel">
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
          v-for="(tick, i) in xTicks"
          :key="`x${i}`"
          :x="x(tick)"
          :y="height - 6"
          :text-anchor="i === 0 ? 'start' : i === xTicks.length - 1 ? 'end' : 'middle'"
          class="chart-axis-label"
        >
          {{ xFormat(tick) }}
        </text>

        <g
          v-for="point in points"
          :key="point.id"
          tabindex="0"
          class="cursor-pointer outline-none"
          :aria-label="`${point.label}: ${yFormat(point.y)}`"
          @pointerenter="active = point"
          @pointerleave="active = null"
          @focus="active = point"
          @blur="active = null"
          @click="emit('select', point)"
          @keydown.enter="emit('select', point)"
        >
          <circle :cx="x(point.x)" :cy="y(point.y)" r="12" fill="transparent" />
          <circle
            :cx="x(point.x)"
            :cy="y(point.y)"
            :r="active === point ? 6 : 4"
            :style="{ fill: colorOf(point.group), stroke: 'var(--surface)' }"
            stroke-width="2"
          />
        </g>
      </svg>

      <div v-if="active" class="chart-tooltip" :style="tooltipStyle">
        <p class="font-semibold tabular-nums text-theme-text">{{ yFormat(active.y) }}</p>
        <p class="mt-0.5 text-theme-text">{{ active.label }}</p>
        <p class="mt-0.5 text-theme-textLight">{{ xFormat(active.x) }} · {{ active.group }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import ChartLegend from './ChartLegend.vue'
import { useElementWidth } from './useElementWidth'
import { niceTicks, formatCompact } from '@/lib/chart'

const props = defineProps({
  // [{ id, x: number, y: number, group, label }]
  points: { type: Array, required: true },
  // [{ name, color }] - keep to three or fewer for scatter
  groups: { type: Array, required: true },
  height: { type: Number, default: 220 },
  xFormat: { type: Function, default: formatCompact },
  yFormat: { type: Function, default: formatCompact }
})

const emit = defineEmits(['select'])

const { el, width } = useElementWidth()
const active = ref(null)
const margin = { top: 8, right: 12, bottom: 24, left: 56 }

const colorOf = (group) => props.groups.find((g) => g.name === group)?.color || 'var(--primary-400)'

const xMin = computed(() => Math.min(...props.points.map((p) => p.x)))
const xMax = computed(() => Math.max(...props.points.map((p) => p.x)))
const yTicks = computed(() => niceTicks(Math.max(...props.points.map((p) => p.y), 0)))
const yTop = computed(() => yTicks.value[yTicks.value.length - 1])

const innerWidth = computed(() => width.value - margin.left - margin.right)
const innerHeight = computed(() => props.height - margin.top - margin.bottom)

const x = (value) => margin.left + ((value - xMin.value) / (xMax.value - xMin.value || 1)) * innerWidth.value
const y = (value) => margin.top + innerHeight.value - (value / yTop.value) * innerHeight.value

const xTicks = computed(() => {
  const count = Math.max(2, Math.floor(innerWidth.value / 110))
  return Array.from({ length: count }, (_, i) => xMin.value + ((xMax.value - xMin.value) * i) / (count - 1))
})

const tooltipStyle = computed(() => {
  const px = x(active.value.x)
  const py = y(active.value.y)
  const flip = px > width.value * 0.6
  return {
    top: `${Math.max(0, py - 24)}px`,
    left: flip ? 'auto' : `${px + 14}px`,
    right: flip ? `${width.value - px + 14}px` : 'auto'
  }
})

const ariaLabel = computed(() => `Scatter plot of ${props.points.length} points`)
</script>
