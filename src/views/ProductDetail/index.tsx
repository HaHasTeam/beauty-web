import { useQuery } from '@tanstack/react-query'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill-new'
import { useParams } from 'react-router-dom'

import BrandSection from '@/components/brand/BrandSection'
import CustomBreadcrumb from '@/components/breadcrumb/CustomBreadcrumb'
import Collapsible from '@/components/collapsiable'
import Empty from '@/components/empty/Empty'
import ReviewFilter from '@/components/filter/ReviewFilter'
import LoadingIcon from '@/components/loading-icon'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import ProductCarousel from '@/components/product/ProductCarousel'
import ProductDetailAction from '@/components/product/ProductDetailAction'
import ProductDetailInformation from '@/components/product/ProductDetailInformation'
import ReviewOverall from '@/components/reviews/ReviewOverall'
import { cn } from '@/lib/utils'
import { getFeedbackGeneralOfProductApi } from '@/network/apis/feedback'
import { getProductApi } from '@/network/apis/product'
import { IClassification } from '@/types/classification'
import { DiscountTypeEnum, OrderEnum, ProductDiscountEnum, StatusEnum } from '@/types/enum'
import { PreOrderProductEnum } from '@/types/pre-order'
import { ProductClassificationTypeEnum } from '@/types/product'
import { getCheapestClassification } from '@/utils/product'

type ProductDetailProps = {
  initProductId?: string
  isInGroupBuying?: boolean
}

const ProductDetail = ({ initProductId, isInGroupBuying = false }: ProductDetailProps) => {
  let { productId } = useParams()
  if (initProductId) {
    productId = initProductId
  }
  const { t } = useTranslation()
  const { data: useProductData, isFetching } = useQuery({
    queryKey: [getProductApi.queryKey, productId as string],
    queryFn: getProductApi.fn,
  })
  const { data: reviewGeneral, isFetching: isFetchingReviewGeneral } = useQuery({
    queryKey: [getFeedbackGeneralOfProductApi.queryKey, productId as string],
    queryFn: getFeedbackGeneralOfProductApi.fn,
  })

  const carouselRef = useRef(null)

  const event = useMemo(
    () =>
      isInGroupBuying
        ? OrderEnum.NORMAL
        : (useProductData?.data?.productDiscounts ?? [])?.length > 0 &&
            (useProductData?.data?.productDiscounts ?? [])[0]?.status === ProductDiscountEnum.ACTIVE
          ? OrderEnum.FLASH_SALE
          : (useProductData?.data?.preOrderProducts ?? [])?.length > 0 &&
              (useProductData?.data?.preOrderProducts ?? [])[0]?.status === PreOrderProductEnum.ACTIVE
            ? OrderEnum.PRE_ORDER
            : OrderEnum.NORMAL,

    [useProductData?.data?.preOrderProducts, useProductData?.data?.productDiscounts, isInGroupBuying],
  )

  const productClassifications = useMemo(() => {
    if (!useProductData?.data) return []
    if (isInGroupBuying) {
      return useProductData.data.productClassifications
    }

    switch (event) {
      case OrderEnum.FLASH_SALE:
          return useProductData.data.productDiscounts?.[0]?.productClassifications
        case OrderEnum.PRE_ORDER:
          return useProductData.data.preOrderProducts?.[0]?.productClassifications
        default:
        return useProductData.data.productClassifications
    }
  }, [event, useProductData?.data, isInGroupBuying])

  const cheapestClassification = useMemo(
    () => getCheapestClassification(productClassifications ?? []),
    [productClassifications],
  )
  const hasCustomType = useMemo(
    () =>
      productClassifications?.some(
        (classification) =>
          classification?.type === ProductClassificationTypeEnum.CUSTOM && classification.status === StatusEnum.ACTIVE,
      ),
    [productClassifications],
  )
  const inStock = productClassifications?.some((classification) => classification?.quantity > 0) ?? false

  const [chosenClassification, setChosenClassification] = useState<IClassification | null>(
    !hasCustomType && productClassifications ? productClassifications?.[0] : null,
  )
  const reviewSectionRef = useRef<HTMLDivElement | null>(null)

  const scrollToReviews = () => {
    reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="w-full mx-auto px-4 py-5">
      {isFetching && <LoadingContentLayer />}
      {/* product information */}
      <div className={cn('w-full space-y-3 ', !isInGroupBuying ? 'lg:px-20 md:px-10 sm:px-8 px-3' : '')}>
        <CustomBreadcrumb dynamicSegments={[{ segment: useProductData?.data?.name ?? t('productDetail.title') }]} />
        {!isFetching && useProductData && useProductData?.data && (
          <>
            <div className="flex md:flex-row flex-col gap-2 w-full items-stretch">
              {/* product image carousel */}
              <div
                ref={carouselRef}
                className="shadow-sm p-3 bg-white rounded-lg w-full md:w-[calc(30%-8px)] md:sticky md:top-0 md:max-h-fit"
              >
                <ProductCarousel product={useProductData?.data} activeClassification={chosenClassification} />
              </div>

              {/* product detail information */}
              <div className="w-full md:w-[calc(50%-8px)]">
                <Collapsible
                  containerRef={carouselRef}
                  content={
                    <ProductDetailInformation
                      isInGroupBuying={isInGroupBuying}
                  product={useProductData?.data}
                      scrollToReviews={scrollToReviews}
                      productClassifications={productClassifications}
                      cheapestClassification={cheapestClassification}
                      event={event}
                      chosenClassification={chosenClassification}
                      setChosenClassification={setChosenClassification}
                      hasCustomType={hasCustomType ?? false}
                      reviewGeneral={reviewGeneral?.data ?? null}
                    />
                  }
                />
              </div>
              {/* call to action */}
              <div className="shadow-sm p-3 bg-white rounded-lg w-full md:w-[calc(20%-8px)] md:sticky md:top-0 md:max-h-fit">
                <ProductDetailAction
                  product={useProductData?.data}
                  chosenClassification={chosenClassification}
                  discount={
                    event === OrderEnum.FLASH_SALE ? useProductData?.data?.productDiscounts?.[0]?.discount : undefined
                  }
                  discountType={DiscountTypeEnum.PERCENTAGE}
                  hasCustomType={hasCustomType ?? false}
                  isInGroupBuying={isInGroupBuying}
                  inStock={inStock}
                />
              </div>
            </div>

            {/* description */}
            <div className="w-full py-4 px-3 bg-white rounded-lg">
              <h3 className="font-semibold mb-3 text-lg">{t('productDetail.descriptionTitle')}</h3>
              <ReactQuill value={useProductData?.data?.description} readOnly={true} theme={'bubble'} />
            </div>

            {/* product brand */}
            {useProductData?.data?.brand && <BrandSection brand={useProductData?.data?.brand} />}

            {/* product reviews */}
            <div className="flex gap-2 bg-white rounded-lg" id="customerReviews" ref={reviewSectionRef}>
              {isFetchingReviewGeneral && <LoadingIcon />}
              {reviewGeneral && reviewGeneral.data ? <ReviewOverall reviewGeneral={reviewGeneral.data} /> : null}
              <div>
                <ReviewFilter productId={productId ?? ''} />
              </div>
            </div>

            {/* other product in same brand */}
          </>
        )}
        {!isFetching && (!useProductData || !useProductData?.data) && (
          <Empty title={t('empty.productDetail.title')} description={t('empty.productDetail.description')} />
        )}
      </div>
    </div>
  )
}

export default ProductDetail
