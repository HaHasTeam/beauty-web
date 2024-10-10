import { useRoutes } from 'react-router-dom'

import About from '@/views/About'
import Home from '@/views/Home'

export default function RouterProvider() {
  return useRoutes([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/about3',
      element: <About />,
    },
  ])
}
