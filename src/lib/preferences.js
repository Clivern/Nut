export const USER_THEME_DEFAULT = 'default'
export const USER_THEME_BLUE = 'blue'
export const USER_THEME_SLATE = 'slate'
export const USER_THEME_EMERALD = 'emerald'
export const USER_THEME_DARK = 'dark'

const THEME_CLASS_MAP = {
  [USER_THEME_BLUE]: 'theme-blue',
  [USER_THEME_SLATE]: 'theme-slate',
  [USER_THEME_EMERALD]: 'theme-emerald',
  [USER_THEME_DARK]: 'theme-dark',
}

const VALID_THEMES = new Set([
  USER_THEME_DEFAULT,
  USER_THEME_BLUE,
  USER_THEME_SLATE,
  USER_THEME_EMERALD,
  USER_THEME_DARK,
])

export const THEMES = [
  { id: USER_THEME_DEFAULT, label: 'Default', swatch: '#37352F' },
  { id: USER_THEME_BLUE, label: 'Blue', swatch: '#20808d' },
  { id: USER_THEME_SLATE, label: 'Slate', swatch: '#334155' },
  { id: USER_THEME_EMERALD, label: 'Emerald', swatch: '#059669' },
  { id: USER_THEME_DARK, label: 'Dark', swatch: '#111827' },
]

export function applyTheme(name) {
  const root = document.documentElement
  Object.values(THEME_CLASS_MAP).forEach((className) => {
    root.classList.remove(className)
  })
  const themeClass = THEME_CLASS_MAP[name]
  if (themeClass) {
    root.classList.add(themeClass)
  }
  localStorage.setItem('_ftheme', name)
  return name
}

export function readStoredTheme() {
  const stored = localStorage.getItem('_ftheme')
  if (stored && VALID_THEMES.has(stored)) return stored
  return USER_THEME_DEFAULT
}
