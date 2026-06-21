import React, { createContext, useContext, useState } from 'react'
import api from '../api/api'
import { connectSocket, disconnectSocket } from '../api/socket'

const AuthContext = createContext(null)

const USER_KEY  = 'ec_user'
const TOKEN_KEY = 'ec_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const _persist = (userData, token) => {
    setUser(userData)
    localStorage.setItem(USER_KEY,  JSON.stringify(userData))
    localStorage.setItem(TOKEN_KEY, token)
  }

  // Admin login
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/admin/login', { email, password })
      _persist(data.user, data.token)
      return { success: true, role: data.user.role }
    } catch {
      return { success: false }
    }
  }

  // Seller login
  const loginSeller = async (email, password) => {
    try {
      const { data } = await api.post('/auth/seller/login', { email, password })
      _persist(data.user, data.token)
      return { success: true }
    } catch {
      return { success: false }
    }
  }

  // Buyer login
  const loginAuction = async (email, password) => {
    try {
      const { data } = await api.post('/auth/member/login', { email, password })
      _persist(data.user, data.token)
      if (data.token) connectSocket(data.token)
      return { success: true }
    } catch {
      return { success: false }
    }
  }

  // Buyer register (step 1 — creates inactive account)
  const registerMember = async (name, email, phone, password) => {
    try {
      const { data } = await api.post('/auth/member/register', { name, email, phone, password })
      _persist(data.user, data.token)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' }
    }
  }

  const logout = () => {
    disconnectSocket()
    setUser(null)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem(USER_KEY, JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, login, loginSeller, loginAuction, registerMember, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
