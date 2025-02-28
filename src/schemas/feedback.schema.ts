import i18next from 'i18next'
import { z } from 'zod'

export const MIN_FEEDBACK_LENGTH = 25
export const MAX_FEEDBACK_LENGTH = 500
export const getFeedbackSchema = () => {
  return z.object({
    rating: z.number().min(1, i18next.t('validation.ratingFeedback')).max(5, i18next.t('validation.ratingFeedback')), // Must have at least one order
    content: z
      .string()
      .min(MIN_FEEDBACK_LENGTH, i18next.t('validation.contentFeedback'))
      .max(MAX_FEEDBACK_LENGTH, i18next.t('validation.contentFeedback')),
    orderDetailId: z.string().uuid(), // uuid
    mediaFiles: z.array(z.instanceof(File)).optional(),
    videos: z.array(z.instanceof(File)).optional(),
    images: z.array(z.instanceof(File)).optional(),
  })
}
export const FeedbackSchema = getFeedbackSchema()
export type IFeedbackSchema = z.infer<typeof FeedbackSchema>
