<script setup lang="ts">
/**
 * App.vue - Root Component
 * ------------------------
 * Component gốc chứa RouterView và xử lý dark mode.
 */
import { ref, onMounted } from 'vue'

// State quản lý dark mode
const isDark = ref(false)

// Khởi tạo dark mode từ localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme === 'dark'
  applyTheme()
})

// Áp dụng theme lên document
function applyTheme(): void {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Toggle dark/light mode (provide cho children)
function toggleDarkMode(): void {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  applyTheme()
}

// Provide dark mode state cho toàn bộ app
import { provide } from 'vue'
provide('isDark', isDark)
provide('toggleDarkMode', toggleDarkMode)
</script>

<template>
  <div
    class="min-h-screen transition-colors duration-300"
    :class="isDark ? 'bg-surface-950 text-surface-100' : 'bg-surface-50 text-surface-900'"
  >
    <!-- Router View với transition animation -->
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<style scoped>
/* Page transition animations */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
