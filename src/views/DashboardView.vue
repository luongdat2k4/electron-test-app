<script setup lang="ts">
/**
 * DashboardView.vue
 * -----------------
 * Trang dashboard sau khi đăng nhập thành công.
 * Hiển thị thông tin user, system info từ Electron IPC,
 * và dark mode toggle.
 */
import { ref, inject, onMounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Inject dark mode
const isDark = inject<Ref<boolean>>('isDark', ref(false))
const toggleDarkMode = inject<() => void>('toggleDarkMode', () => {})

// Electron IPC data
const appVersion = ref('N/A')
const systemInfo = ref<Record<string, string | number> | null>(null)
const showSystemInfo = ref(false)

// Greeting dựa theo thời gian
const greeting = ref('')

onMounted(async () => {
  // Kiểm tra auth
  await authStore.checkAuth()
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // Tính greeting
  const hour = new Date().getHours()
  if (hour < 12) greeting.value = 'Chào buổi sáng'
  else if (hour < 18) greeting.value = 'Chào buổi chiều'
  else greeting.value = 'Chào buổi tối'

  // Lấy thông tin từ Electron IPC (nếu có)
  try {
    if (window.electronAPI) {
      appVersion.value = await window.electronAPI.getAppVersion()
      systemInfo.value = await window.electronAPI.getSystemInfo() as unknown as Record<string, string | number>
    }
  } catch (err) {
    console.warn('Electron API not available:', err)
  }
})

/**
 * Xử lý đăng xuất
 */
function handleLogout(): void {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen relative">
    <!-- Background decorations -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-15 blur-3xl"
        :class="isDark ? 'bg-primary-500' : 'bg-primary-300'"
      />
      <div
        class="absolute bottom-0 -left-20 w-60 h-60 rounded-full opacity-15 blur-3xl"
        :class="isDark ? 'bg-accent' : 'bg-primary-200'"
      />
    </div>

    <!-- Top Navigation Bar -->
    <nav
      class="sticky top-0 z-10 backdrop-blur-xl border-b transition-colors duration-300"
      :class="isDark
        ? 'bg-surface-900/80 border-surface-700/50'
        : 'bg-white/80 border-surface-200/60'"
    >
      <div class="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <!-- App logo + name -->
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="font-bold text-lg bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
            Electron Vue
          </span>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center gap-2">
          <!-- App version badge -->
          <span
            class="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium"
            :class="isDark ? 'bg-surface-800 text-surface-400' : 'bg-surface-100 text-surface-500'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            v{{ appVersion }}
          </span>

          <!-- Dark mode toggle -->
          <button
            id="dark-mode-toggle-dashboard"
            @click="toggleDarkMode"
            class="p-2 rounded-xl transition-all duration-200"
            :class="isDark
              ? 'text-yellow-400 hover:bg-surface-800'
              : 'text-surface-500 hover:bg-surface-100'"
            :title="isDark ? 'Light Mode' : 'Dark Mode'"
          >
            <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Logout button -->
          <button
            id="logout-btn"
            @click="handleLogout"
            class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            :class="isDark
              ? 'text-surface-400 hover:text-danger hover:bg-danger/10'
              : 'text-surface-500 hover:text-danger hover:bg-danger/5'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Đăng xuất
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-6 py-8 relative">
      <!-- Welcome Section -->
      <div class="mb-8 animate-fade-in">
        <h1 class="text-3xl font-bold mb-2">
          {{ greeting }}, 
          <span class="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
            {{ authStore.user?.name }}
          </span>
          👋
        </h1>
        <p :class="isDark ? 'text-surface-400' : 'text-surface-500'">
          Chào mừng bạn trở lại! Đây là bảng điều khiển của bạn.
        </p>
      </div>

      <!-- Dashboard Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <!-- Profile Card -->
        <div
          class="col-span-1 md:col-span-2 lg:col-span-1 rounded-2xl p-6 border backdrop-blur-xl animate-slide-up transition-all duration-300"
          :class="isDark
            ? 'bg-surface-900/60 border-surface-700/30'
            : 'bg-white/70 border-white/40 shadow-lg'"
        >
          <h2
            class="text-sm font-semibold uppercase tracking-wider mb-5 flex items-center gap-2"
            :class="isDark ? 'text-surface-400' : 'text-surface-500'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Thông tin cá nhân
          </h2>

          <div class="flex flex-col items-center text-center">
            <!-- Avatar -->
            <div
              class="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl mb-4 animate-glow"
            >
              {{ authStore.userInitials }}
            </div>

            <!-- User Info -->
            <h3 class="text-xl font-bold mb-1">{{ authStore.user?.name }}</h3>
            <p :class="isDark ? 'text-surface-400' : 'text-surface-500'" class="text-sm mb-3">
              {{ authStore.user?.email }}
            </p>

            <!-- Role badge -->
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              :class="isDark
                ? 'bg-primary-500/15 text-primary-400'
                : 'bg-primary-50 text-primary-600'"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              {{ authStore.user?.role }}
            </span>
          </div>
        </div>

        <!-- Quick Stats Card -->
        <div
          class="rounded-2xl p-6 border backdrop-blur-xl animate-slide-up transition-all duration-300"
          :class="isDark
            ? 'bg-surface-900/60 border-surface-700/30'
            : 'bg-white/70 border-white/40 shadow-lg'"
          style="animation-delay: 0.1s"
        >
          <h2
            class="text-sm font-semibold uppercase tracking-wider mb-5 flex items-center gap-2"
            :class="isDark ? 'text-surface-400' : 'text-surface-500'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Thống kê nhanh
          </h2>

          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 rounded-xl" :class="isDark ? 'bg-surface-800/50' : 'bg-surface-50'">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <span class="text-sm font-medium">Dự án</span>
              </div>
              <span class="text-2xl font-bold text-primary-500">12</span>
            </div>

            <div class="flex items-center justify-between p-3 rounded-xl" :class="isDark ? 'bg-surface-800/50' : 'bg-surface-50'">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span class="text-sm font-medium">Hoàn thành</span>
              </div>
              <span class="text-2xl font-bold text-success">8</span>
            </div>

            <div class="flex items-center justify-between p-3 rounded-xl" :class="isDark ? 'bg-surface-800/50' : 'bg-surface-50'">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span class="text-sm font-medium">Đang xử lý</span>
              </div>
              <span class="text-2xl font-bold text-warning">4</span>
            </div>
          </div>
        </div>

        <!-- System Info Card (Electron IPC) -->
        <div
          class="rounded-2xl p-6 border backdrop-blur-xl animate-slide-up transition-all duration-300"
          :class="isDark
            ? 'bg-surface-900/60 border-surface-700/30'
            : 'bg-white/70 border-white/40 shadow-lg'"
          style="animation-delay: 0.2s"
        >
          <div class="flex items-center justify-between mb-5">
            <h2
              class="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
              :class="isDark ? 'text-surface-400' : 'text-surface-500'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              Thông tin hệ thống
            </h2>
            <button
              id="toggle-system-info-btn"
              @click="showSystemInfo = !showSystemInfo"
              class="text-xs font-medium px-2 py-1 rounded-lg transition-colors"
              :class="isDark
                ? 'text-primary-400 hover:bg-primary-500/10'
                : 'text-primary-600 hover:bg-primary-50'"
            >
              {{ showSystemInfo ? 'Ẩn' : 'Chi tiết' }}
            </button>
          </div>

          <!-- System info via Electron IPC -->
          <div v-if="systemInfo" class="space-y-2.5">
            <div
              v-for="(value, key) in (showSystemInfo
                ? systemInfo
                : { platform: systemInfo.platform, arch: systemInfo.arch, hostname: systemInfo.hostname })"
              :key="key"
              class="flex items-center justify-between py-2 px-3 rounded-xl text-sm"
              :class="isDark ? 'bg-surface-800/50' : 'bg-surface-50'"
            >
              <span :class="isDark ? 'text-surface-400' : 'text-surface-500'" class="capitalize">
                {{ key }}
              </span>
              <span class="font-mono font-medium text-xs">{{ value }}</span>
            </div>
          </div>

          <!-- Fallback khi không có Electron API -->
          <div v-else class="text-center py-6">
            <div
              class="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
              :class="isDark ? 'bg-surface-800' : 'bg-surface-100'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" :class="isDark ? 'text-surface-500' : 'text-surface-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-sm" :class="isDark ? 'text-surface-500' : 'text-surface-400'">
              Electron API chưa khả dụng.<br>
              Chạy trong Electron desktop để xem.
            </p>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="mt-12 text-center">
        <p class="text-xs" :class="isDark ? 'text-surface-600' : 'text-surface-400'">
          Built with ❤️ using Electron + Vue 3 + Vite + TailwindCSS
        </p>
      </div>
    </main>
  </div>
</template>
