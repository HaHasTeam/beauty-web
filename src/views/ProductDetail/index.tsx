import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
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

const ProductDetail = () => {
  const { productId } = useParams()
  const { t } = useTranslation()
  console.log(productId)
  const { data: useProductData, isFetching } = useQuery({
    queryKey: [getProductApi.queryKey, productId as string],
    queryFn: getProductApi.fn,
  })

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [classification, setClassification] = useState<IClassification>(useProductData?.data?.productClassifications[0])

  return (
    <div className="w-full mx-auto px-4 py-5 ">
      {isFetching && <LoadingContentLayer />}
      {/* product information */}
      <div className="w-full lg:px-20 md:px-10 sm:px-8 px-3 space-y-3 ">
        <CustomBreadcrumb dynamicSegments={[{ segment: useProductData?.data?.name ?? t('productDetail.title') }]} />
        {!isFetching && useProductData && useProductData?.data ? (
          <>
            <div className="flex gap-2 w-full">
              {/* product image carousel */}
              <div className="shadow-sm p-3 bg-white rounded-lg w-[calc(30%-8px)]">
                <ProductCarousel product={useProductData?.data} />
              </div>

              {/* product detail information */}
              <div className="w-[calc(50%-8px)]">
                <ProductDetailInformation product={useProductData?.data} scrollToReviews={scrollToReviews} />
              </div>
              {/* call to action */}
              <div className="shadow-sm p-3 bg-white rounded-lg w-[calc(20%-8px)]">
                <ProductDetailAction product={useProductData?.data} chosenClassification={classification} />
              </div>
            </div>

            {/* product brand */}
            <BrandSection />

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
        ) : (
          <Empty title={t('empty.productDetail.title')} description={t('empty.productDetail.description')} />
        )}
      </div>
    </div>
  )
}

export default ProductDetail
