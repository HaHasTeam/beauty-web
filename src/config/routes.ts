// import { RouteConfigType } from '@/types/routes'

const routes = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  feed: '/feed',
  community: '/community',
  notification: '/notifications',
  explore: '/explore',
  settings: '/settings',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-pass',
  checkEmail: '/email-verification',
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
  profileFeedback: '/profile/feedbacks/me',
  profile: '/profile',
  profileAddress: '/profile/addresses',
  profileOrder: '/profile/orders',
  profileOrderDetail: '/profile/orders/:orderId',
  profilePassword: '/profile/password',
  profileNotification: '/profile/notification',
  profileVoucher: '/profile/vouchers',
  profileWallet: '/profile/wallet',
  blogs: '/blogs',
  privacyPolicy: '/privacy-policy',
  termsAndConditions: '/terms-and-condition',
  cart: '/cart',
  checkout: '/checkout',
  checkoutResult: '/checkout/result',
  sellLanding: '/landing/sell',
  professionalLanding: '/landing/professional',
  search: '/search',
  brands: '/brands',
  brandDetail: '/brands/:brandId',
  groupBuy: '/products/group-buying',
  groupBuyByBrand: '/products/group-buying/:brandId',
  groupBuyDetail: '/products/group-buying/:brandId/:groupId',
  notFound: '*',
}

export default routes
