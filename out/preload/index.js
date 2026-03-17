"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  /**
   * Lấy phiên bản ứng dụng
   * @returns Promise<string> - Phiên bản app từ package.json
   */
  getAppVersion: () => {
    return electron.ipcRenderer.invoke("get-app-version");
  },
  /**
   * Lấy thông tin hệ thống
   * @returns Promise<SystemInfo> - Thông tin OS, CPU, RAM, etc.
   */
  getSystemInfo: () => {
    return electron.ipcRenderer.invoke("get-system-info");
  }
});
