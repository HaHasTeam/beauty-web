import { IAccount } from '@/network/api/model/account'
import { TAuth } from '@/types'

export type AuthState = {
  isLoading: boolean
  isAuthenticated: boolean
  user?: IAccount | null
  authData: TAuth
}

export type AuthActions = {
  initialize: (isAuthenticated: boolean, user?: IAccount) => void
  authenticate: (user: IAccount) => void
  unAuthenticate: () => void
  resetAuth: () => void
  setAuthState: (params: Partial<AuthState>) => void
}

export type AuthSlice = AuthState & AuthActions
