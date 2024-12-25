import { TServerResponse } from '@/types/request'
import { ICategoryVoucher, TVoucher } from '@/types/voucher'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest, publicRequest } from '@/utils/request'

import { TRequestCreateVoucherParams, TUpdateStatusVoucherRequestParams, TUpdateVoucherRequestParams } from './type'

export const createVoucherApi = toMutationFetcher<TRequestCreateVoucherParams, TServerResponse<TVoucher>>(
  'createVoucher',
  async (params) => {
    return privateRequest('/vouchers/create', {
      method: 'POST',
      data: params,
    })
  },
)
export const updateStatusVoucherByIdApi = toMutationFetcher<
  TUpdateStatusVoucherRequestParams,
  TServerResponse<TVoucher>
>('updateStatusVoucherById', async (params) => {
  return publicRequest(`/vouchers/update-status/${params?.voucherId}`, {
    method: 'PUT',
    data: params,
  })
})

export const updateVoucherByIdApi = toMutationFetcher<TUpdateVoucherRequestParams, TServerResponse<TVoucher>>(
  'updateVoucherById',
  async (params) => {
    return privateRequest(`/vouchers/update-detail/${params?.id}`, {
      method: 'PUT',
      data: params,
    })
  },
)

export const getVoucherByIdApi = toQueryFetcher<string, TServerResponse<TVoucher>>('getVoucherById', async (params) => {
  return publicRequest(`/vouchers/get-by-id/${params}`, {
    method: 'GET',
  })
})
export const getAllVouchersApi = toQueryFetcher<void, TServerResponse<TVoucher[]>>('getAllVouchers', async () => {
  return privateRequest(`/vouchers/`, {
    method: 'GET',
  })
})
export const getPlatformVouchersApi = toQueryFetcher<void, TServerResponse<TVoucher[]>>(
  'getPlatformVouchersApi',
  async () => {
    return privateRequest(`/vouchers/get-platform-vouchers`, {
      method: 'GET',
    })
  },
)
export const getBrandVouchersApi = toQueryFetcher<string, TServerResponse<TVoucher[]>>(
  'getBrandVouchersApi',
  async (params) => {
    return privateRequest(`/vouchers/get-by-brand/${params}`, {
      method: 'GET',
    })
  },
)
export const getCheckoutListBrandVouchersApi = toMutationFetcher<ICategoryVoucher, TServerResponse<TVoucher[]>>(
  'getCheckoutListBrandVouchersApi',
  async (data) => {
    return privateRequest(`/vouchers/categorize-shop-vouchers-when-checkout`, {
      method: 'POST',
      data,
    })
  },
)
export const getBestShopVouchersApi = toMutationFetcher<ICategoryVoucher, TServerResponse<TVoucher[]>>(
  'getBestShopVouchersApi',
  async (data) => {
    return privateRequest(`/vouchers/get-best-shop-vouchers-for-products`, {
      method: 'POST',
      data,
    })
  },
)
export const getBestPlatformVouchersApi = toMutationFetcher<ICategoryVoucher, TServerResponse<TVoucher[]>>(
  'getBestPlatformVouchersApi',
  async (data) => {
    return privateRequest(`/vouchers/get-best-platform-vouchers-for-products`, {
      method: 'POST',
      data,
    })
  },
)
export const getCheckoutListPlatformVouchersApi = toMutationFetcher<ICategoryVoucher, TServerResponse<TVoucher[]>>(
  'getCheckoutListPlatformVouchersApi',
  async (data) => {
    return privateRequest(`/vouchers/categorize-platform-vouchers-when-checkout`, {
      method: 'POST',
      data,
    })
  },
)
export const collectVoucherApi = toMutationFetcher<TUpdateVoucherRequestParams, TServerResponse<TVoucher>>(
  'collectVoucher',
  async (params) => {
    return privateRequest(`/vouchers/collect-voucher/${params?.id}`, {
      method: 'PUT',
      data: params,
    })
  },
)
