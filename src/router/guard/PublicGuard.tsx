import { useQuery } from '@tanstack/react-query'
import { FC, PropsWithChildren, useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

// import LoadingLayer from '@/components/loading-icon/LoadingLayer'
import { getUserProfileApi } from '@/network/apis/user'
import { useStore } from '@/store/store'
import { TUser } from '@/types/user'

const PublicGuard: FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, setAuthState } = useStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      setAuthState: state.setAuthState,
      isLoading: state.isLoading,
    })),
  )
  const { data: useProfileData, isLoading: isGettingUserProfile } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn,
    enabled: isAuthenticated,
  })

  useEffect(() => {
    // fetch user profile if user is authenticated on first load
    console.log('check Public Guard', useProfileData, isAuthenticated)

    if (isAuthenticated && useProfileData?.data) {
      setAuthState({
        user: useProfileData.data as unknown as TUser,
      })
    }

    if (isAuthenticated) {
      setAuthState({
        isLoading: isGettingUserProfile,
      })
    }
  }, [isAuthenticated, setAuthState, useProfileData, isGettingUserProfile])

  // if (isLoading) return <LoadingLayer />

  return <>{children}</>
}

export default PublicGuard
