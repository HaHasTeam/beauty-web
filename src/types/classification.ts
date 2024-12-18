import { IImage } from './image'
import { IProduct } from './product'
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
  status: string
  images: IImage[]
  product: IProduct
}

export enum ClassificationStatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
}
