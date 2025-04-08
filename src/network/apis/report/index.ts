import { IReport } from '@/types/report'
import { TServerResponse, TServerResponseWithPagination } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { TCreateReportRequestParams, TGetFilteredReportRequestParams } from './type'

export const getFilteredReports = toQueryFetcher<
  TGetFilteredReportRequestParams,
  TServerResponseWithPagination<IReport[]>
>('getFilteredReports', async (query) => {
  const res = (await privateRequest('/reports/filter-reports', {
    method: 'POST',
    data: query,
  })) as TServerResponse<IReport[]>

  const result: TServerResponseWithPagination<IReport[]> = {
    message: res.message,
    data: {
      items: res.data,
      total: res.data.length ?? 0,
    },
  } as TServerResponseWithPagination<IReport[]>
  return result
})

export const createReport = toMutationFetcher<TCreateReportRequestParams, TServerResponse<IReport>>(
  'createReport',
  async (params) => {
    return privateRequest('/reports/create', {
      method: 'POST',
      data: params,
    })
  },
)
