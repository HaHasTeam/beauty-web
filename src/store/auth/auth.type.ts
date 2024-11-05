import { IAccount } from '@/network/api/model/account'

export type AuthState = {
  isLoading: boolean
  isAuthenticated: boolean
  user?: IAccount | null
}

export type AuthActions = {
  initialize: (isAuthenticated: boolean, user?: IAccount) => void
  authenticate: (user: IAccount) => void
  unAuthenticate: () => void
  resetAuth: () => void
}

export type AuthSlice = AuthState & AuthActions
