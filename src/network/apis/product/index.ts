import { IProduct, IResponseProduct, IServerCreateProduct, TProduct } from '@/types/product'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest, publicRequest } from '@/utils/request'

import { TGetProductByBrandIdRequestParams } from './type'

export const getProductByBrandIdApi = toQueryFetcher<TGetProductByBrandIdRequestParams, TServerResponse<TProduct[]>>(
  'getProductByBrandIdApi',
  async (params) => {
    return privateRequest(`/products/get-by-brand/${params?.brandId}`)
  },
)

export const getAllProductApi = toQueryFetcher<void, TServerResponse<IResponseProduct[]>>(
  'getAllProductApi',
  async () => {
    return publicRequest('/products')
  },
)
export const getProductApi = toQueryFetcher<string, TServerResponse<IProduct>>('getProductApi', async (productId) => {
  return privateRequest(`/products/get-by-id/${productId}`)
})

export const createProductApi = toMutationFetcher<IServerCreateProduct, TServerResponse<IServerCreateProduct>>(
  'createProductApi',
  async (data) => {
    return privateRequest('/products', {
      method: 'POST',
      data,
    })
  },
)

type UpdateProductParams = { productId: string; data: IServerCreateProduct }

export const updateProductApi = toMutationFetcher<UpdateProductParams, TServerResponse<IServerCreateProduct>>(
  'updateProductApi',
  async ({ productId, data }: UpdateProductParams) => {
    return privateRequest(`/products/${productId}`, {
      method: 'PUT',
      data,
    })
  },
)
