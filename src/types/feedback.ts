import { TServerFile } from './file'
import { IOrderDetailFeedback } from './order'
import { TMetaData } from './request'
import { TUserFull } from './user'

export type ISubmitFeedbackScheme = {
  rating: number
  content: string
  orderDetailId?: string
  bookingId?: string
  mediaFiles: string[]
}

export type IResponseFeedback = TMetaData & {
  rating: number
  content: string
  orderDetailId?: string
  bookingId?: string
  mediaFiles: TServerFile[]
  replies: IReplyFeedback[]
}
export type IResponseFeedbackItemInFilter = TMetaData & {
  rating: number
  content: string
  mediaFiles: TServerFile[]
  replies: IReplyFeedback[]
}

export type ISubmitFeedback = ISubmitFeedbackScheme

export type IFeedbackGeneral = {
  averageRating: number
  totalCount: number
  rating1Count: number
  rating2Count: number
  rating3Count: number
  rating4Count: number
  rating5Count: number
}
export type IReplyFeedback = TMetaData & {
  content: string
  account: TUserFull
}

export type IResponseFilterFeedback = TMetaData & {
  rating: number
  content: string
  mediaFiles: TServerFile[]
  replies: IReplyFeedback[]
  orderDetail: IOrderDetailFeedback
}
