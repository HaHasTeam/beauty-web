import { useRoutes } from 'react-router-dom'

import About from '@/views/About'
import Contact from '@/views/Contact'
import Forbidden from '@/views/Forbidden'
import Home from '@/views/Home'
import NotFound from '@/views/NotFound'
import ServerError from '@/views/ServerError'

export default function RouterProvider() {
  return useRoutes([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/about',
      element: <About />,
    },
    {
      path: '/contact',
      element: <Contact />,
    },
    {
      path: '/not-found',
      element: <NotFound />,
    },
    {
      path: '/server-error',
      element: <ServerError />,
    },
    {
      path: '/forbidden',
      element: <Forbidden />,
    },
  ])
}
