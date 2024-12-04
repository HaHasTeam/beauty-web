import { StateCreator } from 'zustand'

import { IAccount } from '@/network/api/model/account'

import { AuthSlice, AuthState } from './auth.type'

const initialState: AuthState = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
} as AuthState

export const createAuthSlice: StateCreator<AuthSlice, [['zustand/immer', never]], [], AuthSlice> = (set) => ({
  ...initialState,
  initialize: (isAuthenticated: boolean, user?: IAccount) =>
    set((state) => {
      state.isLoading = true
      state.isAuthenticated = isAuthenticated
      state.user = user
      state.isLoading = false
    }),
  authenticate: (user: IAccount) =>
    set((state) => {
      state.isLoading = true
      state.isAuthenticated = true
      state.user = user
      state.isLoading = false
    }),
  unAuthenticate: () =>
    set((state) => {
      state.isAuthenticated = false
      state.user = null
    }),
  setAuthState: ({ user, authData, isAuthenticated, isLoading }) =>
    set((state) => {
      state.isLoading = isLoading ?? state.isLoading
      state.isAuthenticated = isAuthenticated ?? state.isAuthenticated
      state.user = user ?? state.user
      state.authData = authData ?? state.authData
    }),
  resetAuth: () => set(initialState),
})
