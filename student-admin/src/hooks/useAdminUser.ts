'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase-client'

export interface AdminUser {
  id: string
  name: string
  email?: string
  username?: string
  firebaseUid?: string
  role?: 'admin' | 'teacher' | 'super_admin'
  publicId?: string
  permissions?: string[]
}

function parseAdminUserFromStorage(): AdminUser | null {
  try {
    const stored = localStorage.getItem('adminUser')
    if (!stored) return null
    const parsed = JSON.parse(stored) as Record<string, unknown>

    if (typeof parsed.id !== 'string' || typeof parsed.name !== 'string') return null

    return {
      id: parsed.id,
      name: parsed.name,
      email: typeof parsed.email === 'string' ? parsed.email : undefined,
      username: typeof parsed.username === 'string' ? parsed.username : undefined,
      role:
        parsed.role === 'admin' || parsed.role === 'teacher' || parsed.role === 'super_admin'
          ? parsed.role
          : undefined,
      publicId: typeof parsed.publicId === 'string' ? parsed.publicId : undefined,
      permissions: Array.isArray(parsed.permissions)
        ? parsed.permissions.filter((p): p is string => typeof p === 'string')
        : undefined,
    }
  } catch {
    return null
  }
}

export function useAdminUser() {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true

    const loadAdmin = () => {
      if (!active) return

      const parsedAdmin = parseAdminUserFromStorage()
      setAdmin(parsedAdmin)
      setReady(true)
    }

    loadAdmin()

    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (!active) return

      const storedAdmin = parseAdminUserFromStorage()
      if (storedAdmin) {
        setAdmin(
          firebaseUser
            ? {
                ...storedAdmin,
                firebaseUid: firebaseUser.uid,
              }
            : storedAdmin
        )
      } else {
        setAdmin(null)
      }

      setReady(true)
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  return { admin, ready }
}

