type IProductImage = {
  id: string
  image: string
}

export type IProductCard = {
  id: string
  name: string
  tag?: string
  price?: number
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
}
