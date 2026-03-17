/**
 * Electron Main Process
 * ---------------------
 * Đây là entry point của Electron app.
 * Tạo cửa sổ chính (BrowserWindow) và đăng ký IPC handlers.
 */

import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import os from 'os'

// Biến lưu reference đến cửa sổ chính
let mainWindow: BrowserWindow | null = null

/**
 * Tạo cửa sổ chính của ứng dụng
 */
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: true,
    webPreferences: {
      // Preload script để giao tiếp an toàn giữa main và renderer
      preload: join(__dirname, '../preload/index.js'),
      // Tắt nodeIntegration vì lý do bảo mật
      nodeIntegration: false,
      // Bật contextIsolation để bảo vệ renderer process
      contextIsolation: true,
      // Sandbox cho bảo mật tối đa
      sandbox: false
    }
  })

  // Trong môi trường dev, load từ dev server URL
  // electron-vite tự động set biến này
  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    // Mở DevTools trong môi trường dev
    mainWindow.webContents.openDevTools()
  } else {
    // Production: load file HTML đã build
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Cleanup khi cửa sổ đóng
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

/**
 * Đăng ký các IPC handlers
 * IPC (Inter-Process Communication) cho phép renderer process
 * giao tiếp an toàn với main process thông qua preload script.
 */
function registerIpcHandlers(): void {
  // Handler trả về phiên bản app
  ipcMain.handle('get-app-version', () => {
    return app.getVersion()
  })

  // Handler trả về thông tin hệ thống
  ipcMain.handle('get-system-info', () => {
    return {
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      cpus: os.cpus().length,
      totalMemory: `${(os.totalmem() / (1024 * 1024 * 1024)).toFixed(2)} GB`,
      freeMemory: `${(os.freemem() / (1024 * 1024 * 1024)).toFixed(2)} GB`,
      osVersion: os.release(),
      nodeVersion: process.versions.node,
      electronVersion: process.versions.electron
    }
  })
}

// Khi Electron đã sẵn sàng
app.whenReady().then(() => {
  registerIpcHandlers()
  createWindow()

  // macOS: tạo lại cửa sổ khi click vào dock icon
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Thoát app khi tất cả cửa sổ đóng (trừ macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
