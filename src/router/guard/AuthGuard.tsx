import { useMutation, useQuery } from '@tanstack/react-query'
import { FC, PropsWithChildren, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import LoadingLayer from '@/components/loading-icon/LoadingLayer'
import routes from '@/config/routes'
import { createFCMTokenApi } from '@/network/apis/firebase'
import { getUserProfileApi } from '@/network/apis/user'
import { useStore } from '@/store/store'
import { TUserPa } from '@/types/user'
import getBrowserAndOS from '@/utils'
import { getRegistrationToken, onMessageListener } from '@/utils/firebase/cloud'
// AuthGuard is component that will be used to protect routes
// that should only be accessed by authenticated users.
const AuthGuard: FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, isLoading, setAuthState, authData } = useStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      authData: state.authData,
      setAuthState: state.setAuthState,
    })),
  )
  const { data: useProfileData, isLoading: isGettingUserProfile } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn,
  })
  const { mutateAsync: registerUserDevice } = useMutation({
    mutationFn: createFCMTokenApi.fn,
    mutationKey: [createFCMTokenApi.mutationKey],
  })
  useEffect(() => {
    // fetch user profile if user is authenticated on first load
    if (isAuthenticated && useProfileData?.data) {
      setAuthState({
        user: useProfileData.data as unknown as TUserPa,
      })
    }

    if (isAuthenticated) {
      setAuthState({
        isLoading: isGettingUserProfile,
      })
    }
  }, [isAuthenticated, setAuthState, useProfileData, isGettingUserProfile])

  useEffect(() => {
    console.log('authData', authData)

    if (authData?.accessToken) {
      ;(async () => {
        const token = await getRegistrationToken()
        console.log('token', token)

        if (token) {
          const currentToken = localStorage.getItem('fcm_token')
          if (!currentToken || currentToken !== token) {
            const { browser, os } = getBrowserAndOS()
            registerUserDevice({ token, browser, os })
            localStorage.setItem('fcm_token', token)
          }
        }
      })()
    }
  }, [authData, authData?.accessToken, registerUserDevice])

  onMessageListener()
    .then((payload) => {
      console.log('Message received. ', payload)
    })
    .catch((err) => console.log('failed: ', err))

  if (!isAuthenticated) return <Navigate to={routes.signIn} replace />

  if (isLoading) return <LoadingLayer />
  return <>{children}</>
}

export default AuthGuard
