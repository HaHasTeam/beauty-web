import MainLayout from '@/components/layout/MainLayout'
import configs from '@/config'
import Home from '@/views/Home'

import AuthGuard from './guard/AuthGuard'

const privateRoutes = [
  {
    element: (
      // <VerifiedEmailGuard>
      <AuthGuard>
        <MainLayout />
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
