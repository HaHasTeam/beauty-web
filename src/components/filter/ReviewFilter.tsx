import { useMutation } from '@tanstack/react-query'
import { Check, Star } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import useHandleServerError from '@/hooks/useHandleServerError'
import { filterFeedbackApi } from '@/network/apis/feedback'
import { IFilterFeedbackData } from '@/network/apis/feedback/type'
import { IBrand } from '@/types/brand'
import { FeedbackFilterEnum } from '@/types/enum'
import { IResponseFeedback, IResponseFeedbackItemInFilter, IResponseFilterFeedback } from '@/types/feedback'

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
  brand?: IBrand
}
export default function ReviewFilter({ productId, brand }: ReviewFilterProps) {
  const { t } = useTranslation()
  // const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set())
  const [selectedFilter, setSelectedFilter] = useState<string>('')
  const [reviews, setReviews] = useState<IResponseFilterFeedback[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const handleServerError = useHandleServerError()
  // const [total, setTotal] = useState<number>(1)

  const filterOptions: FilterOption[] = [
    // { id: 'newest', label: `${t('filter.newest')}`, value: 'newest', type: 'toggle' },
    { id: 'has-image', label: `${t('filter.hasImage')}`, value: 'has-image', type: 'toggle' },
    { id: 'star-5', label: `${t('filter.numberOfStar', { count: 5 })}`, value: 5, type: 'star' },
    { id: 'star-4', label: `${t('filter.numberOfStar', { count: 4 })}`, value: 4, type: 'star' },
    { id: 'star-3', label: `${t('filter.numberOfStar', { count: 3 })}`, value: 3, type: 'star' },
    { id: 'star-2', label: `${t('filter.numberOfStar', { count: 2 })}`, value: 2, type: 'star' },
    { id: 'star-1', label: `${t('filter.numberOfStar', { count: 1 })}`, value: 1, type: 'star' },
  ]

  // API mutation
  const { mutateAsync: getFeedbackOfProduct } = useMutation({
    mutationKey: [filterFeedbackApi.mutationKey, productId],
    mutationFn: filterFeedbackApi.fn,
    onSuccess: (data) => {
      setReviews(data?.data?.items || [])
      setTotalPages(data?.data?.totalPages || 1)
      // setTotal(data?.data?.totalPages || 1)
      setIsLoading(false)
    },
  })

  // Function to convert selected filters to API params
  // const convertFiltersToApiParams = () => {
  //   const filters: Array<{ type: string; value: string }> = []

  //   // Check for star ratings
  //   const starFilters = Array.from(selectedFilters)
  //     .filter((id) => id.startsWith('star-'))
  //     .map((id) => parseInt(id.split('-')[1]))

  //   if (starFilters.length > 0) {
  //     starFilters.forEach((rating) => {
  //       filters.push({ type: 'RATING', value: rating.toString() })
  //     })
  //   }

  //   // Check for has-image filter
  //   if (selectedFilters.has('has-image')) {
  //     filters.push({ type: 'IMAGE_VIDEO', value: '' })
  //   }

  //   return filters
  // }

  // Apply filters and fetch data
  const applyFilters = useCallback(
    async (page = 1) => {
      setIsLoading(true)

      try {
        const convertFiltersToApiParams = () => {
          let filter: { type: string; value: string } | object = {}

          // Check for star ratings
          if (selectedFilter.startsWith('star-')) {
            const rating = parseInt(selectedFilter.split('-')[1])
            filter = { type: FeedbackFilterEnum.RATING, value: rating.toString() }
          }
          // Check for has-image filter
          if (selectedFilter === 'has-image') {
            filter = { type: FeedbackFilterEnum.IMAGE_VIDEO, value: '' }
          }
          if (!selectedFilter) {
            filter = { type: FeedbackFilterEnum.ALL, value: '' }
          }

          return filter
        }
        // Convert selected filters to API parameters
        const filterParams = convertFiltersToApiParams()

        // Call API with filters and pagination
        await getFeedbackOfProduct({
          params: productId,
          data: filterParams as IFilterFeedbackData,
          page: page.toString(),
        })

        setCurrentPage(page)
      } catch (error) {
        handleServerError({
          error,
        })
        setIsLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFilter, getFeedbackOfProduct, productId],
  )

  // Toggle a filter and apply filters
  const toggleFilter = (filterId: string) => {
    // const newFilters = new Set(selectedFilters)

    // if (newFilters.has(filterId)) {
    //   newFilters.delete(filterId)
    // } else {
    //   newFilters.add(filterId)
    // }

    // setSelectedFilters(newFilters)
    setSelectedFilter((prevFilter) => {
      if (prevFilter === filterId) {
        return ''
      }

      return filterId
    })
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
  }, [selectedFilter, applyFilters])

  return (
    <div>
      <div className="border-b border-gray-200 ">
        <div className="p-5 flex flex-col gap-2">
          <span className="font-semibold text-primary">{t('filter.filterBy')}</span>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <Button
                key={option.id}
                variant={selectedFilter === option.id ? 'outline' : 'outline'}
                onClick={() => toggleFilter(option.id)}
                className={`h-8 gap-1.5 rounded-full border-gray-300 ${selectedFilter === option.id ? ' border-primary bg-primary/10 hover:bg-primary/15 text-primary hover:text-primary' : 'border-secondary-foreground text-secondary-foreground hover:text-secondary-foreground'}`}
              >
                {option.type === 'toggle' && selectedFilter === option.id && <Check className="text-primary/80" />}
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
              replies: review.replies ?? [],
            }
            return (
              <ReviewSection
                key={feedback.id}
                productQuantity={review?.orderDetail?.quantity ?? 0}
                productClassification={review?.orderDetail?.productClassification || null}
                feedback={feedback as IResponseFeedback}
                brand={
                  (
                    review?.orderDetail?.order?.productClassification?.preOrderProduct?.product ??
                    review?.orderDetail?.order?.productClassification?.productDiscount?.product ??
                    review?.orderDetail?.order?.productClassification?.product
                  )?.brand ??
                  (brand || null)
                }
                recipientAvatar={review?.orderDetail?.order?.account?.avatar ?? ''}
                recipientName={review?.orderDetail?.order?.account?.username ?? ''}
                orderDetailId={review?.orderDetail?.id}
              />
            )
          })}
        {!isLoading && reviews.length === 0 && (
          <Empty
            title={t('empty.feedback.title')}
            description={t('empty.feedback.description', {
              filter: !selectedFilter ? '' : t('empty.feedback.filter'),
              filterCallAction: !selectedFilter ? '' : t('empty.feedback.filterCallAction'),
            })}
          />
        )}
      </div>
      {/* pagination */}
      {reviews && reviews.length > 0 && (
        <div className="mb-2">
          <APIPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}
