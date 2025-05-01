import { FC, PropsWithChildren } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import configs from '@/config'
import { useStore } from '@/store/store'

// GuestGuard is a component that will be used to protect routes
// that should only be accessed by unauthenticated users.
const GuestGuard: FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, isLoading } = useStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
    })),
  )

  if (isLoading) return <LoadingContentLayer />

  if (isAuthenticated) return <Navigate to={configs.routes.home} replace />
  return <>{children || <Outlet />}</>
}

export default GuestGuard
