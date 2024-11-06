import { StateCreator } from 'zustand'

import { IAccount } from '@/network/api/model/account'

import { AuthSlice, AuthState } from './auth.type'

const initialState: AuthState = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
}

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
  resetAuth: () => set(initialState),
})
