"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api"
axios.defaults.baseURL = API_URL

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      localStorage.setItem("token", token)
    } else {
      delete axios.defaults.headers.common["Authorization"]
      localStorage.removeItem("token")
    }
  }

  // ✅ On reload — restore token & user from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (token) {
      setAuthToken(token)
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [])

  // ✅ Login
  const login = async (email, password) => {
    try {
      setLoading(true)
      const res = await axios.post("/auth/login", { email, password })

      if (res.data.success) {
        const { token, user: userData } = res.data
        setAuthToken(token)
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData)) // ✅ Store user
        toast.success("Login successful!")
        return { success: true }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed")
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  // ✅ Signup
  const signup = async (name, email, password) => {
    try {
      setLoading(true)
      const res = await axios.post("/auth/register", { name, email, password })

      if (res.data.success) {
        const { token, user: userData } = res.data
        setAuthToken(token)
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData)) // ✅ Store user
        toast.success("Account created successfully!")
        return { success: true }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed")
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  // ✅ Logout
  const logout = () => {
    setAuthToken(null)
    setUser(null)
    localStorage.removeItem("user") // ✅ Clear user
    toast.success("Logged out successfully")
  }

  const updateUserStats = (newStats) => {
    setUser((prev) => {
      const updatedUser = { ...prev, ...newStats }
      localStorage.setItem("user", JSON.stringify(updatedUser)) // ✅ Update in storage
      return updatedUser
    })
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUserStats,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
