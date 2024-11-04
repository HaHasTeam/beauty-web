const privateRoutes = [
  {
    element: (
      <VerifiedEmailGuard>
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      </VerifiedEmailGuard>
    ),
    children: [
      {
        path: configs.routes.home,
        index: true,
        element: <Navigate to={configs.routes.messages} />,
      },
      {
        path: configs.routes.messages,
        element: <Messages />,
      },
    ],
  },

  {
    path: configs.routes.notVerifyEmail,
    element: (
      <AuthGuard>
        <NotVerifyEmail />
      </AuthGuard>
    ),
  },
  {
    path: configs.routes.notFound,
    element: <NotFound />,
  },
]
export default privateRoutes
