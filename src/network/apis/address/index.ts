import { IAddress } from '@/types/address'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

export const getAllAddressesApi = toQueryFetcher<void, TServerResponse<IAddress[]>>('getAllAddressesApi', async () => {
  return privateRequest('/address', {
    method: 'GET',
  })
})

export const createAddressApi = toMutationFetcher<IAddress, TServerResponse<IAddress>>(
  'createAddressApi',
  async (data) => {
    return privateRequest('/address', {
      method: 'POST',
      data,
    })
  },
)
export const getMyAddressesApi = toQueryFetcher<void, TServerResponse<IAddress[]>>('getMyAddressesApi', async () => {
  return privateRequest('/address', {
    method: 'GET',
  })
})

export const getAddressByIdApi = toQueryFetcher<IAddress, TServerResponse<IAddress>>(
  'getAddressByIdApi',
  async (params) => {
    return privateRequest(`/address/get-by-id/${params?.id}`, {
      method: 'GET',
    })
  },
)

export const updateAddressApi = toMutationFetcher<IAddress, TServerResponse<IAddress>>(
  'updateAddressApi',
  async (data) => {
    return privateRequest(`/address/${data.id}`, {
      method: 'PUT',
      data,
    })
  },
)
