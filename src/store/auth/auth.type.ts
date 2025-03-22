import { TAuth } from '@/types'
import { IUser, TUserPa } from '@/types/user'

export type AuthState = {
  isLoading: boolean
  isAuthenticated: boolean
  user?: TUserPa | null
  authData: TAuth | null
  userFireBase?: IUser | null
}

export type AuthActions = {
  initialize: (isAuthenticated: boolean, user?: TUserPa) => void
  authenticate: (user: TUserPa) => void
  unAuthenticate: () => void
  resetAuth: () => void
  setAuthState: (params: Partial<AuthState>) => void
  getFirebaseToken: () => string | null
}

export type AuthSlice = AuthState & AuthActions
