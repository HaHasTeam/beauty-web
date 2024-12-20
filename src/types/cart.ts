import { IClassification } from './classification'
import { IProductCart } from './product'

export type ICart = {
  id: string
  brandName: string
  products: IProductCart[]
}

export interface ICartItem {
  id: string
  createdAt: string
  updatedAt: string
  quantity: number
  classification: string
  status: 'ACTIVE' | 'INACTIVE'
  productClassification: IClassification
}

export interface ICartByBrand {
  [brandName: string]: ICartItem[]
}
