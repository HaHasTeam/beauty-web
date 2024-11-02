import { useRoutes } from 'react-router-dom'

import About from '@/views/About'
import Home from '@/views/Home'
import SignIn from '@/views/Signin'
import SignUp from '@/views/Signup'

export default function RouterProvider() {
  return useRoutes([
    {
      path: '/signin',
      element: <SignIn />,
    },
    {
      path: '/signup',
      element: <SignUp />,
    },
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
