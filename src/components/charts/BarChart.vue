<template>
  <div>
    <ChartLegend v-if="series.length > 1" :items="legendItems" class="mb-3" />
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

        <g
          v-for="(column, i) in columns"
          :key="labels[i]"
          tabindex="0"
          class="outline-none"
          :aria-label="`${labels[i]}: ${column.segments.map((s) => `${s.name} ${valueFormat(s.value)}`).join(', ')}`"
          @pointerenter="active = i"
          @pointerleave="active = null"
          @focus="active = i"
          @blur="active = null"
        >
          <rect :x="bandX(i)" :y="margin.top" :width="bandWidth" :height="innerHeight" fill="transparent" />
          <path
            v-for="segment in column.segments"
            :key="segment.name"
            :d="segment.d"
            :style="{ fill: segment.color }"
            :opacity="active === null || active === i ? 1 : 0.55"
            class="transition-opacity"
          />
        </g>

        <text
          v-for="i in xTickIndexes"
          :key="`x${i}`"
          :x="bandX(i) + bandWidth / 2"
          :y="height - 6"
          text-anchor="middle"
          class="chart-axis-label"
        >
          {{ labels[i] }}
        </text>
      </svg>

      <div v-if="active !== null" class="chart-tooltip" :style="tooltipStyle">
        <p class="mb-1.5 text-theme-textLight">{{ labels[active] }}</p>
        <div
          v-for="segment in [...columns[active].segments].reverse()"
          :key="segment.name"
          class="flex items-center gap-2 py-0.5"
        >
          <span class="inline-block h-2.5 w-2.5 rounded-sm" :style="{ backgroundColor: segment.color }" />
          <span class="font-semibold tabular-nums text-theme-text">{{ valueFormat(segment.value) }}</span>
          <span class="text-theme-textLight">{{ segment.name }}</span>
        </div>
        <p v-if="series.length > 1" class="mt-1 border-t border-theme-border pt-1 text-theme-textLight">
          Total <span class="font-semibold text-theme-text tabular-nums">{{ valueFormat(columns[active].total) }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import ChartLegend from './ChartLegend.vue'
import { useElementWidth } from './useElementWidth'
import { niceTicks, formatCompact, seriesColor, columnPath } from '@/lib/chart'

const props = defineProps({
  labels: { type: Array, required: true },
  // [{ name, values: number[], color? }] - more than one series stacks
  series: { type: Array, required: true },
  height: { type: Number, default: 240 },
  yFormat: { type: Function, default: formatCompact },
  valueFormat: { type: Function, default: formatCompact }
})

const { el, width } = useElementWidth()
const active = ref(null)
const margin = { top: 8, right: 8, bottom: 24, left: 48 }
const GAP = 2

const colorOf = (i) => props.series[i].color || seriesColor(i)
const legendItems = computed(() => props.series.map((s, i) => ({ name: s.name, color: colorOf(i) })))

const totals = computed(() => props.labels.map((_, i) => props.series.reduce((sum, s) => sum + (s.values[i] || 0), 0)))
const yTicks = computed(() => niceTicks(Math.max(...totals.value, 0)))
const yTop = computed(() => yTicks.value[yTicks.value.length - 1])

const innerWidth = computed(() => width.value - margin.left - margin.right)
const innerHeight = computed(() => props.height - margin.top - margin.bottom)
const bandWidth = computed(() => innerWidth.value / props.labels.length)
const barWidth = computed(() => Math.max(2, Math.min(24, bandWidth.value - GAP * 2, bandWidth.value * 0.7)))

const bandX = (i) => margin.left + i * bandWidth.value
const y = (value) => margin.top + innerHeight.value - (value / yTop.value) * innerHeight.value

const columns = computed(() =>
  props.labels.map((_, i) => {
    const x = bandX(i) + (bandWidth.value - barWidth.value) / 2
    let base = 0
    const visible = props.series.map((s, si) => ({ si, value: s.values[i] || 0 })).filter((s) => s.value > 0)
    const segments = visible.map(({ si, value }, k) => {
      const top = y(base + value)
      const bottom = y(base) - (k > 0 ? GAP : 0)
      base += value
      const isTop = k === visible.length - 1
      const h = Math.max(0, bottom - top)
      return {
        name: props.series[si].name,
        value,
        color: colorOf(si),
        d: isTop ? columnPath(x, top, barWidth.value, h) : `M${x},${top}h${barWidth.value}v${h}h${-barWidth.value}Z`
      }
    })
    return { segments, total: totals.value[i] }
  })
)

const xTickIndexes = computed(() => {
  const n = props.labels.length
  const step = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(innerWidth.value / 64))))
  return props.labels.map((_, i) => i).filter((i) => i % step === 0)
})

const tooltipStyle = computed(() => {
  const px = bandX(active.value) + bandWidth.value / 2
  const flip = px > width.value * 0.6
  return {
    top: `${margin.top}px`,
    left: flip ? 'auto' : `${px + 16}px`,
    right: flip ? `${width.value - px + 16}px` : 'auto'
  }
})

const ariaLabel = computed(() => `Column chart of ${props.series.map((s) => s.name).join(', ')}`)
</script>
