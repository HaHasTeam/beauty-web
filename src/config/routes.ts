// import { RouteConfigType } from '@/types/routes'

const routes = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  feed: '/feed',
  community: '/community',
  messages: '/messages',
  notification: '/notifications',
  explore: '/explore',
  profile: '/profile',
  settings: '/settings',
  forgotPassword: '/forgot-password',
  checkEmail: '/check-email',
  notVerifyEmail: '/not-verify-email',
  about: '/about',
  contact: '/contact',
  serverError: '/server-error',
  forbidden: '/forbidden',
  consultationStandard: '/consultation/standard',
  consultationPremium: '/consultation/premium',
  productFlashSale: '/flash-sale',
  recommendProducts: '/products/recommend-products',
  helpCenter: '/portal',
  products: '/products',
  productDetail: '/products/:productId',
  productReview: '/products/:productId/review',
  accountWishlist: '/account/wishlist',
  accountProfile: '/account/profile',
  accountAddress: '/account/address',
  accountOrder: '/account/order',
  blogs: '/blogs',
  privacyPolicy: '/privacy-policy',
  termsAndConditions: '/terms-and-condition',
  cart: '/cart',
  checkout: '/checkout',
  sellLanding: '/landing/sell',
  professionalLanding: '/landing/professional',
  search: '/search',
  brands: '/brands',
  brandDetail: '/brands/brandId',
  notFound: '*',
}

export default routes
