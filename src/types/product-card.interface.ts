export type IProductCard = {
  id: string
  name: string
  tag?: string
  price?: number
  currentPrice?: number
  imageUrl: string
  deal?: number
  flashSale?: {
    productAmount: number
    soldAmount?: number
  }
  rating: number
  ratingAmount: number
  soldInPastMonth: number
}
