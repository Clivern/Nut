<template>
  <Teleport to="body">
    <Transition name="palette">
      <div
        v-if="open"
        class="fixed inset-0 z-[60] overflow-y-auto"
        @mousedown.self="close"
      >
        <div class="fixed inset-0 bg-black/40" aria-hidden="true" @mousedown="close"></div>

        <div class="relative mx-auto mt-[12vh] w-full max-w-xl px-4">
          <div
            class="palette-panel overflow-hidden rounded-lg border border-theme-border bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div class="flex items-center gap-3 border-b border-theme-border px-4">
              <svg class="h-5 w-5 shrink-0 text-theme-textLight" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
              </svg>
              <input
                ref="inputRef"
                v-model="query"
                type="text"
                class="h-12 w-full bg-transparent text-sm text-theme-text placeholder:text-theme-textLight focus:outline-none"
                placeholder="Search pages, actions, workspaces, traces…"
                role="combobox"
                aria-expanded="true"
                aria-controls="command-palette-results"
                :aria-activedescendant="activeItem ? `command-item-${activeIndex}` : undefined"
                autocomplete="off"
                spellcheck="false"
                @keydown="onInputKeydown"
              />
              <kbd class="palette-kbd">Esc</kbd>
            </div>

            <ul
              v-if="flatItems.length"
              id="command-palette-results"
              ref="listRef"
              class="max-h-[60vh] overflow-y-auto py-2"
              role="listbox"
            >
              <template v-for="group in groups" :key="group.name">
                <li class="px-4 pb-1 pt-3 text-xs font-medium uppercase tracking-wide text-theme-textLight first:pt-1" role="presentation">
                  {{ group.name }}
                </li>
                <li
                  v-for="item in group.items"
                  :id="`command-item-${item.index}`"
                  :key="item.id"
                  :data-index="item.index"
                  class="mx-2 flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-sm"
                  :class="item.index === activeIndex ? 'bg-theme-hover text-theme-text' : 'text-theme-text'"
                  role="option"
                  :aria-selected="item.index === activeIndex"
                  @mousemove="activeIndex = item.index"
                  @click="runItem(item)"
                >
                  <span class="flex min-w-0 items-center gap-3">
                    <span
                      v-if="item.swatch"
                      class="h-4 w-4 shrink-0 rounded-full border border-theme-border"
                      :style="{ background: item.swatch }"
                      aria-hidden="true"
                    />
                    <span class="truncate" :class="{ 'font-mono text-xs': item.mono }">{{ item.label }}</span>
                  </span>
                  <span class="shrink-0 text-xs text-theme-textLight">{{ item.hint }}</span>
                </li>
              </template>
            </ul>

            <p v-else class="px-4 py-10 text-center text-sm text-theme-textLight">
              No results for “{{ query }}”
            </p>

            <div class="flex items-center gap-4 border-t border-theme-border px-4 py-2 text-xs text-theme-textLight">
              <span class="flex items-center gap-1"><kbd class="palette-kbd">↑</kbd><kbd class="palette-kbd">↓</kbd> navigate</span>
              <span class="flex items-center gap-1"><kbd class="palette-kbd">↵</kbd> open</span>
              <span class="ml-auto flex items-center gap-1"><kbd class="palette-kbd">{{ shortcutLabel }}</kbd> toggle</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useWorkspaceStore } from '@/stores/workspace'
import { THEMES, applyTheme, readStoredTheme } from '@/lib/preferences'
import { showFlash } from '@/lib/flash'
import { getTraces } from '@/lib/telemetry'
import { formatDuration } from '@/lib/chart'
import {
  commandPaletteOpen as open,
  closeCommandPalette,
  toggleCommandPalette,
  openCommandPalette,
  shortcutLabel,
} from '@/lib/commandPalette'

const router = useRouter()
const authStore = useAuthStore()
const workspaceStore = useWorkspaceStore()

const query = ref('')
const normalizedQuery = computed(() => query.value.trim().toLowerCase())
const activeIndex = ref(0)
const inputRef = ref(null)
const listRef = ref(null)
const currentTheme = ref(readStoredTheme())
let previousFocus = null

const PAGES = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard', keywords: 'overview stats activity' },
  { to: '/form', label: 'Form', keywords: 'inputs fields' },
  { to: '/cards', label: 'Cards', keywords: 'stat alert flash' },
  { to: '/charts', label: 'Charts', keywords: 'graph line bar heatmap scatter' },
  { to: '/metrics', label: 'Metrics', keywords: 'latency throughput errors' },
  { to: '/traces', label: 'Traces', keywords: 'spans tracing waterfall' },
  { to: '/modals', label: 'Modals', keywords: 'dialog' },
  { to: '/users', label: 'Users', keywords: 'members people team' },
  { to: '/calendar', label: 'Calendar', keywords: 'events schedule' },
  { to: '/themes', label: 'Themes', keywords: 'appearance colors dark' },
  { to: '/copilot', label: 'Copilot', keywords: 'chat ai assistant' },
  { to: '/profile', label: 'Profile', keywords: 'account settings password' },
  { to: '/subscription', label: 'Subscription', keywords: 'billing plan invoices' },
  { to: '/select-workspace', label: 'Select Workspace' },
  { to: '/create-workspace', label: 'Create Workspace', keywords: 'new' },
  { to: '/navigation', label: 'Navigation' },
  { to: '/empty', label: 'Empty Page', keywords: 'blank state' },
  { to: '/terms', label: 'Terms of Use', keywords: 'legal' },
  { to: '/privacy', label: 'Privacy Policy', keywords: 'legal' },
]

// Higher is better; 0 means no match.
function score(text, q) {
  const t = text.toLowerCase()
  if (t.startsWith(q)) return 4
  if (t.split(/[\s/_.-]+/).some((word) => word.startsWith(q))) return 3
  if (t.includes(q)) return 2
  let i = 0
  for (const ch of t) {
    if (ch === q[i]) i++
    if (i === q.length) return 1
  }
  return 0
}

function rank(items, q, limit = Infinity) {
  if (!q) return items.slice(0, limit)
  return items
    .map((item) => ({ item, s: Math.max(score(item.label, q), item.keywords ? score(item.keywords, q) * 0.9 : 0) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((r) => ({ ...r.item, score: r.s }))
}

const pageItems = computed(() =>
  PAGES.map((page) => ({
    id: `page:${page.to}`,
    label: page.label,
    keywords: page.keywords,
    hint: page.to,
    run: () => router.push(page.to),
  }))
)

const actionItems = computed(() => [
  {
    id: 'action:create-workspace',
    label: 'Create workspace',
    keywords: 'new add',
    run: () => router.push('/create-workspace'),
  },
  {
    id: 'action:add-gateway',
    label: 'Add gateway',
    keywords: 'new create',
    run: () => showFlash('Gateway added'),
  },
  {
    id: 'action:logout',
    label: 'Log out',
    keywords: 'sign out exit',
    run: () => {
      authStore.logout()
      router.push('/login')
    },
  },
])

const themeItems = computed(() =>
  THEMES.map((theme) => ({
    id: `theme:${theme.id}`,
    label: `Switch to ${theme.label} theme`,
    keywords: `theme appearance ${theme.id}`,
    hint: currentTheme.value === theme.id ? 'Current' : '',
    swatch: theme.swatch,
    run: () => {
      currentTheme.value = applyTheme(theme.id)
      showFlash(`Theme set to ${theme.id}`)
    },
  }))
)

const workspaceItems = computed(() =>
  workspaceStore.workspaces.value.map((workspace) => ({
    id: `workspace:${workspace.id}`,
    label: workspace.name,
    keywords: 'workspace switch',
    hint: workspaceStore.current.value?.id === workspace.id ? 'Current' : 'Switch',
    run: () => {
      workspaceStore.select(workspace)
      showFlash(`Switched to ${workspace.name}`)
    },
  }))
)

const traceItems = computed(() => {
  const q = normalizedQuery.value
  if (q.length < 2) return []
  return getTraces()
    .filter((trace) => trace.id.startsWith(q) || trace.operation.toLowerCase().includes(q))
    .slice(0, 5)
    .map((trace) => ({
      id: `trace:${trace.id}`,
      label: `${trace.operation} · ${trace.id.slice(0, 12)}`,
      hint: `${formatDuration(trace.duration)} · ${trace.status}`,
      mono: true,
      run: () => router.push(`/traces/${trace.id}`),
      score: trace.id.startsWith(q) ? 4 : 2,
    }))
})

const groups = computed(() => {
  const q = normalizedQuery.value
  const result = [
    { name: 'Pages', items: rank(pageItems.value, q, q ? 8 : PAGES.length) },
    { name: 'Actions', items: rank(actionItems.value, q) },
    { name: 'Themes', items: rank(themeItems.value, q) },
    { name: 'Workspaces', items: rank(workspaceItems.value, q, 5) },
    { name: 'Traces', items: traceItems.value },
  ].filter((group) => group.items.length)

  // With a query, lead with the group holding the best match so Enter picks it.
  if (q) {
    const best = (group) => Math.max(...group.items.map((item) => item.score))
    result.sort((a, b) => best(b) - best(a))
  }

  let index = 0
  return result.map((group) => ({
    ...group,
    items: group.items.map((item) => ({ ...item, index: index++ })),
  }))
})

const flatItems = computed(() => groups.value.flatMap((group) => group.items))
const activeItem = computed(() => flatItems.value[activeIndex.value])

watch(normalizedQuery, () => {
  activeIndex.value = 0
})

watch(activeIndex, async (index) => {
  await nextTick()
  listRef.value?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: 'nearest' })
})

watch(open, async (isOpen) => {
  if (isOpen) {
    previousFocus = document.activeElement
    query.value = ''
    activeIndex.value = 0
    currentTheme.value = readStoredTheme()
    await nextTick()
    inputRef.value?.focus()
  } else if (previousFocus instanceof HTMLElement) {
    previousFocus.focus()
    previousFocus = null
  }
})

function close() {
  closeCommandPalette()
}

function runItem(item) {
  close()
  item.run()
}

function onInputKeydown(event) {
  const count = flatItems.value.length
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (count) activeIndex.value = (activeIndex.value + 1) % count
      break
    case 'ArrowUp':
      event.preventDefault()
      if (count) activeIndex.value = (activeIndex.value - 1 + count) % count
      break
    case 'Enter':
      event.preventDefault()
      if (activeItem.value) runItem(activeItem.value)
      break
    case 'Escape':
      event.preventDefault()
      close()
      break
    case 'Tab':
      // Keep focus inside the dialog.
      event.preventDefault()
      break
  }
}

function isTypingTarget(target) {
  return target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
}

function onGlobalKeydown(event) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    toggleCommandPalette()
  } else if (event.key === '/' && !open.value && !isTypingTarget(event.target)) {
    event.preventDefault()
    openCommandPalette()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
})
</script>

<style scoped>
.palette-kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  border: 1px solid var(--theme-border);
  border-radius: 0.25rem;
  padding: 0 0.3rem;
  font-family: inherit;
  font-size: 0.6875rem;
  line-height: 1.125rem;
  color: var(--theme-textLight);
}

.palette-enter-active,
.palette-leave-active {
  transition: opacity 0.15s ease;
}

.palette-enter-active .palette-panel,
.palette-leave-active .palette-panel {
  transition: transform 0.15s ease;
}

.palette-enter-from,
.palette-leave-to {
  opacity: 0;
}

.palette-enter-from .palette-panel,
.palette-leave-to .palette-panel {
  transform: scale(0.98);
}
</style>
