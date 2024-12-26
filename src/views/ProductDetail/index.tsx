import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import BrandSection from '@/components/brand/BrandSection'
import CustomBreadcrumb from '@/components/breadcrumb/CustomBreadcrumb'
import ReviewFilter from '@/components/filter/ReviewFilter'
import APIPagination from '@/components/pagination/Pagination'
import ProductCarousel from '@/components/product/ProductCarousel'
import ProductDetailAction from '@/components/product/ProductDetailAction'
import ProductDetailInformation from '@/components/product/ProductDetailInformation'
import ReviewOverall from '@/components/reviews/ReviewOverall'
import ReviewSection from '@/components/reviews/ReviewSection'
import { IClassification } from '@/types/classification'
import { IProduct } from '@/types/product'

const ProductDetail = () => {
  const { productId } = useParams()
  console.log(productId)
  const product: IProduct = {
    id: '10',
    name: 'Cherry Blossom Serum',
    tag: 'Best Seller',
    price: 29.99,
    currentPrice: 20.09,
    images: [
      { id: '0', image: 'https://i.pinimg.com/736x/64/8d/d1/648dd13916b0cb608877e4674ef99c24.jpg' },
      { id: '1', image: 'https://i.pinimg.com/736x/67/54/ba/6754baa52b96d4a820e0fad84efefcf0.jpg' },
      { id: '2', image: 'https://i.pinimg.com/736x/f1/0f/fe/f10ffe8ba580fefb88cb44f8837add67.jpg' },
      { id: '3', image: 'https://i.pinimg.com/736x/13/da/ae/13daaeee2b1ab5948c7044e4e37983ed.jpg' },
      { id: '4', image: 'https://i.pinimg.com/736x/b8/61/de/b861de524383302e0ce9c5c35c5bad6a.jpg' },
      { id: '5', image: 'https://i.pinimg.com/736x/06/63/86/0663861011db30d5368c872202eafa7f.jpg' },
    ],
    deal: 0.33,
    flashSale: {
      productAmount: 100,
      soldAmount: 65,
    },
    rating: 4.5,
    ratingAmount: 250,
    soldInPastMonth: 300,
    description:
      "Unveil a radiant and youthful glow with our Cherry Blossom Serum – a luxurious skincare essential for those seeking to refresh and rejuvenate their skin. Formulated with natural extracts, this serum is designed to hydrate and nourish your skin, helping to reduce the appearance of fine lines, blemishes, and uneven skin tone.\n\nKey Benefits:\n- Deep Hydration: Keeps your skin moisturized all day long, leaving it feeling soft and smooth.\n- Anti-aging: Packed with antioxidants that fight the signs of aging, giving you a youthful and refreshed look.\n- Brightening: Helps even out skin tone and promotes a radiant, glowing complexion.\n- Lightweight Formula: Absorbs quickly, leaving no greasy residue – perfect for all skin types.\n\nPerfect for daily use, the Cherry Blossom Serum combines the delicate essence of cherry blossoms with powerful skin-nourishing ingredients, making it an ideal addition to your skincare routine.\n\nWith a 4.5-star rating from over 250 reviews, our customers rave about its effectiveness in brightening and revitalizing the skin. Whether you're dealing with dryness, dullness, or fine lines, this serum offers the perfect solution.\n\nPrice:\n- Regular Price: $29.99\n- Current Price: $20.09 (Save 33%)\n\nDon't miss out – stock is limited, with only 100 units available, and 65 sold already. Get yours today and experience the magic of cherry blossoms!",
    classifications: [
      {
        id: '0',
        name: 'Rose',
        image: '',
      },
      {
        id: '1',
        name: 'Bold Rose',
        image: '',
      },
      {
        id: '2',
        name: 'Semi Rose',
        image: '',
      },
      {
        id: '3',
        name: 'Thin Rose',
        image: '',
      },
    ],
  }
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
  const [classification, setClassification] = useState<IClassification>(product.classifications[0])
  return (
    <div className="w-full mx-auto px-4 py-5 ">
      {/* product information */}
      <div className="w-full lg:px-20 md:px-10 sm:px-8 px-3 space-y-3 ">
        <CustomBreadcrumb dynamicSegments={[{ segment: product.name ?? '' }]} />
        <div className="flex gap-2 w-full">
          {/* product image carousel */}
          <div className="shadow-sm p-3 bg-white rounded-lg w-[calc(30%-8px)]">
            <ProductCarousel product={product} />
          </div>

          {/* product detail information */}
          <div className="w-[calc(50%-8px)]">
            <ProductDetailInformation product={product} scrollToReviews={scrollToReviews} />
          </div>
          {/* call to action */}
          <div className="shadow-sm p-3 bg-white rounded-lg w-[calc(20%-8px)]">
            <ProductDetailAction product={product} chosenClassification={classification} />
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
      </div>
    </div>
  )
}

export default ProductDetail
