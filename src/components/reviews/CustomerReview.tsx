import { UserCircle } from 'lucide-react'

import { Ratings } from '../ui/rating'

interface CustomerReviewProps {
  author: string
  updatedAt: string
  classification: string
  numberOfItem: number
  title: string
  description: string
  images: { id: string; image: string }[]
  rating: number
}
const CustomerReview = ({
  author,
  updatedAt,
  classification,
  numberOfItem,
  title,
  rating,
  description,
  images,
}: CustomerReviewProps) => {
  return (
    <div className="flex flex-col gap-1">
      <div>
        <div className="flex gap-3">
          <UserCircle />
          <span className="font-semibold">{author}</span>
        </div>
        <div>
          <span className="text-gray-500 text-sm">{updatedAt}</span>
        </div>
      </div>
      <div className="flex gap-3">
        <Ratings rating={rating} variant="yellow" size={13} />
        <span className="font-semibold">{title}</span>
      </div>
      <div className="flex gap-2 text-sm text-gray-500">
        <div>
          <span>Classification: </span>
          <span>{classification}</span>
        </div>
        <div className="border-l border-gray-200 px-2">
          <span>Number of item: </span>
          <span>{numberOfItem}</span>
        </div>
      </div>
      <div>
        <p>{description}</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {images.map((item) => (
          <div className="w-24 h-24" key={item?.id}>
            <img src={item.image} className="object-cover w-full h-full rounded-md" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomerReview
