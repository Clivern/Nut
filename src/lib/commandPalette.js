import { ref } from 'vue'

const open = ref(false)

export const commandPaletteOpen = open

export function openCommandPalette() {
  open.value = true
}

export function closeCommandPalette() {
  open.value = false
}

export function toggleCommandPalette() {
  open.value = !open.value
}

export const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)

export const shortcutLabel = isMac ? '⌘K' : 'Ctrl K'
