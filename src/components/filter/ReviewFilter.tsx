import { useMutation } from '@tanstack/react-query'
import { Check, Star } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { filterFeedbackApi } from '@/network/apis/feedback'
import { IResponseFeedbackItemInFilter, IResponseFilterFeedback } from '@/types/feedback'

import Empty from '../empty/Empty'
import LoadingIcon from '../loading-icon'
import APIPagination from '../pagination/Pagination'
import ReviewSection from '../reviews/ReviewSection'

interface FilterOption {
  id: string
  label: string
  value: string | number
  type: 'toggle' | 'star'
}

interface ReviewFilterProps {
  productId: string
}
export default function ReviewFilter({ productId }: ReviewFilterProps) {
  const { t } = useTranslation()
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set())
  const [reviews, setReviews] = useState<IResponseFilterFeedback[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  const filterOptions: FilterOption[] = [
    { id: 'newest', label: `${t('filter.newest')}`, value: 'newest', type: 'toggle' },
    { id: 'has-image', label: `${t('filter.hasImage')}`, value: 'has-image', type: 'toggle' },
    { id: 'star-5', label: `${t('filter.numberOfStar', { count: 5 })}`, value: 5, type: 'star' },
    { id: 'star-4', label: `${t('filter.numberOfStar', { count: 4 })}`, value: 4, type: 'star' },
    { id: 'star-3', label: `${t('filter.numberOfStar', { count: 3 })}`, value: 3, type: 'star' },
    { id: 'star-2', label: `${t('filter.numberOfStar', { count: 2 })}`, value: 2, type: 'star' },
    { id: 'star-1', label: `${t('filter.numberOfStar', { count: 1 })}`, value: 1, type: 'star' },
  ]

  // API mutation
  const { mutateAsync: getFeedbackOfProduct } = useMutation({
    mutationKey: [filterFeedbackApi.mutationKey, productId, selectedFilters, currentPage],
    mutationFn: filterFeedbackApi.fn,
    onSuccess: (data) => {
      setReviews(data?.data || [])
      setTotalPages(data?.totalPages || 1)
      setIsLoading(false)
    },
    onError: (error) => {
      console.error('API error:', error)
      setIsLoading(false)
    },
  })

  // Function to convert selected filters to API params
  const convertFiltersToApiParams = () => {
    const filters: Array<{ type: string; value: string | number }> = []

    // Check for star ratings
    const starFilters = Array.from(selectedFilters)
      .filter((id) => id.startsWith('star-'))
      .map((id) => parseInt(id.split('-')[1]))

    if (starFilters.length > 0) {
      starFilters.forEach((rating) => {
        filters.push({ type: 'RATING', value: rating })
      })
    }

    // Check for has-image filter
    if (selectedFilters.has('has-image')) {
      filters.push({ type: 'IMAGE_VIDEO', value: '' })
    }

    return filters
  }

  // Apply filters and fetch data
  const applyFilters = useCallback(
    async (page = 1) => {
      setIsLoading(true)

      try {
        // Convert selected filters to API parameters
        const filterParams = convertFiltersToApiParams()

        // Call API with filters and pagination
        await getFeedbackOfProduct({
          productId,
          filters: filterParams,
          page,
          pageSize: 10,
        })

        setCurrentPage(page)
      } catch (error) {
        console.error('Error applying filters:', error)
        setIsLoading(false)
      }
    },
    [selectedFilters, getFeedbackOfProduct, productId],
  )

  // Toggle a filter and apply filters
  const toggleFilter = (filterId: string) => {
    const newFilters = new Set(selectedFilters)

    if (newFilters.has(filterId)) {
      newFilters.delete(filterId)
    } else {
      newFilters.add(filterId)
    }

    setSelectedFilters(newFilters)
    // Reset to first page when filters change
    setCurrentPage(1)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    applyFilters(page)
  }

  // Initial data load
  useEffect(() => {
    applyFilters(1)
  }, [applyFilters])

  // Apply filters when they change
  useEffect(() => {
    applyFilters(1)
  }, [selectedFilters, applyFilters])

  return (
    <div>
      <div className="border-b border-gray-200">
        <div className="p-5 flex flex-col gap-2">
          <span className="font-semibold">{t('filter.filterBy')}</span>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <Button
                key={option.id}
                variant={selectedFilters.has(option.id) ? 'outline' : 'outline'}
                onClick={() => toggleFilter(option.id)}
                className={`h-8 gap-1.5 rounded-full border-gray-300 ${selectedFilters.has(option.id) ? ' border-primary bg-primary/10 hover:bg-primary/15 text-primary hover:text-primary' : 'border-gray-300'}`}
              >
                {option.type === 'toggle' && selectedFilters.has(option.id) && <Check className="text-primary/80" />}
                {option.label}
                {option.type === 'star' && <Star className="w-4 h-4 fill-current text-yellow-500" />}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4">
        {isLoading && <LoadingIcon />}
        {!isLoading &&
          reviews &&
          reviews.length > 0 &&
          reviews.map((review) => {
            const feedback: IResponseFeedbackItemInFilter = {
              id: review.id,
              content: review.content,
              rating: review.rating,
              createdAt: review.createdAt,
              updatedAt: review.updatedAt,
              mediaFiles: review.mediaFiles ?? [],
            }
            return (
              <ReviewSection
                authorName={review.orderDetail.order.recipientName}
                authorAvatar={review.orderDetail.order.account.avatar ?? ''}
                productClassification={review.orderDetail.productClassification}
                productQuantity={review.orderDetail.quantity}
                feedback={feedback}
                replies={review.replies}
              />
            )
          })}
        {!isLoading && reviews.length === 0 && (
          <Empty
            title={t('empty.feedback.title')}
            description={t('empty.feedback.description', {
              filter: selectedFilters.size === 0 ? '' : t('empty.feedback.filter'),
              filterCallAction: selectedFilters.size === 0 ? '' : t('empty.feedback.filterCallAction'),
            })}
          />
        )}
      </div>
      {/* pagination */}
      <APIPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
    </div>
  )
}
