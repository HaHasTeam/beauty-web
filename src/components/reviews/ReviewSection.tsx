import BrandAnswer from './BrandAnswer'
import CustomerReview from './CustomerReview'

interface ReviewSectionProps {
  author: string
  reviewUpdatedAt: string
  classification: string
  numberOfItem: number
  title: string
  reviewDescription: string
  images: { id: string; image: string }[]
  rating: number
  brandName: string
  updatedAt: string
  description: string
  brandLogo: string | null
}
const ReviewSection = ({
  author,
  reviewUpdatedAt,
  classification,
  numberOfItem,
  title,
  rating,
  reviewDescription,
  images,
  brandName,
  updatedAt,
  description,
  brandLogo,
}: ReviewSectionProps) => {
  return (
    <div className="w-full border-b border-gray-200 px-3 py-4 flex flex-col gap-5">
      <CustomerReview
        author={author}
        updatedAt={reviewUpdatedAt}
        classification={classification}
        numberOfItem={numberOfItem}
        title={title}
        description={reviewDescription}
        images={images}
        rating={rating}
      />
      <BrandAnswer brandName={brandName} updatedAt={updatedAt} description={description} brandLogo={brandLogo} />
    </div>
  )
}

export default ReviewSection
