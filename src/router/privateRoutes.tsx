import PrimaryLayout from '@/components/layout/PrimaryLayout'
import configs from '@/config'
import Cart from '@/views/Cart'
import Checkout from '@/views/Checkout'
import Home from '@/views/Home'

import AuthGuard from './guard/AuthGuard'

const privateRoutes = [
  {
    element: (
      // <VerifiedEmailGuard>
      <AuthGuard>
        {/* <MainLayout /> */}
        <PrimaryLayout />
      </AuthGuard>
      // </VerifiedEmailGuard>
    ),
    children: [
      {
        path: configs.routes.home,
        index: true,
        element: <Home />,
      },
      {
        path: configs.routes.cart,
        element: <Cart />,
      },
      {
        path: configs.routes.checkout,
        element: <Checkout />,
      },
      {
        path: configs.routes.messages,
        element: <div>message page</div>,
      },
    ],
  },

  {
    path: configs.routes.notVerifyEmail,
    element: (
      <AuthGuard>
        <div>Not verify email</div>
      </AuthGuard>
    ),
  },
  {
    path: configs.routes.notFound,
    element: <div className="">not found section</div>,
  },
]
export default privateRoutes
