import { IClassification } from './classification.interface'

type IProductImage = {
  id: string
  image: string
}

export type IProduct = {
  id: string
  name: string
  tag?: string
  price: number
  currentPrice?: number
  images: IProductImage[]
  deal?: number
  flashSale?: {
    productAmount: number
    soldAmount?: number
  }
  rating: number
  ratingAmount: number
  soldInPastMonth: number
  description: string
  classifications: IClassification[]
}
