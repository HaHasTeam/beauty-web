import { FC, PropsWithChildren } from 'react'
import { useShallow } from 'zustand/react/shallow'

import LoadingIcon from '@/components/Loading'
import { useStore } from '@/store/store'
import Home from '@/views/Home'

// GuestGuard is a component that will be used to protect routes
// that should only be accessed by unauthenticated users.
const GuestGuard: FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, isLoading } = useStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
    })),
  )

  if (isLoading) return <LoadingIcon />

  // if (!isAuthenticated) return <Navigate to={configs.routes.home} replace />
  if (!isAuthenticated) return <Home />
  return <>{children}</>
}

export default GuestGuard
