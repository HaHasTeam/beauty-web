import { TAuth } from '@/types'
import { IUser, TUser } from '@/types/user'

export type AuthState = {
  isLoading: boolean
  isAuthenticated: boolean
  user?: TUser | null
  authData: TAuth | null
  userFireBase?: IUser | null
  firebaseToken: string | null
}

export type AuthActions = {
  initialize: (isAuthenticated: boolean, user?: TUser) => void
  authenticate: (user: TUser) => void
  unAuthenticate: () => void
  resetAuth: () => void
  setAuthState: (params: Partial<AuthState>) => void
  setFirebaseToken: (token: string) => void

  getFirebaseToken: () => string | null
}

export type AuthSlice = AuthState & AuthActions
