import { useQuery } from '@tanstack/react-query'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill-new'
import { useParams } from 'react-router-dom'

import BrandSection from '@/components/brand/BrandSection'
import CustomBreadcrumb from '@/components/breadcrumb/CustomBreadcrumb'
import Empty from '@/components/empty/Empty'
import ReviewFilter from '@/components/filter/ReviewFilter'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import APIPagination from '@/components/pagination/Pagination'
import ProductCarousel from '@/components/product/ProductCarousel'
import ProductDetailAction from '@/components/product/ProductDetailAction'
import ProductDetailInformation from '@/components/product/ProductDetailInformation'
import ReviewOverall from '@/components/reviews/ReviewOverall'
import ReviewSection from '@/components/reviews/ReviewSection'
import { getProductApi } from '@/network/apis/product'
import { IClassification } from '@/types/classification'
import { DiscountTypeEnum, OrderEnum, ProductDiscountEnum, StatusEnum } from '@/types/enum'
import { PreOrderProductEnum } from '@/types/pre-order'
import { ProductClassificationTypeEnum } from '@/types/product'
import { getCheapestClassification } from '@/utils/product'

const ProductDetail = () => {
  const { productId } = useParams()
  const { t } = useTranslation()
  const { data: useProductData, isFetching } = useQuery({
    queryKey: [getProductApi.queryKey, productId as string],
    queryFn: getProductApi.fn,
  })

  console.log('useProductData', useProductData)

  const event = useMemo(
    () =>
      (useProductData?.data?.productDiscounts ?? [])?.length > 0 &&
      (useProductData?.data?.productDiscounts ?? [])[0]?.status === ProductDiscountEnum.ACTIVE
        ? OrderEnum.FLASH_SALE
        : (useProductData?.data?.preOrderProducts ?? [])?.length > 0 &&
            (useProductData?.data?.preOrderProducts ?? [])[0]?.status === PreOrderProductEnum.ACTIVE
          ? OrderEnum.PRE_ORDER
          : OrderEnum.NORMAL,
    [useProductData?.data?.preOrderProducts, useProductData?.data?.productDiscounts],
  )

  const productClassifications = useMemo(() => {
    return event === OrderEnum.FLASH_SALE
      ? useProductData?.data?.productDiscounts?.[0]?.productClassifications
      : event === OrderEnum.PRE_ORDER
        ? useProductData?.data?.preOrderProducts?.[0]?.productClassifications
        : useProductData?.data?.productClassifications
  }, [event, useProductData?.data])

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

  const reviews = [
    {
      id: 'rev1',
      author: 'Jane Doe',
      reviewUpdatedAt: '2024-11-17T12:34:56Z',
      classification: 'Electronics',
      numberOfItem: 1,
      title: 'Amazing Noise-Canceling Headphones',
      reviewDescription:
        'These headphones are fantastic! The sound quality is incredible, and the noise-canceling feature works like a charm. Highly recommend!',
      images: [
        {
          id: 'img1',
          image: 'https://i.pinimg.com/736x/c9/74/71/c97471cc7179e3164dfacba52cf957ea.jpg',
        },
        {
          id: 'img2',
          image: 'https://i.pinimg.com/736x/c9/74/71/c97471cc7179e3164dfacba52cf957ea.jpg',
        },
      ],
      rating: 4.8,
      brandName: 'AudioPro',
      updatedAt: '2024-11-17T12:34:56Z',
      description:
        'AudioPro is a leading brand in sound technology, offering premium quality audio devices designed for music enthusiasts.',
      brandLogo: 'https://i.pinimg.com/736x/d2/b4/7f/d2b47f1580b061d66b7f6b436d431228.jpg',
    },
    {
      id: 'rev2',
      author: 'John Smith',
      reviewUpdatedAt: '2024-11-16T15:22:30Z',
      classification: 'Home Appliances',
      numberOfItem: 1,
      title: 'Efficient and Quiet Vacuum Cleaner',
      reviewDescription:
        "This vacuum cleaner exceeded my expectations. It's quiet, powerful, and easy to use. Great for pet owners!",
      images: [],
      rating: 4.5,
      brandName: 'CleanMaster',
      updatedAt: '2024-11-16T15:22:30Z',
      description: 'CleanMaster provides innovative cleaning solutions for modern households.',
      brandLogo: 'https://i.pinimg.com/736x/d2/b4/7f/d2b47f1580b061d66b7f6b436d431228.jpg',
    },
    {
      id: 'rev3',
      author: 'Emily Clark',
      reviewUpdatedAt: '2024-11-15T10:12:45Z',
      classification: 'Fashion',
      numberOfItem: 3,
      title: 'Stylish and Comfortable Sneakers',
      reviewDescription:
        'These sneakers are not only stylish but also super comfortable for daily wear. Worth every penny!',
      images: [
        {
          id: 'img4',
          image: 'https://i.pinimg.com/736x/c9/74/71/c97471cc7179e3164dfacba52cf957ea.jpg',
        },
      ],
      rating: 4.7,
      brandName: 'UrbanFeet',
      updatedAt: '2024-11-15T10:12:45Z',
      description: 'UrbanFeet is dedicated to creating fashionable and functional footwear for every lifestyle.',
      brandLogo: 'https://i.pinimg.com/736x/d2/b4/7f/d2b47f1580b061d66b7f6b436d431228.jpg',
    },
    {
      id: 'rev4',
      author: 'Michael Johnson',
      reviewUpdatedAt: '2024-11-14T18:45:10Z',
      classification: 'Sports Equipment',
      numberOfItem: 1,
      title: 'High-Performance Basketball',
      reviewDescription: 'This basketball has great grip and durability. Perfect for both indoor and outdoor courts.',
      images: [],
      rating: 4.6,
      brandName: 'ProPlay',
      updatedAt: '2024-11-14T18:45:10Z',
      description: 'ProPlay specializes in premium sports equipment designed for athletes of all levels.',
      brandLogo: 'https://i.pinimg.com/736x/d2/b4/7f/d2b47f1580b061d66b7f6b436d431228.jpg',
    },
    {
      id: 'rev5',
      author: 'Sophia Martinez',
      reviewUpdatedAt: '2024-11-13T09:30:20Z',
      classification: 'Beauty',
      numberOfItem: 2,
      title: 'Luxury Skincare Set',
      reviewDescription:
        'This skincare set has transformed my skin! The moisturizer is especially hydrating without being greasy.',
      images: [
        {
          id: 'img6',
          image: 'https://i.pinimg.com/736x/c9/74/71/c97471cc7179e3164dfacba52cf957ea.jpg',
        },
        {
          id: 'img7',
          image: 'https://i.pinimg.com/736x/c9/74/71/c97471cc7179e3164dfacba52cf957ea.jpg',
        },
      ],
      rating: 4.9,
      brandName: 'GlowSkin',
      updatedAt: '2024-11-13T09:30:20Z',
      description: 'GlowSkin offers luxurious skincare products formulated with natural ingredients for radiant skin.',
      brandLogo: 'https://i.pinimg.com/736x/d2/b4/7f/d2b47f1580b061d66b7f6b436d431228.jpg',
    },
  ]
  const reviewSectionRef = useRef<HTMLDivElement | null>(null)

  const scrollToReviews = () => {
    reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  console.log('test', productClassifications, chosenClassification)

  return (
    <div className="w-full mx-auto px-4 py-5">
      {isFetching && <LoadingContentLayer />}
      {/* product information */}
      <div className="w-full lg:px-20 md:px-10 sm:px-8 px-3 space-y-3 ">
        <CustomBreadcrumb dynamicSegments={[{ segment: useProductData?.data?.name ?? t('productDetail.title') }]} />
        {!isFetching && useProductData && useProductData?.data && (
          <>
            <div className="flex gap-2 w-full">
              {/* product image carousel */}
              <div className="shadow-sm p-3 bg-white rounded-lg w-[calc(30%-8px)] sticky top-0 max-h-fit">
                <ProductCarousel product={useProductData?.data} />
              </div>

              {/* product detail information */}
              <div className="w-[calc(50%-8px)]">
                <ProductDetailInformation
                  product={useProductData?.data}
                  scrollToReviews={scrollToReviews}
                  productClassifications={productClassifications}
                  cheapestClassification={cheapestClassification}
                  event={event}
                  chosenClassification={chosenClassification}
                  setChosenClassification={setChosenClassification}
                  hasCustomType={hasCustomType ?? false}
                />
              </div>
              {/* call to action */}
              <div className="shadow-sm p-3 bg-white rounded-lg w-[calc(20%-8px)] sticky top-0 max-h-fit">
                <ProductDetailAction
                  product={useProductData?.data}
                  chosenClassification={chosenClassification}
                  discount={
                    event === OrderEnum.FLASH_SALE ? useProductData?.data?.productDiscounts?.[0]?.discount : undefined
                  }
                  discountType={DiscountTypeEnum.PERCENTAGE}
                  hasCustomType={hasCustomType ?? false}
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
              <ReviewOverall />
              <div>
                <div className="border-b border-gray-200">
                  <ReviewFilter />
                </div>
                <div className="p-4">
                  {reviews.map((review) => (
                    <ReviewSection
                      key={review.id}
                      author={review.author}
                      reviewUpdatedAt={review.reviewUpdatedAt}
                      classification={review.classification}
                      numberOfItem={review.numberOfItem}
                      title={review.title}
                      reviewDescription={review.reviewDescription}
                      images={review.images}
                      rating={review.rating}
                      brandName={review.brandName}
                      updatedAt={review.updatedAt}
                      description={review.description}
                      brandLogo={review.brandLogo}
                    />
                  ))}
                </div>
                <APIPagination currentPage={1} onPageChange={() => {}} totalPages={5} />
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
