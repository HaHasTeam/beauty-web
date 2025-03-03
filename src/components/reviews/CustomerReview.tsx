import { useTranslation } from 'react-i18next'

import { IClassification } from '@/types/classification'
import { TServerFile } from '@/types/file'

import ViewMediaSection from '../media/ViewMediaSection'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Ratings } from '../ui/rating'

interface CustomerReviewProps {
  authorName: string
  authorAvatar: string
  updatedAt: string
  classification: IClassification | null
  numberOfItem: number
  description: string
  mediaFiles: TServerFile[]
  rating: number
}
const CustomerReview = ({
  authorName,
  authorAvatar,
  updatedAt,
  classification,
  numberOfItem,
  rating,
  description,
  mediaFiles,
}: CustomerReviewProps) => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-1">
      <div>
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage src={authorAvatar} alt={authorName} />
            <AvatarFallback>{authorName?.charAt(0) ?? 'A'}</AvatarFallback>
          </Avatar>
          <span className="font-semibold">{authorName}</span>
        </div>
        <div>
          <span className="text-gray-500 text-sm">
            {t('date.toLocaleDateTimeString', { val: new Date(updatedAt) })}
          </span>
        </div>
      </div>
      <div className="flex gap-3">
        <Ratings rating={rating} variant="yellow" size={13} />
      </div>
      <div className="flex gap-2 text-sm text-gray-500">
        {classification && (
          <div>
            <span>{t('createProduct.classification')}: </span>
            <span className="font-medium text-primary">
              {[
                classification?.color && `${classification.color}`,
                classification?.size && `${classification.size}`,
                classification?.other && `${classification.other}`,
              ]
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>
        )}
        <div className="border-l border-gray-200 px-2">
          <span>{t('createProduct.quantity')}: </span>
          <span>{numberOfItem}</span>
        </div>
      </div>
      <div>
        <p>{description}</p>
      </div>
      <div className="flex gap-2 flex-wrap">{mediaFiles && <ViewMediaSection mediaFiles={mediaFiles} />}</div>
    </div>
  )
}

export default CustomerReview
