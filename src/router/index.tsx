import { useRoutes } from 'react-router-dom'

import PrimaryLayout from '@/components/layout/PrimaryLayout'
import About from '@/views/About'
import Contact from '@/views/Contact'
import Forbidden from '@/views/Forbidden'
import Home from '@/views/Home'
import NotFound from '@/views/NotFound'
import ServerError from '@/views/ServerError'
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
      element: <PrimaryLayout />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
      ],
    },
    {
      element: <PrimaryLayout />,
      children: [
        {
          path: '/about',
          element: <About />,
        },
        {
          path: '/contact',
          element: <Contact />,
        },
      ],
    },
    {
      path: '/server-error',
      element: <ServerError />,
    },
    {
      path: '/forbidden',
      element: <Forbidden />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ])
}
