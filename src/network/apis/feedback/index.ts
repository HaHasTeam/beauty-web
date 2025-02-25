import { ICreateFeedbackSchema } from '@/schemas/feedback.schema'
import { IResponseFeedback } from '@/types/feedback'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { IFilterFeedback, IReplyFeedback } from './type'

export const createFeedbackApi = toMutationFetcher<ICreateFeedbackSchema, TServerResponse<string>>(
  'createFeedbackApi',
  async (data) => {
    return privateRequest('/feedbacks/create', {
      method: 'POST',
      data,
    })
  },
)

export const getMyFeedbacksApi = toMutationFetcher<void, TServerResponse<IResponseFeedback[]>>(
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
export const getFeedbackGeneralOfProductApi = toQueryFetcher<string, TServerResponse<IResponseFeedback>>(
  'getFeedbackGeneralOfProductApi',
  async (feedbackId) => {
    return privateRequest(`/feedbacks/review-general-of-product/${feedbackId}`)
  },
)

export const filterFeedbackApi = toMutationFetcher<IFilterFeedback, TServerResponse<string>>(
  'filterFeedbackApi',
  async (params, data) => {
    return privateRequest(`/feedbacks/filter/${params}`, {
      method: 'POST',
      data,
    })
  },
)
export const replyFeedbackApi = toMutationFetcher<IReplyFeedback, TServerResponse<string>>(
  'replyFeedbackApi',
  async (params, data) => {
    return privateRequest(`/feedbacks/reply/${params}`, {
      method: 'POST',
      data,
    })
  },
)
