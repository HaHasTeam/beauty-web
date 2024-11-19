import { ChevronDown } from 'lucide-react'

import { Ratings } from '../ui/rating'

interface ProductStarProps {
  rating: number
  ratingAmount: number
}
const ProductStar = ({ rating, ratingAmount }: ProductStarProps) => {
  return (
    <div>
      <div className="flex gap-1 items-center w-full">
        <Ratings rating={rating} size={13} variant="yellow" />
        <ChevronDown size={11} />
        <span className="text-sm">({ratingAmount})</span>
      </div>
    </div>
  )
}

export default ProductStar
