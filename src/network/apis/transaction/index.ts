import { TServerResponse } from '@/types/request'
import { ITransaction } from '@/types/transaction'
import { toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { TGetFilteredTransactionsParams } from './type'

export const getFilteredTransactions = toQueryFetcher<TGetFilteredTransactionsParams, TServerResponse<ITransaction[]>>(
  'getAllTransactions',
  async (query) => {
    return privateRequest('/transactions/filter', {
      method: 'POST',
      data: query,
    })
  },
)
