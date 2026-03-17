"use strict";
const electron = require("electron");
const path = require("path");
const os = require("os");
let mainWindow = null;
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: true,
    webPreferences: {
      // Preload script để giao tiếp an toàn giữa main và renderer
      preload: path.join(__dirname, "../preload/index.js"),
      // Tắt nodeIntegration vì lý do bảo mật
      nodeIntegration: false,
      // Bật contextIsolation để bảo vệ renderer process
      contextIsolation: true,
      // Sandbox cho bảo mật tối đa
      sandbox: false
    }
  });
  if (process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
function registerIpcHandlers() {
  electron.ipcMain.handle("get-app-version", () => {
    return electron.app.getVersion();
  });
  electron.ipcMain.handle("get-system-info", () => {
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
    };
  });
}
electron.app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
