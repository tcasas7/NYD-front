'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export const useAuth = () => {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const check = async () => {
      try {
        const res = await axios.get('https://5d4lf267-3000.brs.devtunnels.ms/auth/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: false,
        })

        setIsAuthenticated(true)
        setRole(res.data.role)
        setUserId(res.data.id)
      } catch {
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    check()
  }, [])

  return { loading, isAuthenticated, role, userId }
}
