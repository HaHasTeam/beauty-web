import { FC, PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import LoadingIcon from '@/components/Loading'
import configs from '@/config'
import { useStore } from '@/store/store'
// AuthGuard is component that will be used to protect routes
// that should only be accessed by authenticated users.
const AuthGuard: FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, isLoading } = useStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
    })),
  )

  if (isLoading) return <LoadingIcon />

  if (!isAuthenticated) return <Navigate to={configs.routes.signIn} replace />

  return <>{children}</>
}

export default AuthGuard
