import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiService } from '../../api/client'
import type { User, RegisterRequest, ChangePasswordRequest } from '@simpleblog/shared'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  changePassword: (data: ChangePasswordRequest) => Promise<void>
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('authToken')
    if (token) {
      // Validate token and get user info
      checkAuthStatus()
    } else {
      setLoading(false)
    }
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await apiService.getProfile()
      if (response) {
        setUser(response)
      } else {
        // Token is invalid, clear it
        apiService.clearToken()
      }
    } catch (error) {
      // Token is invalid, clear it
      apiService.clearToken()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password })
      if (response.user) {
        setUser(response.user)
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Login failed')
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      const response = await apiService.register(data)
      if (response.user) {
        setUser(response.user)
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Registration failed')
    }
  }

  const logout = async () => {
    try {
      // Call logout endpoint to invalidate token on server
      await apiService.logout()
    } catch (error) {
      // Even if server logout fails, clear local state
      console.warn('Server logout failed:', error)
    } finally {
      setUser(null)
    }
  }

  const changePassword = async (data: ChangePasswordRequest) => {
    try {
      await apiService.changePassword(data)
    } catch (error) {
      throw error instanceof Error ? error : new Error('Password change failed')
    }
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    changePassword,
    isAuthenticated: !!user,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}