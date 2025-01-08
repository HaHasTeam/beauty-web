import { StatusEnum } from './enum'
import { IImage } from './image'
import { IPreOrder } from './pre-order'
import { IProduct } from './product'
import { IProductDiscount } from './product-discount'
import { TMetaData } from './request'

export type TClassification = TMetaData & {
  title: string
  price: number
  quantity: number
  image: string | null
  status: ClassificationStatusEnum
}

export type IClassification = {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  price: number
  quantity: number
  sku: string
  type: string
  status?: StatusEnum.ACTIVE | StatusEnum.INACTIVE
  images: IImage[]
  product: IProduct
  preOrderProduct?: IPreOrder | null
  productDiscount?: IProductDiscount | null
}

export enum ClassificationStatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
}
