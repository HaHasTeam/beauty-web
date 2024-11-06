// Config types
export type RouteKey =
  | 'home'
  | 'signIn'
  | 'signUp'
  | 'feed'
  | 'community'
  | 'messages'
  | 'notification'
  | 'explore'
  | 'profile'
  | 'settings'
  | 'forgotPassword'
  | 'checkEmail'
  | 'notVerifyEmail'
  | 'notFound'

export type RouteValue =
  | '/'
  | '/sign-in'
  | '/sign-up'
  | '/feed'
  | '/community'
  | '/messages'
  | '/notification'
  | '/explore'
  | '/profile'
  | '/settings'
  | '/forgot-password'
  | '/check-email'
  | '/not-verify-email'
  | '*'

export type RouteConfigType = { [K in RouteKey]: RouteValue }
