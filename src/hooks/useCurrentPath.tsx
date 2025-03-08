import { matchRoutes, useLocation } from 'react-router-dom'

import routes from '@/config/routes'

const mappedRoutes = Object.keys(routes).map((key) => ({
  path: routes[key as keyof typeof routes],
}))

const useCurrentPath = (checkingRoute: string) => {
  const location = useLocation()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [{ route }] = matchRoutes(mappedRoutes, location) as any

  return {
    path: route.path,
    isCurrentPath: route.path === checkingRoute,
  }
}

export default useCurrentPath
