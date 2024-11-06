import { AuthSlice } from './auth/auth.type'
import { CartSlice } from './cart-slice'
import { UserSlice } from './user-slice'

export type Store = AuthSlice & UserSlice & CartSlice
