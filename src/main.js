import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { applyTheme, readStoredTheme } from './lib/preferences'
import './style.css'

applyTheme(readStoredTheme())

createApp(App).use(router).mount('#app')
