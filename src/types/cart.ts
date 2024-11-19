import { IProductCart } from './product.interface'

export type ICart = {
  id: string
  brandName: string
  products: IProductCart[]
}
