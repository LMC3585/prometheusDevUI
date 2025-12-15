import api from './api'

const authService = {
  register: async (email, password, name) => {
    return api.post('/auth/register', { email, password, name })
  },

  login: async (email, password) => {
    return api.post('/auth/login', { email, password })
  },

  logout: async () => {
    return api.post('/auth/logout', {})
  },

  getMe: async () => {
    return api.get('/auth/me')
  },

  updatePreferences: async (preferences) => {
    return api.put('/auth/preferences', preferences)
  },

  changePassword: async (currentPassword, newPassword) => {
    return api.post('/auth/change-password', { currentPassword, newPassword })
  },

  validateToken: async () => {
    return api.get('/auth/validate')
  }
}

export default authService
