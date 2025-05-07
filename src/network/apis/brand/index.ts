import { IBranch, IBrand, TBrand } from '@/types/brand'
import { TServerResponse, TServerResponseWithPagination } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest, publicRequest } from '@/utils/request'

import {
  FilterParamBrands,
  TRequestCreateBrandParams,
  TUpdateBrandRequestParams,
  TUpdateStatusBrandRequestParams,
} from './type'

export const requestCreateBrandApi = toMutationFetcher<TRequestCreateBrandParams, TServerResponse<IBranch>>(
  'requestCreateBrand',
  async (params) => {
    return privateRequest('/brands/create', {
      method: 'POST',
      data: params,
    })
  },
)
export const updateStatusBrandByIdApi = toMutationFetcher<TUpdateStatusBrandRequestParams, TServerResponse<IBranch>>(
  'updateStatusBrandById',
  async (params) => {
    return privateRequest(`/brands/update-status/`, {
      method: 'PUT',
      data: {
        reason: 'fdsaf',
        brandId: params?.brandId,
        status: params.status,
      },
    })
  },
)

export const updateBrandByIdApi = toMutationFetcher<TUpdateBrandRequestParams, TServerResponse<IBranch>>(
  'updateBrandById',
  async (params) => {
    return privateRequest(`/brands/update-detail/${params?.brandId}`, {
      method: 'PUT',
      data: params,
    })
  },
)
export const getBrandByIdApi = toQueryFetcher<string, TServerResponse<IBranch>>('getBrandById', async (brandId) => {
  return publicRequest(`/brands/get-by-id/${brandId}`, {
    method: 'GET',
  })
})
export const getAllBrandsApi = toQueryFetcher<void, TServerResponse<TBrand[]>>('getAllBrands', async () => {
  return publicRequest(`/brands/`, {
    method: 'GET',
  })
})

export const getBrandsHasGroupProductApi = toQueryFetcher<void, TServerResponse<IBranch[]>>(
  'getBrandsHasGroupProductApi',
  async () => {
    return publicRequest(`/group-products/get-brands-have-group-products/`, {
      method: 'GET',
    })
  },
)

export const getBrandFilterApi = toQueryFetcher<FilterParamBrands, TServerResponseWithPagination<IBrand[]>>(
  'getBrandFilterApi',
  async (params) => {
    const { page, limit, sortBy, order, ...filterParams } = params || {}
    const body: FilterParamBrands = {}
    if (filterParams?.name) {
      body.name = filterParams.name
    }
    if (filterParams?.reviewerId) {
      body.reviewerId = filterParams.reviewerId
    }
    if (filterParams?.statuses?.length) {
      body.statuses = filterParams.statuses
    }

    return publicRequest('/brands/filter', {
      method: 'POST',
      data: body,
      params: { page, limit, sortBy, order },
    })
  },
)
