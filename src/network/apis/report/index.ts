import { IReport } from '@/types/report'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { TCreateReportRequestParams, TGetFilteredReportRequestParams } from './type'

export const getFilteredReports = toQueryFetcher<TGetFilteredReportRequestParams, TServerResponse<IReport[]>>(
  'getFilteredReports',
  async (query) => {
    return privateRequest('/reports/filter-reports', {
      method: 'POST',
      data: query,
    })
  },
)

export const createReport = toMutationFetcher<TCreateReportRequestParams, TServerResponse<IReport>>(
  'createReport',
  async (params) => {
    return privateRequest('/reports/create', {
      method: 'POST',
      data: params,
    })
  },
)
