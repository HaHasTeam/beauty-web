import { IAddress } from '@/types/address'
import { TServerResponse } from '@/types/request'
import { toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

export const getAllAddressesApi = toQueryFetcher<void, TServerResponse<IAddress[]>>('getAllAddressesApi', async () => {
  return privateRequest('/address', {
    method: 'GET',
  })
})
