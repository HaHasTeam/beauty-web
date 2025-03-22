'use client'

import { useEffect, useState } from 'react'

import { IUser } from '@/types/user'
import { listenToAuthState, signInWithToken, signOut } from '@/utils/firebase/auth-service'

export function useCustomAuth() {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = listenToAuthState((user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithCustomToken = async (token: string) => {
    try {
      const user = await signInWithToken(token)
      return user
    } catch (error) {
      console.error('Error signing in with custom token:', error)
      throw error
    }
  }

  const signOutUser = async () => {
    try {
      await signOut()
      setCurrentUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  return {
    currentUser,
    loading,
    signInWithCustomToken,
    signOut: signOutUser,
  }
}
