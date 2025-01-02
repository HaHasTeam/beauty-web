import { useRoutes } from 'react-router-dom'

import PrimaryLayout from '@/components/layout/PrimaryLayout'
import configs from '@/config'
import About from '@/views/About'
import Contact from '@/views/Contact'
import Forbidden from '@/views/Forbidden'
import Home from '@/views/Home'
import NotFound from '@/views/NotFound'
import ProductDetail from '@/views/ProductDetail'
import RecommendProducts from '@/views/RecommendProducts'
import SearchPage from '@/views/Search'
import ServerError from '@/views/ServerError'

import privateRoutes from './privateRoutes'
import publicRoutes from './publicRoutes'

export default function RouterProvider() {
  return useRoutes([
    ...privateRoutes,
    ...publicRoutes,
    {
      element: <PrimaryLayout />,
      children: [
        {
          path: configs.routes.home,
          element: <Home />,
        },
        {
          path: configs.routes.search,
          element: <SearchPage />,
        },
        {
          path: configs.routes.productDetail,
          element: <ProductDetail />,
        },
        {
          path: configs.routes.recommendProducts,
          element: <RecommendProducts />,
        },
      ],
    },
    {
      element: <PrimaryLayout />,
      children: [
        {
          path: configs.routes.about,
          element: <About />,
        },

        {
          path: configs.routes.contact,
          element: <Contact />,
        },
      ],
    },
    {
      path: configs.routes.serverError,
      element: <ServerError />,
    },
    {
      path: configs.routes.forbidden,
      element: <Forbidden />,
    },
    {
      path: configs.routes.notFound,
      element: <NotFound />,
    },
  ])
}
export const buildResource = (root: string, route: string) => `/${root}/${route}`

export const buildOneWayResource = (root: string) => `/${root}`
