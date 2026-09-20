# Nut Style Guide

A reusable dashboard kit for Vue 3. Nut is the design system behind newer product dashboards (Ziee, Cognit, and similar apps): CSS variable themes, a compact user menu, flash toasts, empty states, and cookie consent.

## Features

- Vue 3 + Vite 8 + Tailwind CSS 4
- Themes: default, blue, slate, emerald, dark
- Auth screens, workspace select and create, dashboard, forms, cards, modals, users, calendar
- Flash notices, empty states, and a cookie consent banner
- Inter, token-based colors, and components that follow the active theme

## Quick Start

Node.js 20+ and npm.

```bash
npm install
npm run dev
```

App: `http://localhost:5173`

```bash
npm run build
npm run preview
```

## Themes

Pick a theme on `/themes` or in Profile. The class is stored in `localStorage` (`_ftheme`) and applied on `<html>` before first paint.

## License

MIT
