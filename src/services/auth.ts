/**
 * Auth Service - Mock API
 * -----------------------
 * Service giả lập API authentication.
 * Trong production, thay thế bằng API thật.
 */

// Interface cho user data
export interface User {
  id: number
  name: string
  email: string
  avatar: string
  role: string
}

// Interface cho login response
export interface LoginResponse {
  success: boolean
  token: string
  user: User
  message?: string
}

// Mock user data
const MOCK_USERS: Array<{ email: string; password: string; user: User }> = [
  {
    email: 'admin@example.com',
    password: 'password123',
    user: {
      id: 1,
      name: 'Nguyễn Văn Admin',
      email: 'admin@example.com',
      avatar: '',  // Sẽ dùng initials fallback
      role: 'Administrator'
    }
  },
  {
    email: 'user@example.com',
    password: 'password123',
    user: {
      id: 2,
      name: 'Trần Thị User',
      email: 'user@example.com',
      avatar: '',
      role: 'User'
    }
  }
]

/**
 * Giả lập API đăng nhập
 * @param email - Email đăng nhập
 * @param password - Mật khẩu
 * @returns Promise<LoginResponse>
 * 
 * Mock accounts:
 *   - admin@example.com / password123
 *   - user@example.com / password123
 */
export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  // Giả lập network delay (1-2 giây)
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

  // Tìm user phù hợp
  const matchedUser = MOCK_USERS.find(
    u => u.email === email && u.password === password
  )

  if (matchedUser) {
    // Tạo fake JWT token
    const fakeToken = btoa(JSON.stringify({
      userId: matchedUser.user.id,
      email: matchedUser.user.email,
      exp: Date.now() + 24 * 60 * 60 * 1000 // Hết hạn sau 24h
    }))

    return {
      success: true,
      token: fakeToken,
      user: matchedUser.user
    }
  }

  // Đăng nhập thất bại
  return {
    success: false,
    token: '',
    user: {} as User,
    message: 'Email hoặc mật khẩu không đúng'
  }
}

/**
 * Giả lập API lấy thông tin user từ token
 * @param token - Auth token
 * @returns Promise<User | null>
 */
export async function getUserFromToken(token: string): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 300))

  try {
    const decoded = JSON.parse(atob(token))
    
    // Kiểm tra token hết hạn
    if (decoded.exp < Date.now()) {
      return null
    }

    const matchedUser = MOCK_USERS.find(u => u.user.email === decoded.email)
    return matchedUser?.user || null
  } catch {
    return null
  }
}
