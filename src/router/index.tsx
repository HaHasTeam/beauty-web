import { useRoutes } from 'react-router-dom'

import PrimaryLayout from '@/components/layout/PrimaryLayout'
import configs from '@/config'
import externalLink from '@/config/externalLink'
import About from '@/views/About'
import BeautyConsultation from '@/views/BeautyConsultation'
import ServiceDetail from '@/views/BeautyConsultation/ServiceDetail'
import Blog from '@/views/Blog'
import BlogDetail from '@/views/BlogDetails'
import BookingDetail from '@/views/BookingDetail'
import BrandDetail from '@/views/Brand'
import Contact from '@/views/Contact'
import Forbidden from '@/views/Forbidden'
import GroupBuy from '@/views/GroupBuy'
import GroupBuyDetails from '@/views/GroupBuy/GroupBuyDetail'
import GroupBuyingOfBrand from '@/views/GroupBuy/GroupBuyingOfBrand'
import Home from '@/views/Home'
import NotFound from '@/views/NotFound'
import ProductDetail from '@/views/ProductDetail'
import RecommendProducts from '@/views/RecommendProducts'
// import RecommendProducts from '@/views/RecommendProducts'
import SearchPage from '@/views/Search'
import SearchBrand from '@/views/SearchBrand'
import ServerError from '@/views/ServerError'
import ServiceCheckout from '@/views/ServiceCheckout'

import PublicGuard from './guard/PublicGuard'
import privateRoutes from './privateRoutes'
import publicRoutes from './publicRoutes'

export default function RouterProvider() {
  return useRoutes([
    ...privateRoutes,
    ...publicRoutes,
    {
      element: (
        <PublicGuard>
          <PrimaryLayout />
        </PublicGuard>
      ),
      children: [
        {
          path: configs.routes.home,
          element: <Home />,
        },
        {
          path: configs.routes.blogs,
          element: <Blog />,
        },
        {
          path: configs.routes.search,
          element: <SearchPage />,
        },
        {
          path: configs.routes.searchBrand,
          element: <SearchBrand />,
        },
        {
          path: configs.routes.productDetail,
          element: <ProductDetail />,
        },
        {
          path: configs.routes.blogDetail,
          element: <BlogDetail />,
        },
        {
          path: configs.routes.groupBuy,
          element: <GroupBuy />,
        },
        {
          path: configs.routes.groupBuyByBrand,
          element: <GroupBuyingOfBrand />,
        },
        {
          path: configs.routes.groupBuyDetail,
          element: <GroupBuyDetails />,
        },
        {
          path: configs.routes.brandDetail,
          element: <BrandDetail />,
        },
        {
          path: configs.routes.recommendProducts,
          element: <RecommendProducts />,
        },
        {
          path: configs.routes.beautyConsultation,
          element: <BeautyConsultation />,
        },
        {
          path: configs.routes.beautyConsultationDetail,
          element: <ServiceDetail />,
        },
        {
          path: configs.routes.serviceCheckout,
          element: <ServiceCheckout />,
        },
        {
          path: configs.routes.profileBookingDetail,
          element: <BookingDetail />,
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
export const buildResource = (root: string, route: string) => `${externalLink.appURL}/${root}/${route}`

export const buildOneWayResource = (root: string) => `window.location.pathname/${root}`
