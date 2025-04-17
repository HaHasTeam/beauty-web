import { useTranslation } from 'react-i18next'

import { Progress } from '@/components/ui/progress'
import { IFeedbackGeneral } from '@/types/feedback'

import { Ratings } from '../ui/rating'

interface ReviewOverallProps {
  reviewGeneral: IFeedbackGeneral
}
export default function ReviewOverall({ reviewGeneral }: ReviewOverallProps) {
  const { t } = useTranslation()
  const ratings = [
    { stars: 5, count: reviewGeneral.rating5Count },
    { stars: 4, count: reviewGeneral.rating4Count },
    { stars: 3, count: reviewGeneral.rating3Count },
    { stars: 2, count: reviewGeneral.rating2Count },
    { stars: 1, count: reviewGeneral.rating1Count },
  ]
  return (
    <div className="p-4">
      <h2 className="text-xl font-medium mb-4 text-primary">{t('reviews.customerReview')}</h2>

      <div className="mb-6 ">
        <div className="text-lg font-medium text-primary">{t('reviews.overall')}</div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold text-primary">{reviewGeneral.averageRating ?? 0}</span>
          <Ratings rating={reviewGeneral.averageRating ?? 0} variant="yellow" />
        </div>
        <div className="text-gray-500 text-sm">({t('reviews.reviewCount', { amount: reviewGeneral.totalCount })})</div>
      </div>

      <div className="space-y-2">
        {ratings.map(({ stars, count }) => {
          const percentage = reviewGeneral.totalCount > 0 ? (count / reviewGeneral.totalCount) * 100 : 0;
          return (
            <div key={stars} className="flex items-center gap-2">
              <Ratings rating={stars} size={13} variant="yellow" />

              <Progress value={percentage} className="h-2 w-48" />
              <span className="text-sm text-gray-600 w-8">{percentage.toFixed(2)}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
