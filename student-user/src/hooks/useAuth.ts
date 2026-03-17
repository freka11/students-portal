import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase-client'

interface User {
  uid: string
  email: string
  role: string
  permissions?: string[]
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // Get the ID token to check custom claims
        firebaseUser.getIdTokenResult().then((idTokenResult) => {
          const claims = idTokenResult.claims as unknown
          const record: Record<string, unknown> =
            claims && typeof claims === 'object' ? (claims as Record<string, unknown>) : {}
          const role = typeof record.role === 'string' ? record.role : 'student'
          const permissions = Array.isArray(record.permissions)
            ? record.permissions.filter((p): p is string => typeof p === 'string')
            : []
          const userData: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            role,
            permissions,
          }
          setUser(userData)
          setLoading(false)
        })
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  return { user, loading }
}
