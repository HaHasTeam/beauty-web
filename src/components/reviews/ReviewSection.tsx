import { IClassification } from '@/types/classification'
import { IReplyFeedback, IResponseFeedback, IResponseFeedbackItemInFilter } from '@/types/feedback'

import BrandAnswer from './BrandAnswer'
import CustomerReview from './CustomerReview'

interface ReviewSectionProps {
  authorName: string
  authorAvatar: string
  productClassification: IClassification | null
  productQuantity: number
  feedback: IResponseFeedback | IResponseFeedbackItemInFilter
  replies: IReplyFeedback[]
}
const ReviewSection = ({
  authorName,
  authorAvatar,
  productClassification,
  productQuantity,
  feedback,
  replies,
}: ReviewSectionProps) => {
  return (
    <div className="w-full border-b border-gray-200 px-3 py-4 flex flex-col gap-5">
      <CustomerReview
        authorName={authorName}
        authorAvatar={authorAvatar}
        updatedAt={feedback.updatedAt}
        classification={productClassification}
        numberOfItem={productQuantity}
        description={feedback.content}
        mediaFiles={feedback.mediaFiles}
        rating={feedback.rating}
      />
      <BrandAnswer replies={replies} />
    </div>
  )
}

export default ReviewSection
