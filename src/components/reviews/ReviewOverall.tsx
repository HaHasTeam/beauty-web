import { useTranslation } from 'react-i18next'

import { Progress } from '@/components/ui/progress'

import { Ratings } from '../ui/rating'

export default function ReviewOverall() {
  const { t } = useTranslation()
  const ratings = [
    { stars: 5, count: 16.5 },
    { stars: 4, count: 20 },
    { stars: 3, count: 1 },
    { stars: 2, count: 2 },
    { stars: 1, count: 2 },
  ]

  const totalReviews = ratings.reduce((sum, rating) => sum + rating.count, 0)
  const averageRating = ratings.reduce((sum, rating) => sum + rating.stars * rating.count, 0) / totalReviews

  return (
    <div className="p-4">
      <h2 className="text-xl font-medium mb-4 text-primary">{t('reviews.customerReview')}</h2>

      <div className="mb-6 ">
        <div className="text-lg font-medium">{t('reviews.overall')}</div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
          <Ratings rating={averageRating} variant="yellow" />
        </div>
        <div className="text-gray-500 text-sm">({t('reviews.reviewCount', { amount: totalReviews })})</div>
      </div>

      <div className="space-y-2">
        {ratings.map(({ stars, count }) => (
          <div key={stars} className="flex items-center gap-2">
            <Ratings rating={stars} size={13} variant="yellow" />

            <Progress value={(count / totalReviews) * 100} className="h-2 w-48" />
            <span className="text-sm text-gray-600 w-8">{count}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
