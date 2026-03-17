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

export function useAdminUser() {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
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
  })

  const [ready, setReady] = useState(() => {
    try {
      return !!localStorage.getItem('adminUser')
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem('adminUser')
      if (stored) {
        const parsed = JSON.parse(stored)
        
        // Check Firebase auth state
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
          if (firebaseUser) {
            // User is authenticated with Firebase
            setAdmin({
              id: parsed.id,
              email: parsed.email,
              username: parsed.username,
              name: parsed.name,
              firebaseUid: firebaseUser.uid,
              role: parsed.role,
              publicId: parsed.publicId,
              permissions: parsed.permissions,
            })
          } else {
            // User not authenticated with Firebase, but has local storage
            setAdmin({
              id: parsed.id,
              email: parsed.email,
              username: parsed.username,
              name: parsed.name,
              role: parsed.role,
              publicId: parsed.publicId,
              permissions: parsed.permissions,
            })
          }
          setReady(true)
        })

        return () => unsubscribe()
      }

      // No stored user; we are ready (will render login gate downstream).
      setReady(true)
    } catch {
      setTimeout(() => setReady(true), 0)
    }
  }, [])

  return { admin, ready }
}

