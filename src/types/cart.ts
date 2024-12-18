import { IProductCart } from './product'

export type ICart = {
  id: string
  brandName: string
  products: IProductCart[]
}
