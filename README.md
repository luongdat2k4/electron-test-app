# 🖥️ Electron Vue App

> Ứng dụng Desktop hiện đại xây dựng bằng **Electron + Vue 3 + Vite + TypeScript + TailwindCSS**

---

## 📋 Mục lục

1. [Giới thiệu tổng quan](#1--giới-thiệu-tổng-quan)
2. [Các chức năng chính](#2--các-chức-năng-chính)
3. [Hướng dẫn cài đặt và chạy project](#3--hướng-dẫn-cài-đặt-và-chạy-project)
4. [Cấu trúc thư mục project](#4--cấu-trúc-thư-mục-project)
5. [Giải thích chi tiết từng file quan trọng](#5--giải-thích-chi-tiết-từng-file-quan-trọng)
6. [Luồng hoạt động của ứng dụng](#6--luồng-hoạt-động-của-ứng-dụng)
7. [Giải thích cho người mới học](#7--giải-thích-cho-người-mới-học)
8. [Bonus - Mở rộng và đóng gói](#8--bonus---mở-rộng-và-đóng-gói)

---

## 1. 🌟 Giới thiệu tổng quan

### Ứng dụng này là gì?

**Electron Vue App** là một ứng dụng **desktop** (chạy trên Windows, macOS, Linux) được xây dựng bằng công nghệ web. Thay vì chạy trên trình duyệt, ứng dụng này chạy như một phần mềm độc lập trên máy tính của bạn — giống như VS Code, Discord, hay Slack.

Ứng dụng mẫu này bao gồm:
- Trang **đăng nhập** (Login) với giao diện đẹp mắt
- Trang **Dashboard** hiển thị thông tin cá nhân và thông tin hệ thống
- Hỗ trợ **Dark Mode / Light Mode**
- Giao tiếp giữa Electron và Vue thông qua **IPC**

### Công nghệ sử dụng

| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| **Electron** | ^29.1.4 | Đóng gói web app thành ứng dụng desktop |
| **Vue 3** | ^3.4.21 | Framework JavaScript để xây dựng giao diện |
| **Vite** | ^5.1.6 | Build tool siêu nhanh cho development |
| **TypeScript** | ^5.3.3 | Thêm kiểu dữ liệu cho JavaScript, giảm bug |
| **TailwindCSS** | ^3.4.19 | Framework CSS utility-first để style nhanh |
| **Pinia** | ^2.1.7 | Quản lý state (trạng thái) toàn cục cho Vue 3 |
| **Vue Router** | ^4.3.0 | Điều hướng giữa các trang (pages) |
| **electron-vite** | ^2.4.0 | Tích hợp Electron + Vite, hỗ trợ HMR |
| **electron-builder** | ^24.13.3 | Đóng gói app thành file cài đặt (.exe, .dmg, ...) |

### Mục tiêu của ứng dụng

- ✅ Cung cấp **boilerplate** hoàn chỉnh cho việc phát triển ứng dụng desktop
- ✅ Demo luồng **authentication** (đăng nhập, đăng xuất, bảo vệ route)
- ✅ Minh họa cách **Electron giao tiếp với Vue** thông qua IPC
- ✅ Thiết kế giao diện **responsive, đẹp mắt** với TailwindCSS
- ✅ Code sạch, có comment đầy đủ, dễ mở rộng

---

## 2. 🚀 Các chức năng chính

### 2.1. Đăng nhập (Authentication)

Ứng dụng có hệ thống đăng nhập với **Mock API** (API giả lập). Hai tài khoản mẫu có sẵn:

| Email | Password | Role |
|---|---|---|
| `admin@example.com` | `password123` | Administrator |
| `user@example.com` | `password123` | User |

**Tính năng:**
- Validate form (kiểm tra email hợp lệ, password tối thiểu 6 ký tự)
- Hiển thị loading spinner khi đang xử lý
- Thông báo lỗi khi sai tài khoản/mật khẩu
- Lưu token và thông tin user vào `localStorage`

### 2.2. Dashboard

Sau khi đăng nhập thành công, người dùng sẽ được chuyển đến trang Dashboard với:

- **Thông tin cá nhân**: Tên, email, role, avatar (initials)
- **Thông tin hệ thống**: Platform, CPU, RAM, phiên bản OS, Node.js, Electron (lấy từ Electron qua IPC)
- **Dark Mode toggle**: Chuyển đổi giữa giao diện sáng và tối
- **Animation**: Hiệu ứng chuyển trang mượt mà

### 2.3. Logout (Đăng xuất)

- Xóa token và user data khỏi Pinia store
- Xóa dữ liệu trong `localStorage`
- Redirect về trang Login

### 2.4. Routing + Bảo vệ Route

Hệ thống routing sử dụng **Vue Router** với **Navigation Guards**:

- **Route `/login`**: Trang đăng nhập — ai cũng vào được
- **Route `/dashboard`**: Trang chính — **yêu cầu đăng nhập**
- **Guard logic**:
  - Nếu chưa đăng nhập mà vào `/dashboard` → tự động redirect về `/login`
  - Nếu đã đăng nhập mà vào `/login` → tự động redirect về `/dashboard`
  - Mọi URL không hợp lệ → redirect về `/login`

### 2.5. Giao tiếp Electron (IPC)

Ứng dụng sử dụng **IPC (Inter-Process Communication)** để giao tiếp an toàn giữa:
- **Main Process** (Electron, có quyền truy cập OS) ↔ **Renderer Process** (Vue app, chạy trong trình duyệt)

Hai IPC handlers có sẵn:
- `get-app-version`: Lấy phiên bản ứng dụng từ `package.json`
- `get-system-info`: Lấy thông tin hệ thống (CPU, RAM, OS, v.v.)

---

## 3. 📦 Hướng dẫn cài đặt và chạy project

### Bước 1: Cài đặt Node.js

> ⚠️ **Yêu cầu**: Node.js **v18** trở lên (khuyến nghị **v20 LTS**)

1. Truy cập [https://nodejs.org](https://nodejs.org)
2. Tải phiên bản **LTS** (Long Term Support)
3. Cài đặt và kiểm tra:

```bash
# Kiểm tra Node.js đã cài chưa
node --version
# Kết quả mong đợi: v20.x.x hoặc cao hơn

# Kiểm tra npm (cài kèm Node.js)
npm --version
# Kết quả mong đợi: 10.x.x hoặc cao hơn
```

### Bước 2: Clone project

```bash
# Clone project từ repository
git clone <URL-repository-của-bạn>

# Di chuyển vào thư mục project
cd electron
```

Nếu bạn đã có sẵn project, bỏ qua bước này.

### Bước 3: Cài đặt dependencies

```bash
# Cài tất cả packages cần thiết
npm install
```

**Giải thích**: Lệnh này đọc file `package.json`, tải về tất cả thư viện mà project cần (Electron, Vue, TailwindCSS, v.v.) và lưu vào thư mục `node_modules/`.

> 💡 Quá trình cài đặt có thể mất 2-5 phút tùy tốc độ mạng.

### Bước 4: Chạy ứng dụng ở chế độ Development

```bash
npm run dev
```

**Giải thích chi tiết lệnh `npm run dev`:**

1. Gọi script `node scripts/dev.js dev`
2. Script này xóa biến `ELECTRON_RUN_AS_NODE` (tránh lỗi khi chạy trong một số IDE)
3. Sau đó chạy `npx electron-vite dev`, sẽ:
   - Khởi động **Vite dev server** cho Vue app (renderer)
   - Build **main process** và **preload script** của Electron
   - Mở cửa sổ Electron với **DevTools** đã bật
   - Hỗ trợ **HMR** (Hot Module Replacement) — sửa code Vue xong tự động cập nhật, không cần restart

> 🎉 Sau khi chạy thành công, cửa sổ Electron sẽ hiện ra với trang Login!

### Bước 5: Build Production

```bash
npm run build
```

**Giải thích chi tiết lệnh `npm run build`:**

1. Gọi script `node scripts/dev.js build`
2. Script chạy `npx electron-vite build`, sẽ:
   - Build Vue app (renderer) thành các file HTML/CSS/JS tối ưu → `out/renderer/`
   - Build main process TypeScript → `out/main/`
   - Build preload script → `out/preload/`

### Bước 6 (Tùy chọn): Đóng gói thành file cài đặt

```bash
# Đóng gói thành file .exe (Windows), .dmg (macOS), .AppImage (Linux)
npx electron-builder
```

> Xem thêm chi tiết ở [mục Bonus](#8--bonus---mở-rộng-và-đóng-gói).

### Tổng hợp các lệnh

| Lệnh | Mục đích |
|---|---|
| `npm install` | Cài đặt tất cả dependencies |
| `npm run dev` | Chạy app ở chế độ phát triển (có HMR) |
| `npm run build` | Build app cho production |
| `npx electron-builder` | Đóng gói app thành file cài đặt |

---

## 4. 📁 Cấu trúc thư mục project

```
electron-vue-app/
├── electron/                   # 📦 Electron (Main Process)
│   ├── main.ts                 #   → Entry point Electron, tạo cửa sổ
│   └── preload.ts              #   → Cầu nối bảo mật giữa Electron và Vue
│
├── src/                        # 📦 Vue App (Renderer Process)
│   ├── assets/                 #   → Tài nguyên tĩnh
│   │   └── main.css            #     → File CSS chính (import TailwindCSS)
│   ├── router/                 #   → Cấu hình routing
│   │   └── index.ts            #     → Định nghĩa routes + navigation guards
│   ├── services/               #   → Business logic / API calls
│   │   └── auth.ts             #     → Mock API đăng nhập
│   ├── stores/                 #   → Pinia stores (state management)
│   │   └── auth.ts             #     → Quản lý trạng thái authentication
│   ├── views/                  #   → Các trang (pages) của app
│   │   ├── LoginView.vue       #     → Trang đăng nhập
│   │   └── DashboardView.vue   #     → Trang Dashboard
│   ├── App.vue                 #   → Root component, chứa RouterView
│   ├── main.ts                 #   → Entry point Vue, đăng ký plugins
│   └── env.d.ts                #   → TypeScript type declarations
│
├── scripts/                    # 📦 Helper scripts
│   └── dev.js                  #   → Script khởi động dev server
│
├── out/                        # 📦 Thư mục build output (tự động tạo)
│   ├── main/                   #   → Compiled main process
│   ├── preload/                #   → Compiled preload script
│   └── renderer/               #   → Compiled Vue app
│
├── electron.vite.config.ts     # ⚙️ Cấu hình electron-vite (build tool)
├── tailwind.config.js          # ⚙️ Cấu hình TailwindCSS
├── postcss.config.js           # ⚙️ Cấu hình PostCSS (cho TailwindCSS)
├── tsconfig.json               # ⚙️ Cấu hình TypeScript
├── tsconfig.node.json          # ⚙️ TypeScript config cho Node.js files
├── package.json                # ⚙️ Dependencies + scripts + build config
├── index.html                  # 📄 HTML template cho Vue app
└── .gitignore                  # 📄 Files bị ignore bởi Git
```

### Giải thích chi tiết từng thư mục

#### 📂 `/electron` — Electron Main Process

Chứa code chạy ở **main process** của Electron. Đây là phần có quyền truy cập đầy đủ vào hệ điều hành (OS), file system, và các API native.

- **`main.ts`**: Tạo cửa sổ ứng dụng (`BrowserWindow`), đăng ký IPC handlers
- **`preload.ts`**: Script trung gian, expose API an toàn cho Vue app sử dụng

#### 📂 `/src` — Vue App (Renderer Process)

Chứa toàn bộ giao diện người dùng (UI), được viết bằng Vue 3. Đây là phần chạy trong context **trình duyệt** (Chromium), giống như một web app bình thường.

#### 📂 `/src/router` — Vue Router

Quản lý **điều hướng** (navigation) giữa các trang. Định nghĩa URL nào ứng với trang nào, và kiểm tra quyền truy cập (navigation guards).

#### 📂 `/src/stores` — Pinia Stores

Quản lý **state** (trạng thái) toàn cục của ứng dụng. Ví dụ: thông tin user đăng nhập, token, trạng thái loading — tất cả được lưu ở đây và có thể truy cập từ mọi component.

#### 📂 `/src/services` — Services / API

Chứa các hàm **gọi API** hoặc **xử lý business logic**. Tách biệt logic gọi API ra khỏi component để code dễ bảo trì, dễ test, và dễ thay thế API thật sau này.

#### 📂 `/src/views` — Views (Pages)

Chứa các **trang chính** của ứng dụng. Mỗi file `.vue` ở đây tương ứng với một trang mà user có thể truy cập qua URL.

#### 📂 `/scripts` — Helper Scripts

Chứa các script phụ trợ. Hiện tại có `dev.js` để xử lý việc khởi động development server.

#### 📂 `/out` — Build Output

Thư mục này được **tự động tạo** khi bạn chạy `npm run build`. Chứa code đã được compile, sẵn sàng để đóng gói thành file cài đặt.

---

## 5. 📄 Giải thích chi tiết từng file quan trọng

### 5.1. `electron/main.ts` — Electron Main Process

> **Vai trò**: Entry point của Electron. Tạo cửa sổ ứng dụng và đăng ký IPC handlers.

```typescript
// Entry point — file này chạy đầu tiên khi mở app
import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import os from 'os'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,              // Chiều rộng cửa sổ (pixels)
    height: 800,              // Chiều cao cửa sổ
    minWidth: 800,            // Chiều rộng tối thiểu
    minHeight: 600,           // Chiều cao tối thiểu
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),  // Load preload script
      nodeIntegration: false,    // TẮT để bảo mật (renderer không truy cập Node.js)
      contextIsolation: true,    // BẬT để cách ly context
    }
  })

  // Dev: load từ Vite dev server (có HMR)
  // Production: load file HTML đã build
  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    mainWindow.webContents.openDevTools()  // Mở DevTools khi dev
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
```

**Những điều quan trọng:**
- `nodeIntegration: false` + `contextIsolation: true` → bảo mật: Vue app không thể trực tiếp gọi API Node.js
- IPC handlers cho phép Vue app lấy thông tin hệ thống một cách **an toàn** thông qua preload script

---

### 5.2. `electron/preload.ts` — Preload Script (Cầu nối bảo mật)

> **Vai trò**: Cầu nối giữa Electron (Node.js) và Vue (browser). Expose các API an toàn.

```typescript
import { contextBridge, ipcRenderer } from 'electron'

// Tạo object "electronAPI" trên window, Vue app có thể gọi:
//   window.electronAPI.getAppVersion()
//   window.electronAPI.getSystemInfo()
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info')
})
```

**Tại sao cần preload?**
- Vue app chạy trong browser context → **không có quyền** truy cập Node.js, file system, OS, v.v.
- Preload script chạy **trước** Vue app, có quyền dùng `ipcRenderer`
- `contextBridge.exposeInMainWorld` tạo ra API an toàn mà Vue app có thể gọi
- Điều này ngăn chặn Vue app (hoặc code độc) truy cập trực tiếp vào hệ thống

---

### 5.3. `src/App.vue` — Root Component

> **Vai trò**: Component gốc của Vue app. Chứa `RouterView` và quản lý Dark Mode.

```vue
<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'

const isDark = ref(false)

// Khi app load, đọc theme từ localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme === 'dark'
  applyTheme()
})

// Thêm/xóa class "dark" trên <html> để TailwindCSS nhận biết
function applyTheme(): void {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Provide cho tất cả component con có thể dùng
provide('isDark', isDark)
provide('toggleDarkMode', toggleDarkMode)
</script>

<template>
  <!-- RouterView hiển thị trang hiện tại, với transition animation -->
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>
```

**Điểm đáng chú ý:**
- `provide/inject` pattern: Thay vì dùng props, `App.vue` cung cấp `isDark` và `toggleDarkMode` cho **mọi** component con
- `<Transition>`: Animation mượt mà khi chuyển trang (fade + slide)

---

### 5.4. `src/router/index.ts` — Vue Router

> **Vai trò**: Định nghĩa các trang (routes) và bảo vệ route bằng Navigation Guards.

```typescript
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/',           redirect: '/login' },
  { path: '/login',      name: 'Login',     component: () => import('@/views/LoginView.vue'),     meta: { requiresAuth: false } },
  { path: '/dashboard',  name: 'Dashboard', component: () => import('@/views/DashboardView.vue'), meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/login' }  // Catch-all
]

const router = createRouter({
  history: createWebHashHistory(),  // Dùng hash mode cho Electron
  routes
})

// Navigation Guard — chạy TRƯỚC mỗi lần chuyển trang
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('auth_token')
  const isAuthenticated = !!token

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })       // Chưa login → về Login
  } else if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'Dashboard' })   // Đã login → về Dashboard
  } else {
    next()                        // Cho phép truy cập
  }
})
```

**Tại sao dùng `createWebHashHistory`?**
- Electron không có web server để xử lý server-side routing
- Hash history (`/#/login`) hoạt động mà không cần server, phù hợp cho Electron
- Lazy loading: `() => import(...)` giúp chỉ tải component khi người dùng truy cập trang đó

---

### 5.5. `src/stores/auth.ts` — Pinia Auth Store

> **Vai trò**: Quản lý toàn bộ trạng thái authentication — user, token, loading, error.

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi, getUserFromToken } from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)        // Thông tin user hiện tại
  const token = ref(null)       // Auth token
  const isLoading = ref(false)  // Đang xử lý?
  const error = ref(null)       // Thông báo lỗi

  // Getter: kiểm tra đã login chưa
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Action: đăng nhập
  async function login(email, password) {
    isLoading.value = true
    const response = await loginApi(email, password)
    if (response.success) {
      token.value = response.token
      user.value = response.user
      localStorage.setItem('auth_token', response.token)  // Persist
    }
  }

  // Action: đăng xuất
  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  // Action: khôi phục session khi mở app
  async function checkAuth() {
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) {
      const validUser = await getUserFromToken(savedToken)
      if (validUser) {
        token.value = savedToken
        user.value = validUser
      } else {
        logout()  // Token hết hạn
      }
    }
  }
})
```

**Pinia store hoạt động như thế nào?**
- `state` — dữ liệu (giống `data` trong Vue)
- `getters` — derived values (giống `computed`)
- `actions` — hàm thay đổi state (giống `methods`)
- Bất kỳ component nào cũng có thể `useAuthStore()` để đọc/ghi state

---

### 5.6. `src/services/auth.ts` — Auth Service (Mock API)

> **Vai trò**: Giả lập API authentication. Trong production, thay bằng API thật.

```typescript
// 2 tài khoản mẫu
const MOCK_USERS = [
  { email: 'admin@example.com', password: 'password123', user: { id: 1, name: 'Nguyễn Văn Admin', role: 'Administrator' } },
  { email: 'user@example.com',  password: 'password123', user: { id: 2, name: 'Trần Thị User',   role: 'User' } }
]

// Hàm login — giả lập delay 1-2 giây
export async function loginApi(email, password) {
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
  const matched = MOCK_USERS.find(u => u.email === email && u.password === password)
  if (matched) {
    const fakeToken = btoa(JSON.stringify({
      userId: matched.user.id,
      exp: Date.now() + 24 * 60 * 60 * 1000  // Token hết hạn sau 24h
    }))
    return { success: true, token: fakeToken, user: matched.user }
  }
  return { success: false, message: 'Email hoặc mật khẩu không đúng' }
}

// Hàm validate token
export async function getUserFromToken(token) {
  const decoded = JSON.parse(atob(token))
  if (decoded.exp < Date.now()) return null  // Hết hạn
  return MOCK_USERS.find(u => u.user.email === decoded.email)?.user || null
}
```

**Khi chuyển sang API thật**, bạn chỉ cần thay nội dung file này (xem [mục Bonus](#81-thêm-api-thật)).

---

### 5.7. `src/views/LoginView.vue` — Trang đăng nhập

> **Vai trò**: Giao diện đăng nhập với form validation, loading state, và giao diện đẹp.

**Tính năng bao gồm:**
- Form nhập email + password
- Validate input trước khi gửi
- Hiệu ứng loading khi đang xử lý
- Thông báo lỗi khi đăng nhập thất bại
- Button hiển thị/ẩn password
- Dark mode support
- Animation fade-in khi trang load

---

### 5.8. `src/views/DashboardView.vue` — Trang Dashboard

> **Vai trò**: Trang chính sau khi đăng nhập, hiển thị thông tin user và hệ thống.

**Tính năng bao gồm:**
- Avatar với initials (chữ cái viết tắt của tên)
- Thông tin user: tên, email, role
- Thông tin hệ thống từ Electron IPC: platform, CPU, RAM, phiên bản OS/Node/Electron
- Nút toggle Dark/Light mode
- Nút Logout
- Animation slide-up cho các card

---

### 5.9. `electron.vite.config.ts` — Cấu hình Build Tool

> **Vai trò**: Cấu hình electron-vite để build 3 phần: main, preload, renderer.

```typescript
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  // Main Process → build vào out/main/
  main: {
    plugins: [externalizeDepsPlugin()],
    build: { outDir: 'out/main' }
  },
  // Preload Script → build vào out/preload/
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: { outDir: 'out/preload' }
  },
  // Renderer (Vue App) → build vào out/renderer/
  renderer: {
    plugins: [vue()],
    build: { outDir: 'out/renderer' },
    resolve: { alias: { '@': resolve(__dirname, 'src') } }  // @ = src/
  }
})
```

**`externalizeDepsPlugin()`** — không bundle dependencies Node.js vào output (chúng sẽ nằm trong `node_modules`).

**`alias: { '@': 'src/' }`** — cho phép import bằng `@/components/...` thay vì `../../components/...`.

---

### 5.10. `tailwind.config.js` — Cấu hình TailwindCSS

> **Vai trò**: Tùy chỉnh theme, màu sắc, animation cho TailwindCSS.

**Các tùy chỉnh chính:**
- **Dark Mode**: Sử dụng strategy `class` (thêm class `dark` vào `<html>`)
- **Font**: Inter (modern, dễ đọc)
- **Color Palette**:
  - `primary`: Tím Indigo (`#6366f1`) — cho buttons, links
  - `surface`: Slate — cho nền, text
  - `accent`, `success`, `warning`, `danger` — màu phụ
- **Custom Animations**: `fade-in`, `slide-up`, `glow`, `spin-slow`

---

## 6. 🔄 Luồng hoạt động của ứng dụng

### 6.1. Khi mở app

```
App khởi động
    │
    ├─ Electron main process chạy (electron/main.ts)
    │   ├─ Tạo BrowserWindow (cửa sổ 1200x800)
    │   ├─ Đăng ký IPC handlers (get-app-version, get-system-info)
    │   └─ Load Vue app (dev server hoặc file HTML)
    │
    ├─ Preload script chạy (electron/preload.ts)
    │   └─ Expose window.electronAPI cho Vue app
    │
    └─ Vue app khởi động (src/main.ts)
        ├─ Tạo Vue instance
        ├─ Đăng ký Pinia (state management)
        ├─ Đăng ký Router (điều hướng)
        └─ Mount vào <div id="app">
```

### 6.2. Khi chưa login

```
User mở app → Router xử lý URL
    │
    ├─ URL = "/" → Redirect sang "/login"
    ├─ URL = "/login" → Hiển thị LoginView.vue
    ├─ URL = "/dashboard" → Navigation Guard kiểm tra
    │       │
    │       ├─ Kiểm tra localStorage.getItem('auth_token')
    │       ├─ Không có token → isAuthenticated = false
    │       └─ Redirect về "/login" ← BẢO VỆ ROUTE
    │
    └─ URL bất kỳ → Redirect về "/login" (catch-all)
```

### 6.3. Khi login thành công

```
User nhập email + password → Click "Đăng nhập"
    │
    ├─ LoginView gọi authStore.login(email, password)
    │   ├─ isLoading = true → Hiện spinner
    │   ├─ Gọi loginApi(email, password) [services/auth.ts]
    │   │   ├─ Giả lập delay 1-2 giây
    │   │   ├─ So sánh với MOCK_USERS
    │   │   ├─ Tìm thấy → Tạo fake JWT token (base64)
    │   │   └─ Return { success: true, token, user }
    │   │
    │   ├─ Lưu token + user vào Pinia store
    │   ├─ Lưu token + user vào localStorage (persist)
    │   └─ isLoading = false → Ẩn spinner
    │
    └─ LoginView nhận kết quả thành công
        └─ router.push('/dashboard') → Chuyển sang Dashboard
```

### 6.4. Khi vào Dashboard

```
Dashboard mount
    │
    ├─ Hiển thị thông tin từ authStore
    │   ├─ user.name → Tên người dùng
    │   ├─ user.email → Email
    │   ├─ user.role → Vai trò
    │   └─ userInitials → Avatar (ví dụ: "NV" cho "Nguyễn Văn")
    │
    ├─ Gọi window.electronAPI.getSystemInfo()
    │   ├─ Preload chuyển request → Main Process
    │   ├─ Main Process lấy thông tin OS (os module)
    │   └─ Trả về: platform, CPU, RAM, version...
    │
    └─ Hiển thị mọi thứ với animation slide-up
```

### 6.5. Khi logout

```
User click "Đăng xuất"
    │
    ├─ Gọi authStore.logout()
    │   ├─ Xóa token và user trong Pinia store
    │   ├─ localStorage.removeItem('auth_token')
    │   └─ localStorage.removeItem('auth_user')
    │
    └─ router.push('/login')
        └─ Navigation Guard cho phép vì đã logout
            └─ Hiển thị LoginView
```

### 6.6. Token được lưu và sử dụng như thế nào?

```
Token Flow:
═══════════

1. LOGIN THÀNH CÔNG:
   loginApi() tạo token → Pinia store lưu token → localStorage lưu token

2. MỞ LẠI APP:
   checkAuth() đọc token từ localStorage → Validate (kiểm tra hết hạn)
   ├─ Hợp lệ → Khôi phục session (không cần login lại)
   └─ Hết hạn → Xóa token, yêu cầu login lại

3. CHUYỂN TRANG:
   Navigation Guard đọc token từ localStorage
   ├─ Có token → Cho phép truy cập route bảo vệ
   └─ Không có token → Redirect về /login

4. LOGOUT:
   Xóa token khỏi cả Pinia store VÀ localStorage
```

**Cấu trúc token (fake JWT):**
```json
{
  "userId": 1,
  "email": "admin@example.com",
  "exp": 1710000000000    // Thời gian hết hạn (timestamp)
}
```
Token được encode bằng `btoa()` (Base64) và decode bằng `atob()`.

---

## 7. 📚 Giải thích cho người mới học

### 7.1. Electron là gì?

**Electron** là một framework cho phép bạn tạo ứng dụng desktop bằng **HTML, CSS, JavaScript** — các công nghệ web mà bạn đã biết.

**Nói đơn giản**: Electron = Trình duyệt Chrome (Chromium) + Node.js, được đóng gói thành một app.

```
┌────────────────────────────────────────┐
│          Ứng dụng Electron             │
│  ┌──────────────────────────────────┐  │
│  │      Main Process (Node.js)      │  │
│  │  • Truy cập file system          │  │
│  │  • Tạo cửa sổ                    │  │
│  │  • Gọi API hệ điều hành          │  │
│  └──────────────────────────────────┘  │
│              ↕ IPC (giao tiếp)         │
│  ┌──────────────────────────────────┐  │
│  │    Renderer Process (Chromium)    │  │
│  │  • Hiển thị HTML/CSS/JS          │  │
│  │  • Chạy Vue App                  │  │
│  │  • Giống như web browser          │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

**Ví dụ thực tế**: VS Code, Discord, Slack, Figma Desktop — tất cả đều dùng Electron!

---

### 7.2. Vue 3 là gì?

**Vue 3** là một JavaScript framework để xây dựng giao diện web. Nó sử dụng hệ thống **component** — bạn chia giao diện thành các khối nhỏ, mỗi khối là một component.

**Ví dụ đơn giản:**

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)  // Biến reactive — UI tự cập nhật khi giá trị thay đổi
</script>

<template>
  <button @click="count++">
    Bạn đã click {{ count }} lần
  </button>
</template>
```

**Đặc điểm chính:**
- **Reactive**: Thay đổi data → UI tự động cập nhật (không cần DOM manipulation)
- **Component-based**: Chia UI thành các mảnh nhỏ, tái sử dụng được
- **Composition API** (`<script setup>`): Cách tổ chức code logic mới, rõ ràng hơn

---

### 7.3. Pinia dùng để làm gì?

**Vấn đề**: Khi app lớn lên, nhiều component cần **chia sẻ cùng data** (ví dụ: thông tin user đã login). Truyền data qua props giữa nhiều cấp component rất phiền phức.

**Giải pháp**: **Pinia** — một "kho dữ liệu trung tâm" (central store) mà mọi component đều có thể đọc/ghi.

```
                    ┌─────────────┐
                    │  Pinia Store │
                    │  (auth.ts)   │
                    │              │
                    │  user: {...} │
                    │  token: "..."│
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────┴─────┐ ┌───┴────┐ ┌─────┴─────┐
        │ LoginView  │ │ Navbar │ │ Dashboard  │
        │ ghi data   │ │đọc user│ │ đọc user   │
        └────────────┘ └────────┘ └────────────┘
```

**Ví dụ sử dụng:**
```typescript
// Trong bất kỳ component nào
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Đọc data
console.log(authStore.user.name)       // "Nguyễn Văn Admin"
console.log(authStore.isAuthenticated) // true

// Ghi data (gọi action)
await authStore.login('admin@example.com', 'password123')
authStore.logout()
```

---

### 7.4. Router dùng để làm gì?

**Vue Router** quản lý việc **điều hướng** — khi user click link hoặc thay đổi URL, Router quyết định **hiển thị component nào**.

```
URL                    Component hiển thị
──────────────         ─────────────────────
/#/login         →     LoginView.vue
/#/dashboard     →     DashboardView.vue
/#/anything-else →     Redirect về /login
```

**Navigation Guard** — "bảo vệ" (guard) chạy **trước** mỗi lần chuyển trang:

```
User muốn vào /dashboard
        │
        ▼
  ┌─────────────────────┐    Không có token
  │ Navigation Guard     │ ──────────────────→ Redirect về /login
  │ Kiểm tra auth_token │
  └──────────┬──────────┘
             │ Có token
             ▼
     Cho phép vào /dashboard
```

---

### 7.5. IPC là gì?

**IPC** (Inter-Process Communication) là cách **hai tiến trình giao tiếp với nhau**.

Trong Electron, có **2 tiến trình** chạy đồng thời:
- **Main Process**: Có quyền truy cập OS, file system, native API
- **Renderer Process**: Chạy giao diện web (Vue app), **không** có quyền truy cập OS

Vì lý do **bảo mật**, hai tiến trình này không thể truy cập trực tiếp lẫn nhau. IPC là cách giao tiếp an toàn:

```
Vue App (Renderer)                   Electron (Main)
─────────────────                    ───────────────
                                     
getSystemInfo()                      
        │                            
        ▼                            
window.electronAPI                   
.getSystemInfo()                     
        │                            
        ▼                            
  [Preload Script]                   
  ipcRenderer.invoke                 
  ('get-system-info') ──────────────→ ipcMain.handle
                                     ('get-system-info')
                                            │
                                            ▼
                                     os.platform()
                                     os.cpus()
                                     os.totalmem()
                                            │
                        ◄───────────────────┘
                        Return data
        │                            
        ▼                            
  Hiển thị thông tin                 
  hệ thống trên UI                  
```

---

## 8. 🎁 Bonus — Mở rộng và đóng gói

### 8.1. Thêm API thật

Hiện tại app dùng **Mock API** (giả lập). Để kết nối với backend thật, bạn chỉ cần sửa file `src/services/auth.ts`:

**Trước (Mock):**
```typescript
export async function loginApi(email: string, password: string) {
  // Giả lập delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  // So sánh với data cứng
  const matched = MOCK_USERS.find(u => u.email === email && u.password === password)
  // ...
}
```

**Sau (API thật):**
```typescript
// Cài thêm axios: npm install axios
import axios from 'axios'

const API_URL = 'https://your-api.com'

export async function loginApi(email: string, password: string) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    })
    return {
      success: true,
      token: response.data.token,
      user: response.data.user
    }
  } catch (error) {
    return {
      success: false,
      token: '',
      user: {} as User,
      message: error.response?.data?.message || 'Đăng nhập thất bại'
    }
  }
}

export async function getUserFromToken(token: string) {
  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.user
  } catch {
    return null
  }
}
```

> 💡 **Lưu ý**: Bạn chỉ cần sửa file `services/auth.ts`. Các file khác (store, views, router) **không cần thay đổi** vì chúng gọi hàm qua interface giống nhau — đây là lợi ích của việc tách service ra một file riêng!

---

### 8.2. Cách đóng gói app thành .exe

Project đã được cấu hình sẵn **electron-builder** trong `package.json`. Các bước thực hiện:

#### Bước 1: Build project

```bash
npm run build
```

#### Bước 2: Đóng gói

```bash
# Đóng gói cho hệ điều hành hiện tại
npx electron-builder

# Hoặc chỉ định platform
npx electron-builder --win       # Windows (.exe)
npx electron-builder --mac       # macOS (.dmg)
npx electron-builder --linux     # Linux (.AppImage)
```

#### Bước 3: Tìm file output

Sau khi đóng gói, file cài đặt sẽ nằm trong thư mục `release/`:

```
release/
├── ElectronVueApp Setup 1.0.0.exe   # Windows installer
├── win-unpacked/                     # Thư mục app đã giải nén
└── builder-effective-config.yaml     # Config đã dùng
```

**Cấu hình build** (đã có sẵn trong `package.json`):
```json
{
  "build": {
    "appId": "com.electron.vue-app",
    "productName": "ElectronVueApp",
    "files": ["out/**/*"],
    "directories": { "output": "release" },
    "win": { "target": "nsis" },
    "mac": { "target": "dmg" },
    "linux": { "target": "AppImage" }
  }
}
```

**Tùy chỉnh thêm:**
- Thay icon app: Thêm `"icon": "path/to/icon.png"` vào build config
- Thay tên app: Sửa `productName`
- Thay App ID: Sửa `appId` (format: `com.company.app-name`)

---

### 8.3. Thêm trang mới (ví dụ: Settings)

**Bước 1:** Tạo file `src/views/SettingsView.vue`
```vue
<script setup lang="ts">
// Logic cho trang Settings
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold">Cài đặt</h1>
    <!-- Nội dung settings -->
  </div>
</template>
```

**Bước 2:** Thêm route vào `src/router/index.ts`
```typescript
{
  path: '/settings',
  name: 'Settings',
  component: () => import('@/views/SettingsView.vue'),
  meta: { requiresAuth: true }  // Yêu cầu đăng nhập
}
```

**Bước 3:** Thêm link điều hướng trong Dashboard hoặc Navbar

```vue
<router-link to="/settings">Cài đặt</router-link>
```

---

### 8.4. Thêm IPC handler mới (ví dụ: đọc file)

**Bước 1:** Thêm handler trong `electron/main.ts`
```typescript
import { readFileSync } from 'fs'

ipcMain.handle('read-file', (_event, filePath: string) => {
  return readFileSync(filePath, 'utf-8')
})
```

**Bước 2:** Expose trong `electron/preload.ts`
```typescript
contextBridge.exposeInMainWorld('electronAPI', {
  // ... existing APIs
  readFile: (filePath: string): Promise<string> => {
    return ipcRenderer.invoke('read-file', filePath)
  }
})
```

**Bước 3:** Gọi trong Vue component
```typescript
const content = await window.electronAPI.readFile('/path/to/file.txt')
```

---

## 📝 Ghi chú

- **Tài khoản mẫu**: `admin@example.com` / `password123` hoặc `user@example.com` / `password123`
- **Node.js**: Yêu cầu v18+ (khuyến nghị v20 LTS)
- **License**: MIT

---

> 📖 *README này được viết chi tiết dành cho người mới học. Nếu bạn cần hỗ trợ thêm, hãy tạo issue trên repository hoặc liên hệ tác giả.*
