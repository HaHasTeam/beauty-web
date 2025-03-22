import { useEffect, useState } from 'react'

import { useStore } from '@/store/store'
import { IUser } from '@/types/user'
import { initializeFirebaseAuth, listenToAuthState } from '@/utils/firebase/auth-service'

export function useAuth() {
  const { isAuthenticated, isLoading, setAuthState } = useStore()
  const [firebaseUser, setFirebaseUser] = useState<IUser | null>(null)
  const [initializing, setInitializing] = useState(true)

  // Initialize Firebase auth with token from Zustand
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isAuthenticated) {
          const userData = await initializeFirebaseAuth()
          setFirebaseUser(userData)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setInitializing(false)
      }
    }

    initAuth()
  }, [isAuthenticated])

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = listenToAuthState((userData) => {
      setFirebaseUser(userData)

      // Update user in Zustand if it exists
      if (userData) {
        setAuthState({ userFireBase: userData })
      }
    })

    return unsubscribe
  }, [setAuthState])

  return {
    isAuthenticated,
    user: firebaseUser,
    isLoading: isLoading || initializing,
  }
}
