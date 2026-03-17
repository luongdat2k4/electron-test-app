/**
 * Type Declarations
 * -----------------
 * Khai báo kiểu cho Vue SFC và Electron API
 */

/// <reference types="vite/client" />

// Cho phép TypeScript nhận diện file .vue
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Định nghĩa interface cho Electron API (từ preload script)
interface ElectronAPI {
  /** Lấy phiên bản ứng dụng */
  getAppVersion: () => Promise<string>
  /** Lấy thông tin hệ thống */
  getSystemInfo: () => Promise<{
    platform: string
    arch: string
    hostname: string
    cpus: number
    totalMemory: string
    freeMemory: string
    osVersion: string
    nodeVersion: string
    electronVersion: string
  }>
}

// Mở rộng Window interface để thêm electronAPI
declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}
