import AuthLayout from '@/components/layout/AuthLayout'
import configs from '@/config'
import SignIn from '@/views/Signin'
import SignUp from '@/views/Signup'

import GuestGuard from './guard/GuestGuard'

const publicRoutes = [
  {
    element: (
      <GuestGuard>
        <AuthLayout />
      </GuestGuard>
    ),
    children: [
      {
        path: configs.routes.signIn,
        element: <SignIn />,
      },
    ],
  },
  {
    element: (
      <GuestGuard>
        <AuthLayout />
      </GuestGuard>
    ),
    children: [
      {
        path: configs.routes.signUp,
        element: <SignUp />,
      },
    ],
  },
  {
    path: configs.routes.forgotPassword,
    // element: <ForgotPassword />,
    element: <div className="">ForgotPasswordp</div>,
  },
  {
    path: configs.routes.checkEmail,
    // element: <CheckEmail />,
    element: <div className="">Check mail</div>,
  },
  {
    path: configs.routes.notFound,
    element: <div>Not found</div>,
  },
]

export default publicRoutes
