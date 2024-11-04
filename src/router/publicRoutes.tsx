import GuestGuard from './guard/GuestGuard'

const publicRoutes = [
  {
    element: (
      <GuestGuard>
        <AuthLayout title="Sign In" description="Welcome back, you’ve been missed!" />
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
        <AuthLayout title="Getting Started" description="Create an account to continue and connect with the people." />
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
    element: <ForgotPassword />,
  },
  {
    path: configs.routes.checkEmail,
    element: <CheckEmail />,
  },
  {
    path: configs.routes.notFound,
    element: <NotFound />,
  },
]

export default publicRoutes
