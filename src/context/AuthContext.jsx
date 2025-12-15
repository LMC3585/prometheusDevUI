/**
 * Auth Context - Authentication State Management
 * 
 * Provides:
 * - User state
 * - Login/logout methods
 * - Auth status
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authService.getStoredUser()
        if (storedUser && authService.isAuthenticated()) {
          // Validate token with server
          const isValid = await authService.validateToken()
          if (isValid) {
            setUser(storedUser)
            setIsAuthenticated(true)
          }
        }
      } catch (err) {
        console.error('Auth init error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  // Listen for auth expiration events
  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null)
      setIsAuthenticated(false)
      setError('Session expired. Please login again.')
    }

    window.addEventListener('auth:expired', handleAuthExpired)
    return () => window.removeEventListener('auth:expired', handleAuthExpired)
  }, [])

  /**
   * Login user
   */
  const login = useCallback(async (email, password) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await authService.login({ email, password })
      setUser(response.user)
      setIsAuthenticated(true)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Register new user
   */
  const register = useCallback(async (email, password, name) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await authService.register({ email, password, name })
      setUser(response.user)
      setIsAuthenticated(true)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    setIsLoading(true)
    
    try {
      await authService.logout()
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)
    }
  }, [])

  /**
   * Update user data
   */
  const updateUser = useCallback((userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }, [])

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
