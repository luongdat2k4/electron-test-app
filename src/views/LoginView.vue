<script setup lang="ts">
/**
 * LoginView.vue
 * -------------
 * Màn hình đăng nhập với form validation, loading state,
 * error handling, và dark mode support.
 */
import { ref, inject, onMounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Inject dark mode từ App.vue
const isDark = inject<Ref<boolean>>('isDark', ref(false))
const toggleDarkMode = inject<() => void>('toggleDarkMode', () => {})

// Form state
const email = ref('')
const password = ref('')
const showPassword = ref(false)

// Validation errors
const emailError = ref('')
const passwordError = ref('')

// Kiểm tra nếu đã login, redirect về dashboard
onMounted(async () => {
  const isAuth = await authStore.checkAuth()
  if (isAuth) {
    router.push('/dashboard')
  }
})

/**
 * Validate form inputs
 */
function validateForm(): boolean {
  let isValid = true
  emailError.value = ''
  passwordError.value = ''
  authStore.clearError()

  // Validate email
  if (!email.value.trim()) {
    emailError.value = 'Vui lòng nhập email'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Email không hợp lệ'
    isValid = false
  }

  // Validate password
  if (!password.value) {
    passwordError.value = 'Vui lòng nhập mật khẩu'
    isValid = false
  } else if (password.value.length < 6) {
    passwordError.value = 'Mật khẩu phải có ít nhất 6 ký tự'
    isValid = false
  }

  return isValid
}

/**
 * Xử lý đăng nhập
 */
async function handleLogin(): Promise<void> {
  if (!validateForm()) return

  const success = await authStore.login(email.value, password.value)
  if (success) {
    router.push('/dashboard')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
    <!-- Background gradient decoration -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
        :class="isDark ? 'bg-primary-500' : 'bg-primary-300'"
      />
      <div
        class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
        :class="isDark ? 'bg-accent' : 'bg-primary-200'"
      />
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
        :class="isDark ? 'bg-primary-600' : 'bg-primary-100'"
      />
    </div>

    <!-- Dark mode toggle -->
    <button
      id="dark-mode-toggle-login"
      @click="toggleDarkMode"
      class="absolute top-6 right-6 p-3 rounded-xl transition-all duration-300 z-10"
      :class="isDark
        ? 'bg-surface-800/50 text-yellow-400 hover:bg-surface-700/50'
        : 'bg-white/50 text-surface-600 hover:bg-white/80'"
      :title="isDark ? 'Chuyển sang Light Mode' : 'Chuyển sang Dark Mode'"
    >
      <!-- Sun icon -->
      <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <!-- Moon icon -->
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>

    <!-- Login Card -->
    <div
      class="relative w-full max-w-md animate-slide-up"
    >
      <div
        class="rounded-3xl p-8 shadow-2xl border backdrop-blur-xl transition-all duration-300"
        :class="isDark
          ? 'bg-surface-900/70 border-surface-700/30'
          : 'bg-white/70 border-white/30'"
      >
        <!-- Logo & Title -->
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 animate-glow"
            :class="isDark
              ? 'bg-gradient-to-br from-primary-500 to-primary-700'
              : 'bg-gradient-to-br from-primary-400 to-primary-600'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold mb-1">
            <span class="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              Electron Vue App
            </span>
          </h1>
          <p :class="isDark ? 'text-surface-400' : 'text-surface-500'" class="text-sm">
            Đăng nhập để tiếp tục
          </p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Email Field -->
          <div>
            <label
              for="email-input"
              class="block text-sm font-medium mb-1.5"
              :class="isDark ? 'text-surface-300' : 'text-surface-700'"
            >
              Email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="isDark ? 'text-surface-500' : 'text-surface-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                id="email-input"
                v-model="email"
                type="email"
                placeholder="admin@example.com"
                autocomplete="email"
                class="w-full pl-11 pr-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2"
                :class="[
                  emailError
                    ? 'border-danger focus:ring-danger/30'
                    : isDark
                      ? 'bg-surface-800/50 border-surface-700 text-surface-100 placeholder-surface-500 focus:ring-primary-500 focus:border-primary-500'
                      : 'bg-surface-50 border-surface-200 text-surface-900 placeholder-surface-400 focus:ring-primary-400 focus:border-primary-400'
                ]"
                @input="emailError = ''"
              />
            </div>
            <p v-if="emailError" class="mt-1.5 text-sm text-danger flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ emailError }}
            </p>
          </div>

          <!-- Password Field -->
          <div>
            <label
              for="password-input"
              class="block text-sm font-medium mb-1.5"
              :class="isDark ? 'text-surface-300' : 'text-surface-700'"
            >
              Mật khẩu
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="isDark ? 'text-surface-500' : 'text-surface-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password-input"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="current-password"
                class="w-full pl-11 pr-12 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2"
                :class="[
                  passwordError
                    ? 'border-danger focus:ring-danger/30'
                    : isDark
                      ? 'bg-surface-800/50 border-surface-700 text-surface-100 placeholder-surface-500 focus:ring-primary-500 focus:border-primary-500'
                      : 'bg-surface-50 border-surface-200 text-surface-900 placeholder-surface-400 focus:ring-primary-400 focus:border-primary-400'
                ]"
                @input="passwordError = ''"
              />
              <!-- Toggle password visibility -->
              <button
                type="button"
                id="toggle-password-btn"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                :class="isDark ? 'text-surface-500 hover:text-surface-300' : 'text-surface-400 hover:text-surface-600'"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="passwordError" class="mt-1.5 text-sm text-danger flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ passwordError }}
            </p>
          </div>

          <!-- Error message from API -->
          <Transition name="fade">
            <div
              v-if="authStore.error"
              class="flex items-center gap-2 p-3 rounded-xl text-sm bg-danger/10 text-danger border border-danger/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {{ authStore.error }}
            </div>
          </Transition>

          <!-- Submit Button -->
          <button
            id="login-btn"
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full py-3.5 px-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-lg hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
            :class="isDark ? 'focus:ring-offset-surface-900 shadow-primary-500/20' : 'shadow-primary-500/30'"
          >
            <!-- Loading spinner -->
            <svg
              v-if="authStore.isLoading"
              class="w-5 h-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {{ authStore.isLoading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
          </button>
        </form>

        <!-- Demo hint -->
        <div class="mt-6 pt-5 border-t" :class="isDark ? 'border-surface-700/50' : 'border-surface-200'">
          <p class="text-xs text-center" :class="isDark ? 'text-surface-500' : 'text-surface-400'">
            Demo: <span class="font-mono">admin@example.com</span> / <span class="font-mono">password123</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fade transition cho error message */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
