import { IFeedbackSchema } from '@/schemas/feedback.schema'

import { TMetaData } from './request'

export type IResponseFeedback = TMetaData & IFeedbackSchema
