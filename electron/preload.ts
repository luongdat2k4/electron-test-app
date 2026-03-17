/**
 * Electron Preload Script
 * -----------------------
 * Script này chạy trước khi renderer process load.
 * Sử dụng contextBridge để expose API an toàn cho renderer.
 * 
 * Đây là cầu nối duy nhất giữa Node.js (main process) và
 * browser context (renderer process), đảm bảo security.
 */

import { contextBridge, ipcRenderer } from 'electron'

// Định nghĩa interface cho thông tin hệ thống
export interface SystemInfo {
  platform: string
  arch: string
  hostname: string
  cpus: number
  totalMemory: string
  freeMemory: string
  osVersion: string
  nodeVersion: string
  electronVersion: string
}

// Expose API an toàn cho renderer process thông qua window.electronAPI
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Lấy phiên bản ứng dụng
   * @returns Promise<string> - Phiên bản app từ package.json
   */
  getAppVersion: (): Promise<string> => {
    return ipcRenderer.invoke('get-app-version')
  },

  /**
   * Lấy thông tin hệ thống
   * @returns Promise<SystemInfo> - Thông tin OS, CPU, RAM, etc.
   */
  getSystemInfo: (): Promise<SystemInfo> => {
    return ipcRenderer.invoke('get-system-info')
  }
})
