import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'

import { useStore } from '@/store/store'
import { IBrand } from '@/types/brand'
import { IClassification } from '@/types/classification'
import { RoleEnum } from '@/types/enum'
import { IResponseFeedback } from '@/types/feedback'

import BrandAnswer from './BrandAnswer'
import CustomerReview from './CustomerReview'

interface ReviewSectionProps {
  feedback: IResponseFeedback
  productQuantity: number
  productClassification: IClassification | null
  brand: IBrand | null
  recipientAvatar: string
  recipientName: string
  orderDetailId: string
}
const ReviewSection = ({
  productClassification,
  productQuantity,
  feedback,
  recipientAvatar,
  recipientName,
  orderDetailId,
  brand,
}: ReviewSectionProps) => {
  const { t } = useTranslation()
  const [showRep, setShowRep] = useState(false)
  const replyFormRef = useRef<HTMLDivElement>(null)
  const { user } = useStore(
    useShallow((state) => ({
      user: state.user,
    })),
  )
  const handleReplyClick = () => {
    setShowRep(true)
    setTimeout(() => {
      replyFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className="w-full border-b border-gray-200 px-3 py-4 flex flex-col gap-5">
      {(user?.role === RoleEnum.ADMIN ||
        user?.role === RoleEnum.OPERATOR ||
        user?.role === RoleEnum.MANAGER ||
        user?.role === RoleEnum.STAFF) && (
        <div className="flex items-center justify-between text-sm text-gray-500 mr-2">
          <div>
            <span className="font-medium">{t('feedback.ID')}:</span> {feedback.id.substring(0, 8)}
          </div>
          {orderDetailId && (
            <div>
              <span className="font-medium"> {t('feedback.order')}:</span> {orderDetailId.substring(0, 8)}
            </div>
          )}
        </div>
      )}
      <div className="space-y-2">
        <CustomerReview
          authorName={recipientName}
          authorAvatar={recipientAvatar}
          updatedAt={feedback.updatedAt}
          classification={productClassification}
          numberOfItem={productQuantity}
          description={feedback.content}
          mediaFiles={feedback.mediaFiles}
          rating={feedback.rating}
          brand={brand}
          onReplyClick={handleReplyClick}
        />
        {feedback.replies && feedback.replies.length > 0 && (
          <BrandAnswer
            showRep={showRep}
            replies={feedback.replies}
            feedback={feedback}
            isOpen={true}
            setShowRep={setShowRep}
            replyFormRef={replyFormRef}
            onReplyClick={handleReplyClick}
            brand={brand}
          />
        )}
      </div>
    </div>
  )
}

export default ReviewSection
