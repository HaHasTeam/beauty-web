import { TServerResponse, TServerResponseWithPagination } from '@/types/request'
import { ITransaction } from '@/types/transaction'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { PAY_TYPE, TGetFilteredTransactionsParams } from './type'

export const getFilteredTransactions = toQueryFetcher<TGetFilteredTransactionsParams, TServerResponse<ITransaction[]>>(
  'getAllTransactions',
  async (query) => {
    return privateRequest('/transactions/filter', {
      method: 'POST',
      data: query,
    })
  },
)

export const filterTransactions = toQueryFetcher<
  TGetFilteredTransactionsParams,
  TServerResponseWithPagination<ITransaction[]>
>('filterTransactions', async (params = {}) => {
  const { page, limit, order, sortBy, ...restParams } = params
  return privateRequest(`/transactions/filter`, {
    method: 'POST',
    data: restParams,
    params: {
      page,
      limit,
      order,
      sortBy,
    },
  })
})

export const payTransactionApi = toMutationFetcher<
  { orderId: string; id: string; type: PAY_TYPE },
  TServerResponse<ITransaction>
>('payTransactionApi', async (params) => {
  return privateRequest(`/transactions/pay`, {
    method: 'POST',
    data: params,
  })
})
