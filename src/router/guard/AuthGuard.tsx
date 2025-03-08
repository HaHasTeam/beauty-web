import { useQuery } from '@tanstack/react-query'
import { FC, PropsWithChildren, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import LoadingLayer from '@/components/loading-icon/LoadingLayer'
import routes from '@/config/routes'
import { getUserProfileApi } from '@/network/apis/user'
import { useStore } from '@/store/store'
import { TUserPa } from '@/types/user'
// AuthGuard is component that will be used to protect routes
// that should only be accessed by authenticated users.
const AuthGuard: FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, isLoading, authData, setAuthState } = useStore(
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
  }, [isAuthenticated, authData, setAuthState, useProfileData, isGettingUserProfile])

  if (!isAuthenticated) return <Navigate to={routes.signIn} replace />

  if (isLoading) return <LoadingLayer />
  return <>{children}</>
}

export default AuthGuard
