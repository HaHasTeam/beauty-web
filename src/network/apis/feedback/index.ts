import { IFeedbackGeneral, IResponseFeedback, IResponseFilterFeedback, ISubmitFeedback } from '@/types/feedback'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest, publicRequest } from '@/utils/request'

import { IFilterFeedback, IReplyFeedback } from './type'

export const createFeedbackApi = toMutationFetcher<ISubmitFeedback, TServerResponse<string>>(
  'createFeedbackApi',
  async (data) => {
    return privateRequest('/feedbacks/create', {
      method: 'POST',
      data,
    })
  },
)
export const createBookingFeedbackApi = toMutationFetcher<ISubmitFeedback, TServerResponse<string>>(
  'createBookingFeedbackApi',
  async (data) => {
    return privateRequest('/feedbacks/create-for-booking', {
      method: 'POST',
      data,
    })
  },
)

export const getMyFeedbacksApi = toQueryFetcher<void, TServerResponse<IResponseFeedback[]>>(
  'getMyFeedbacksApi',
  async () => {
    return privateRequest('/feedbacks/get-my-feedbacks/', {
      method: 'GET',
    })
  },
)

export const getFeedbackByIdApi = toQueryFetcher<string, TServerResponse<IResponseFeedback>>(
  'getFeedbackByIdApi',
  async (feedbackId) => {
    return privateRequest(`/feedbacks/get-by-id/${feedbackId}`)
  },
)

export const getConsultantFeedbackApi = toQueryFetcher<string, TServerResponse<IResponseFeedback[]>>(
  'getConsultantFeedbackApi',
  async (consultantId) => {
    return publicRequest(`/feedbacks/get-consultant-feedbacks/${consultantId}`, {
      method: 'GET',
    })
  },
)

export interface IFilterConsultantFeedbackParams {
  consultantId: string
  page?: number
  limit?: number
  type?: 'ALL' | 'RATING' | 'IMAGE_VIDEO' | 'CLASSIFICATION'
}

export const getFilterConsultantFeedbackApi = toQueryFetcher<
  IFilterConsultantFeedbackParams,
  TServerResponse<{ total: number; totalPages: number }, IResponseFilterFeedback[]>
>('getFilterConsultantFeedbackApi', async (params) => {
  const { consultantId, page = 1, limit = 10 } = params || {}
  return publicRequest(`/feedbacks/filter-consultant-feedbacks/${consultantId}`, {
    method: 'POST',
    params: {
      page,
      limit,
    },
    data: {
      type: params?.type ?? 'ALL',
    },
  })
})

export const getFeedbackGeneralOfProductApi = toQueryFetcher<string, TServerResponse<IFeedbackGeneral>>(
  'getFeedbackGeneralOfProductApi',
  async (feedbackId) => {
    return publicRequest(`/feedbacks/review-general-of-product/${feedbackId}`)
  },
)

export const filterFeedbackApi = toMutationFetcher<
  IFilterFeedback,
  TServerResponse<{ total: number; totalPages: number }, IResponseFilterFeedback[]>
>('filterFeedbackApi', async ({ params, data, page, limit }) => {
  return publicRequest(`/feedbacks/filter/${params}`, {
    method: 'POST',
    params: {
      page: page || '1',
      limit: limit || '2',
    },
    data: data
      ? {
          type: data?.type,
          value: data?.value,
        }
      : {},
  })
})
export const replyFeedbackApi = toMutationFetcher<IReplyFeedback, TServerResponse<string>>(
  'replyFeedbackApi',
  async ({ params, content }) => {
    return privateRequest(`/feedbacks/reply/${params}`, {
      method: 'POST',
      data: { content },
    })
  },
)
