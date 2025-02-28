import { IFeedbackSchema } from '@/schemas/feedback.schema'

import { TMetaData } from './request'

export type ISubmitFeedbackScheme = {
  rating: number
  content: string
  orderDetailId: string
  mediaFiles: string[]
}

export type IResponseFeedback = TMetaData & IFeedbackSchema

export type ISubmitFeedback = ISubmitFeedbackScheme
