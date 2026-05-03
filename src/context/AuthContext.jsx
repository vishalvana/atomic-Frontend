import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authAPI.me()
        .then(res => {
          setUser(res.data)
          // Decode role from JWT
          try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            setRole(payload.role || 'MEMBER')
          } catch {
            setRole('MEMBER')
          }
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password })
    const { token } = res.data
    localStorage.setItem('token', token)
    const me = await authAPI.me()
    setUser(me.data)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setRole(payload.role || 'MEMBER')
    } catch {
      setRole('MEMBER')
    }
    return me.data
  }

  const signup = async (name, email, password) => {
    const res = await authAPI.signup({ name, email, password })
    const { token } = res.data
    localStorage.setItem('token', token)
    const me = await authAPI.me()
    setUser(me.data)
    setRole('MEMBER')
    return me.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setRole(null)
  }

  const isAdmin = role === 'ADMIN'

  return (
    <AuthContext.Provider value={{ user, role, isAdmin, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
