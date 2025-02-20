import PrimaryLayout from '@/components/layout/PrimaryLayout'
import configs from '@/config'
import Cart from '@/views/Cart'
import EmailVerification from '@/views/EmailVerifycation'
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
        element: <ForgotPassword />,
      },
      {
        path: configs.routes.resetPassword,
        element: <ResetPassword />,
      },
      {
        path: configs.routes.notFound,
        element: <div>Not found</div>,
      },
    ],
  },
  {
    path: configs.routes.checkEmail,
    element: <EmailVerification />,
  },
  {
    element: <PrimaryLayout />,
    children: [
      {
        path: configs.routes.home,
        element: <Home />,
      },
      {
        path: configs.routes.cart,
        element: <Cart />,
      },
    ],
  },
]

export default publicRoutes
