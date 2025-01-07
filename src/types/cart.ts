import { IClassification } from './classification'
import { StatusEnum } from './enum'
import { IProductCart } from './product'

export type ICart = {
  id: string
  brandName: string
  products: IProductCart[]
}

export interface ICartItem {
  id: string
  createdAt?: string
  updatedAt?: string
  quantity: number
  classification?: string
  status?: StatusEnum.ACTIVE | StatusEnum.INACTIVE
  productClassification: IClassification
}
export interface ICreateCartItem {
  id: string
  classification?: string
  productClassification?: string
  quantity?: number
}

export interface ICartByBrand {
  [brandName: string]: ICartItem[]
}

export interface IRemoveCartItem {
  itemIds: string[]
}
