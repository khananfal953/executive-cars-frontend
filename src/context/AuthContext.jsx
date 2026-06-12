import React, { createContext, useContext, useState } from 'react'
import { USERS } from '../data/users.js'

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
    const found = USERS[email]
    if (found && found.password === password) {
      const userData = { email, role: found.role, name: found.name }
      setUser(userData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
      return { success: true, role: found.role }
    }
    return { success: false }
  }

  const loginAuction = (email, password) => {
    const found = USERS[email]
    if (found && found.password === password && (found.role === 'buyer' || found.role === 'admin')) {
      const userData = { email, role: found.role, name: found.name }
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

  return (
    <AuthContext.Provider value={{ user, login, loginAuction, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
