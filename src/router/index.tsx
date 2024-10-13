import Home from '@/views/Home'
import { useRoutes } from 'react-router-dom'

import About from '@/views/About'

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
  ])
}
