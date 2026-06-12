import React, { createContext, useContext, useState } from 'react'
import { USERS } from '../data/users.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (email, password) => {
    const found = USERS[email]
    if (found && found.password === password) {
      setUser({ email, role: found.role, name: found.name })
      return { success: true, role: found.role }
    }
    return { success: false }
  }

  const loginAuction = (email, password) => {
    const found = USERS[email]
    if (found && found.password === password && (found.role === 'buyer' || found.role === 'admin')) {
      setUser({ email, role: found.role, name: found.name })
      return { success: true }
    }
    return { success: false }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, loginAuction, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
