import { StateCreator } from 'zustand'

import { TUser } from '@/types/user'

import { AuthSlice, AuthState } from './auth.type'

const initialState: AuthState = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
} as AuthState

export const createAuthSlice: StateCreator<AuthSlice, [['zustand/immer', never]], [], AuthSlice> = (set, get) => ({
  ...initialState,
  initialize: (isAuthenticated: boolean, user?: TUser) =>
    set((state) => {
      state.isLoading = true
      state.isAuthenticated = isAuthenticated
      state.user = user
      state.isLoading = false
    }),
  authenticate: (user: TUser) =>
    set((state) => {
      state.isLoading = true
      state.isAuthenticated = true
      state.user = user
      state.isLoading = false
    }),
  unAuthenticate: () =>
    set((state) => {
      state.isLoading = false
      state.isAuthenticated = false
      state.user = null
      state.authData = null
    }),
  setAuthState: ({ user, authData, isAuthenticated, isLoading, userFireBase }) =>
    set((state) => {
      state.isLoading = isLoading ?? state.isLoading
      state.isAuthenticated = isAuthenticated ?? state.isAuthenticated
      state.user = user ?? state.user
      state.userFireBase = userFireBase ?? state.userFireBase
      state.authData = authData ?? state.authData
    }),
  setFirebaseToken: (token) =>
    set((state) => {
      state.firebaseToken = token ?? state.firebaseToken
    }),
  resetAuth: () => set(initialState),
  getFirebaseToken: () => get()?.firebaseToken || null,
})
