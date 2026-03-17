/**
 * Auth Store (Pinia)
 * ------------------
 * Quản lý trạng thái authentication toàn bộ ứng dụng.
 * Sử dụng Pinia với Composition API style.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi, getUserFromToken } from '@/services/auth'
import type { User } from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  // ===== State =====
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ===== Getters =====
  /** Kiểm tra đã đăng nhập chưa */
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  /** Lấy tên viết tắt (initials) cho avatar */
  const userInitials = computed(() => {
    if (!user.value?.name) return '?'
    return user.value.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })

  // ===== Actions =====

  /**
   * Đăng nhập với email và password
   */
  async function login(email: string, password: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response = await loginApi(email, password)

      if (response.success) {
        // Lưu token và user data
        token.value = response.token
        user.value = response.user

        // Persist vào localStorage
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('auth_user', JSON.stringify(response.user))

        return true
      } else {
        error.value = response.message || 'Đăng nhập thất bại'
        return false
      }
    } catch (err) {
      error.value = 'Có lỗi xảy ra. Vui lòng thử lại.'
      console.error('Login error:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Đăng xuất - xóa token và user data
   */
  function logout(): void {
    token.value = null
    user.value = null
    error.value = null

    // Xóa khỏi localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  /**
   * Kiểm tra và khôi phục session từ localStorage
   * Gọi khi app khởi động
   */
  async function checkAuth(): Promise<boolean> {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')

    if (savedToken && savedUser) {
      // Validate token (kiểm tra hết hạn)
      const validUser = await getUserFromToken(savedToken)

      if (validUser) {
        token.value = savedToken
        user.value = validUser
        return true
      } else {
        // Token hết hạn, xóa session
        logout()
        return false
      }
    }

    return false
  }

  /**
   * Xóa error message
   */
  function clearError(): void {
    error.value = null
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    userInitials,
    // Actions
    login,
    logout,
    checkAuth,
    clearError
  }
})
