import React, { createContext, useContext, useState } from 'react'
import { validateUser } from '../data/users.js'

const AuthContext = createContext(null)
const STORAGE_KEY = 'ec_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (email, password) => {
    const result = validateUser(email, password)
    if (result) {
      const userData = { email, role: result.role, name: result.name }
      setUser(userData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
      return { success: true, role: result.role }
    }
    return { success: false }
  }

  const loginAuction = (email, password) => {
    const result = validateUser(email, password)
    if (result && (result.role === 'buyer' || result.role === 'admin')) {
      const userData = { email, role: result.role, name: result.name }
      setUser(userData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
      return { success: true }
    }
    return { success: false }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, login, loginAuction, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
