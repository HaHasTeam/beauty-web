import {
  onAuthStateChanged,
  signInWithCustomToken,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import { useStore } from '@/store/store'
import { IUser } from '@/types/user'

import { auth } from './auth'
import { db } from './firestore'

// Function to handle custom token sign-in
export const signInWithToken = async (token: string): Promise<IUser | null> => {
  try {
    // Sign in with the token
    const userCredential = await signInWithCustomToken(auth, token)
    const firebaseUser = userCredential.user

    // Get user data from Firestore
    const userData = await getUserData(firebaseUser)
    return userData
  } catch (error) {
    console.error('Error signing in with custom token:', error)
    throw error
  }
}

// Function to get user data from Firestore
export const getUserData = async (firebaseUser: FirebaseUser): Promise<IUser | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))

    if (userDoc.exists()) {
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: userDoc.data().displayName,
        role: userDoc.data().role,
        brandId: userDoc.data().brandId,
      }
    }
    return null
  } catch (error) {
    console.error('Error getting user data:', error)
    return null
  }
}

// Function to sign out
export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth)
  // Reset auth state in Zustand
  useStore.getState().unAuthenticate()
}

// Function to listen to auth state changes
export const listenToAuthState = (callback: (user: IUser | null) => void): (() => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userData = await getUserData(firebaseUser)
      callback(userData)
    } else {
      callback(null)
    }
  })
}

// Function to initialize Firebase auth with token from Zustand
export const initializeFirebaseAuth = async (): Promise<IUser | null> => {
  const firebaseToken = useStore.getState().getFirebaseToken()

  if (firebaseToken) {
    try {
      return await signInWithToken(firebaseToken)
    } catch (error) {
      console.error('Error initializing Firebase auth:', error)
      useStore.getState().unAuthenticate()
      return null
    }
  }
  return null
}
