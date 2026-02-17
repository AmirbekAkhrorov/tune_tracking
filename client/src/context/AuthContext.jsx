import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  // Refresh user data from server on mount so avatar_url etc. are always fresh
  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) return
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${t}` } })
      .then(r => {
        if (!r.ok) {
          // Token expired or invalid — clear it so user is redirected to login
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setToken(null)
          setUser(null)
          return null
        }
        return r.json()
      })
      .then(data => {
        if (data) {
          localStorage.setItem('user', JSON.stringify(data))
          setUser(data)
        }
      })
      .catch(() => {})
  }, [])

  const login = (tokenValue, userData) => {
    localStorage.setItem('token', tokenValue)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(tokenValue)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
