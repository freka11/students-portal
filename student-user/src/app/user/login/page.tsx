'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/Card'
import { Button } from '@/components/admin/Button'
import { useToast } from '@/components/admin/Toast'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase-client'
import { authSessionPost } from '@/lib/api-new'

/* ---------- Local UI Components ---------- */

function Label({
  htmlFor,
  children,
}: {
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700"
    >
      {children}
    </label>
  )
}

function Input({
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-sm
        focus:outline-none  focus:border-black
        disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    />
  )
}

/* ---------- Page ---------- */

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { addToast, ToastContainer } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)

    try {
      // Convert username to email format for Firebase
      const email = username.includes('@') ? username : `${username}@student.com`

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/43ca688c-b42f-4b46-b34a-008376a5d4f5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `log_${Date.now()}_login_attempt`,
          timestamp: Date.now(),
          location: 'src/app/user/login/page.tsx:handleSubmit',
          message: 'Login submit attempt',
          data: {
            usernameLength: username.length,
            emailDerived: email,
          },
          runId: 'pre-fix',
          hypothesisId: 'H2'
        })
      }).catch(() => {})
      // #endregion

      // Use Firebase client-side authentication
      const { signInWithEmailAndPassword } = await import('firebase/auth')
      const { auth } = await import('@/lib/firebase-client')
      
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const token = await userCredential.user.getIdToken()

        // Create/update Firestore user profile (canonical source for chat user discovery)
        await setDoc(
          doc(db, 'users', userCredential.user.uid),
          {
            email: userCredential.user.email || email,
            username,
            name: userCredential.user.displayName || username,
            role: 'student',
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        )

        // Create session via API (non-blocking)
        let sessionData: unknown = null
        try {
          const sessionResponse = await authSessionPost(token)
          if (!sessionResponse.ok) {
            addToast('Session creation failed. Please try again.', 'error')
            return
          }
          sessionData = await sessionResponse.json()
        } catch {
          addToast('Session creation failed. Please try again.', 'error')
          return
        }

        const sessionRecord: Record<string, unknown> | null =
          sessionData && typeof sessionData === 'object'
            ? (sessionData as Record<string, unknown>)
            : null
        const sessionUser =
          sessionRecord?.user && typeof sessionRecord.user === 'object'
            ? (sessionRecord.user as Record<string, unknown>)
            : null

        // Store user data with role
        const userData = {
          id: userCredential.user.uid,
          email: userCredential.user.email,
          name: userCredential.user.displayName || username,
          username: username,
          role: typeof sessionUser?.role === 'string' ? sessionUser.role : 'student',
          permissions: Array.isArray(sessionUser?.permissions) ? sessionUser.permissions : [],
        }

        localStorage.setItem('user', JSON.stringify(userData))
        router.push('/user/dashboard')
        
      } catch (firebaseError: unknown) {
        console.error('Firebase auth error:', firebaseError)

        const errRecord: Record<string, unknown> =
          firebaseError && typeof firebaseError === 'object'
            ? (firebaseError as Record<string, unknown>)
            : {}
        const errCode = typeof errRecord.code === 'string' ? errRecord.code : ''

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/43ca688c-b42f-4b46-b34a-008376a5d4f5', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: `log_${Date.now()}_firebase_error`,
            timestamp: Date.now(),
            location: 'src/app/user/login/page.tsx:handleSubmit',
            message: 'Firebase auth error',
            data: {
              code: typeof errRecord.code === 'string' ? errRecord.code : null,
              name: typeof errRecord.name === 'string' ? errRecord.name : null,
              message: typeof errRecord.message === 'string' ? errRecord.message : null,
            },
            runId: 'pre-fix',
            hypothesisId: 'H3'
          })
        }).catch(() => {})
        // #endregion
        
        // Handle specific Firebase auth errors
        if (errCode === 'auth/user-not-found') {
          addToast('User not found', 'error')
        } else if (errCode === 'auth/wrong-password') {
          addToast('Invalid password', 'error')
        } else if (errCode === 'auth/invalid-email') {
          addToast('Invalid email format', 'error')
        } else if (errCode === 'auth/invalid-credential') {
          addToast('Invalid credential. Check email/password or Firebase config.', 'error')
        } else {
          addToast('Authentication failed', 'error')
        }
      }
      
    } catch {
      addToast('An error occurred. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <ToastContainer />

      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
            User Sign In
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username or email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>

              <div className="text-center text-sm text-gray-700">
                New user?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/user/signup')}
                  className="text-blue-600 hover:underline cursor-pointer"
                  disabled={loading}
                >
                  Sign up
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
