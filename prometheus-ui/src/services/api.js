const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const TokenManager = {
  getToken: () => localStorage.getItem('auth_token'),
  setToken: (token) => localStorage.setItem('auth_token', token),
  clearToken: () => localStorage.removeItem('auth_token')
}

export const UserManager = {
  getUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  clearUser: () => localStorage.removeItem('user')
}

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

async function apiFetch(endpoint, options = {}) {
  const token = TokenManager.getToken()
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config)
    if (response.status === 401) {
      TokenManager.clearToken()
      UserManager.clearUser()
      window.dispatchEvent(new CustomEvent('auth:expired'))
      throw new ApiError('Session expired', 401)
    }
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new ApiError(data.message || 'Request failed', response.status, data)
    }
    return data
  } catch (err) {
    if (err instanceof ApiError) throw err
    throw new ApiError(err.message || 'Network error', 0)
  }
}

export const api = {
  get: (endpoint) => apiFetch(endpoint, { method: 'GET' }),
  post: (endpoint, data) => apiFetch(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => apiFetch(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  patch: (endpoint, data) => apiFetch(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (endpoint) => apiFetch(endpoint, { method: 'DELETE' })
}

export default api
