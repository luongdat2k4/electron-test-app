/**
 * Vue Router Configuration
 * ------------------------
 * Định nghĩa routes và navigation guards cho authentication.
 */

import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Định nghĩa routes
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    // Catch-all: redirect về login
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

// Tạo router instance
// Sử dụng hash history vì Electron không có server-side routing
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

/**
 * Navigation Guard - Kiểm tra authentication
 * - Nếu route yêu cầu auth mà chưa login → redirect về /login
 * - Nếu đã login mà vào /login → redirect về /dashboard
 */
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('auth_token')
  const isAuthenticated = !!token

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Chưa đăng nhập, redirect về login
    next({ name: 'Login' })
  } else if (to.name === 'Login' && isAuthenticated) {
    // Đã đăng nhập, redirect về dashboard
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
