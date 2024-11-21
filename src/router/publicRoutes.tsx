import PrimaryLayout from '@/components/layout/PrimaryLayout'
import configs from '@/config'
import ForgotPassword from '@/views/ForgotPassword'
import Home from '@/views/Home'
import ResetPassword from '@/views/ResetPassword'
import SignIn from '@/views/Signin'
import SignUp from '@/views/Signup'

import GuestGuard from './guard/GuestGuard'

const publicRoutes = [
  {
    element: <GuestGuard />,
    children: [
      {
        path: configs.routes.signIn,
        element: <SignIn />,
      },
      {
        path: configs.routes.signUp,
        element: <SignUp />,
      },
      {
        path: configs.routes.forgotPassword,
        // element: <ForgotPassword />,
        element: <ForgotPassword />,
      },
      {
        path: configs.routes.resetPassword,
        // element: <ForgotPassword />,
        element: <ResetPassword />,
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
    ],
  },

  {
    element: (
      <GuestGuard>
        <PrimaryLayout />
      </GuestGuard>
    ),
    children: [
      {
        path: configs.routes.home,
        element: <Home />,
      },
    ],
  },
]

export default publicRoutes
