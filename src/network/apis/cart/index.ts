import { ICart, ICartByBrand, ICartItem } from '@/types/cart'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

export const createCartItemApi = toMutationFetcher<ICartItem, TServerResponse<ICartItem>>(
  'createCartItemApi',
  async (data) => {
    return privateRequest('/cart', {
      method: 'POST',
      data,
    })
  },
)

export const getMyCartApi = toQueryFetcher<void, TServerResponse<ICartByBrand>>('getMyCartApi', async () => {
  return privateRequest('/cart/get-my-cart', {
    method: 'GET',
  })
})

export const getCartByIdApi = toQueryFetcher<ICartItem, TServerResponse<ICartItem>>(
  'getCartByIdApi',
  async (params) => {
    return privateRequest(`/cart/${params?.id}`, {
      method: 'GET',
    })
  },
)

export const getAllCartListApi = toQueryFetcher<void, TServerResponse<ICart[]>>('getAllCartListApi', async () => {
  return privateRequest('/cart', {
    method: 'GET',
  })
})

export const updateCartItemApi = toMutationFetcher<ICartItem, TServerResponse<ICartItem>>(
  'updateCartItemApi',
  async (data) => {
    return privateRequest(`/cart/${data.id}`, {
      method: 'PUT',
      data,
    })
  },
)
export const deleteCartItemApi = toMutationFetcher<string, TServerResponse<ICartItem>>(
  'deleteCartItemApi',
  async (cartItemId) => {
    return privateRequest(`/cart/${cartItemId}`, {
      method: 'DELETE',
    })
  },
)
