/**
 * Vue App Entry Point
 * -------------------
 * Khởi tạo Vue app, đăng ký Router và Pinia store.
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import TailwindCSS styles
import './assets/main.css'

// Tạo Vue app instance
const app = createApp(App)

// Đăng ký Pinia (State Management)
app.use(createPinia())

// Đăng ký Vue Router
app.use(router)

// Mount app vào DOM
app.mount('#app')
