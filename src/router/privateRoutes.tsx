import AccountLayout from '@/components/layout/AccountLayout'
import PrimaryLayout from '@/components/layout/PrimaryLayout'
import configs from '@/config'
import Cart from '@/views/Cart'
import ChangePassword from '@/views/ChangePassword'
import ChatPage from '@/views/ChatPage/ChatPage'
import Checkout from '@/views/Checkout'
import CheckoutResult from '@/views/CheckoutResult'
import NotificationsPage from '@/views/Notification'
import OrderDetail from '@/views/OrderDetail'
import Profile from '@/views/Profile'
import ProfileAddress from '@/views/ProfileAddress'
import ProfileFeedback from '@/views/ProfileFeedback'
import ProfileOrder from '@/views/ProfileOrder'
import ProfileVoucher from '@/views/ProfileVoucher'
import Report from '@/views/report-v2'
import Wallet from '@/views/Wallet'

import AuthGuard from './guard/AuthGuard'

const privateRoutes = [
  {
    element: (
      <AuthGuard>
        <PrimaryLayout />
      </AuthGuard>
    ),
    children: [
      // {
      //   path: configs.routes.home,
      //   index: true,
      //   element: <Home />,
      // },
      {
        path: configs.routes.cart,
        element: <Cart />,
      },

      {
        path: configs.routes.checkout,
        element: <Checkout />,
      },
      {
        path: configs.routes.checkoutResult,
        element: <CheckoutResult />,
      },
    ],
  },
  {
    path: '/chat/:id',
    element: <ChatPage />,
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
        element: <NotificationsPage />,
      },
      {
        path: configs.routes.profileOrder, // user order history
        element: <ProfileOrder />,
      },

      {
        path: configs.routes.profileOrderDetail, // user order history detail
        element: <OrderDetail />,
      },
      {
        path: configs.routes.profilePassword,
        element: <ChangePassword />,
      },
      {
        path: configs.routes.profileWallet,
        element: <Wallet />,
      },
      {
        path: configs.routes.profileReport,
        element: <Report />,
      },
      {
        path: configs.routes.profileVoucher,
        element: <ProfileVoucher />,
      },
      {
        path: configs.routes.profileFeedback,
        element: <ProfileFeedback />,
      },
    ],
  },
]
export default privateRoutes
