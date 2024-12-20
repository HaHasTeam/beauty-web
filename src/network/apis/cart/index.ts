import { ICart } from '@/types/cart'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

export const createCartItemApi = toMutationFetcher<ICart, TServerResponse<ICart>>('createCartItemApi', async (data) => {
  return privateRequest('/cart', {
    method: 'POST',
    data,
  })
})
export const getMyCartApi = toMutationFetcher<ICart, TServerResponse<ICart>>('getMyCartApi', async (data) => {
  return privateRequest('/cart/get-my-cart', {
    method: 'POST',
    data,
  })
})

export const getCartByIdApi = toQueryFetcher<ICart, TServerResponse<ICart>>('getCartByIdApi', async (params) => {
  return privateRequest(`/cart/${params?.id}`, {
    method: 'GET',
  })
})

export const getAllCartListApi = toQueryFetcher<void, TServerResponse<ICart[]>>('getAllCartListApi', async () => {
  return privateRequest('/cart', {
    method: 'GET',
  })
})

export const updateOrderApi = toMutationFetcher<ICart, TServerResponse<ICart>>('updateOrderApi', async (data) => {
  return privateRequest(`/cart/${data.id}`, {
    method: 'PUT',
    data,
  })
})
