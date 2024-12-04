import AccountLayout from '@/components/layout/AccountLayout'
import PrimaryLayout from '@/components/layout/PrimaryLayout'
import configs from '@/config'
import Cart from '@/views/Cart'
import ChangePassword from '@/views/ChangePassword'
import Checkout from '@/views/Checkout'
import Home from '@/views/Home'
import Profile from '@/views/Profile'
import ProfileAddress from '@/views/ProfileAddress'
import ProfileOrder from '@/views/ProfileOrder'
import ProfileVoucher from '@/views/ProfileVoucher'
import ProfileWishlist from '@/views/ProfileWishlist'

import AuthGuard from './guard/AuthGuard'

const privateRoutes = [
  {
    element: (
      <AuthGuard>
        {/* <MainLayout /> */}
        <PrimaryLayout />
      </AuthGuard>
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
    element: (
      <AuthGuard>
        <PrimaryLayout>
          <AccountLayout />
        </PrimaryLayout>
      </AuthGuard>
    ),
    children: [
      {
        path: configs.routes.profile,
        index: true,
        element: <Profile />,
      },
      {
        path: configs.routes.profileAddress,
        element: <ProfileAddress />,
      },
      {
        path: configs.routes.profileNotification,
        element: <div className=""> profileNotification</div>,
      },
      {
        path: configs.routes.profileOrder,
        element: <ProfileOrder />,
      },

      {
        path: configs.routes.profilePassword,
        element: <ChangePassword />,
      },
      {
        path: configs.routes.profileVoucher,
        element: <ProfileVoucher />,
      },
      {
        path: configs.routes.profileWishlist,
        element: <ProfileWishlist />,
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
