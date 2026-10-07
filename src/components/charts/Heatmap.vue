<template>
  <div>
    <div ref="el" class="relative w-full">
      <svg :width="width" :height="svgHeight" class="block" role="img" :aria-label="ariaLabel">
        <text
          v-for="(row, r) in rows"
          :key="row"
          :x="margin.left - 8"
          :y="margin.top + r * cellHeight + cellHeight / 2"
          dy="0.32em"
          text-anchor="end"
          class="chart-axis-label"
        >
          {{ row }}
        </text>
        <template v-for="(row, r) in rows" :key="`r${row}`">
          <rect
            v-for="(col, c) in columns"
            :key="col"
            :x="margin.left + c * cellWidth + 1"
            :y="margin.top + r * cellHeight + 1"
            :width="Math.max(1, cellWidth - 2)"
            :height="cellHeight - 2"
            rx="2"
            :style="{ fill: colorFor(values[r][c]) }"
            :stroke="active && active.r === r && active.c === c ? 'var(--theme-text)' : 'none'"
            stroke-width="1.5"
            tabindex="0"
            class="outline-none"
            :aria-label="`${row}, ${col}: ${valueFormat(values[r][c])}`"
            @pointerenter="active = { r, c }"
            @pointerleave="active = null"
            @focus="active = { r, c }"
            @blur="active = null"
          />
        </template>
        <text
          v-for="c in columnTicks"
          :key="`c${c}`"
          :x="margin.left + c * cellWidth + cellWidth / 2"
          :y="svgHeight - 6"
          text-anchor="middle"
          class="chart-axis-label"
        >
          {{ columns[c] }}
        </text>
      </svg>

      <div v-if="active" class="chart-tooltip" :style="tooltipStyle">
        <p class="text-theme-textLight">{{ rows[active.r] }} · {{ columns[active.c] }}</p>
        <p class="mt-0.5 font-semibold tabular-nums text-theme-text">{{ valueFormat(values[active.r][active.c]) }}</p>
      </div>
    </div>

    <div class="mt-3 flex items-center gap-2 text-xs text-theme-textLight">
      <span>{{ valueFormat(min) }}</span>
      <div class="flex">
        <span v-for="color in SEQUENTIAL" :key="color" class="h-2.5 w-6 first:rounded-l-sm last:rounded-r-sm" :style="{ backgroundColor: color }" />
      </div>
      <span>{{ valueFormat(max) }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useElementWidth } from './useElementWidth'
import { SEQUENTIAL, formatCompact } from '@/lib/chart'

const props = defineProps({
  rows: { type: Array, required: true },
  columns: { type: Array, required: true },
  // values[row][column]
  values: { type: Array, required: true },
  cellHeight: { type: Number, default: 28 },
  valueFormat: { type: Function, default: formatCompact }
})

const { el, width } = useElementWidth()
const active = ref(null)
const margin = { top: 0, right: 0, bottom: 22, left: 56 }

const svgHeight = computed(() => margin.top + props.rows.length * props.cellHeight + margin.bottom)
const cellWidth = computed(() => (width.value - margin.left - margin.right) / props.columns.length)
const min = computed(() => Math.min(...props.values.flat()))
const max = computed(() => Math.max(...props.values.flat()))

function colorFor(value) {
  const t = (value - min.value) / (max.value - min.value || 1)
  return SEQUENTIAL[Math.min(SEQUENTIAL.length - 1, Math.floor(t * SEQUENTIAL.length))]
}

const columnTicks = computed(() => {
  const step = Math.max(1, Math.ceil(props.columns.length / Math.max(2, Math.floor(cellWidth.value * props.columns.length / 48))))
  return props.columns.map((_, i) => i).filter((i) => i % step === 0)
})

const tooltipStyle = computed(() => {
  const px = margin.left + active.value.c * cellWidth.value + cellWidth.value / 2
  const py = margin.top + active.value.r * props.cellHeight
  const flip = px > width.value * 0.6
  return {
    top: `${py + props.cellHeight + 4}px`,
    left: flip ? 'auto' : `${px - 8}px`,
    right: flip ? `${width.value - px - 8}px` : 'auto'
  }
})

const ariaLabel = computed(() => `Heatmap of ${props.rows.length} rows by ${props.columns.length} columns`)
</script>
