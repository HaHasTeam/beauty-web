import { IClassification } from './classification'
import { TUser } from './user'
import { TVoucher } from './voucher'

export interface IOrderDetail {
  platformVoucherDiscount: number
  shopVoucherDiscount: number
  id: string
  createdAt: string
  updatedAt: string
  subTotal: number
  totalPrice: number
  quantity: number
  type: string | null
  isFeedback: boolean
  productClassification: IClassification
  productClassificationPreOrder: null | IClassification
}

export interface IOrderItem {
  platformVoucherDiscount: number
  shopVoucherDiscount: number
  id: string
  createdAt: string
  updatedAt: string
  subTotal: number
  totalPrice: number
  shippingAddress: string
  phone: string
  paymentMethod: string
  notes: string
  type: string
  status: string
  orderDetails: IOrderDetail[]
  voucher: null | TVoucher
}

export type IOrder = {
  platformVoucherDiscount: number
  shopVoucherDiscount: number
  id: string
  createdAt: string
  updatedAt: string
  subTotal: number
  totalPrice: number
  shippingAddress: string
  phone: string
  paymentMethod: string
  notes: string
  type: string
  status: string
  account: TUser
  children: IOrderItem[]
}

export type IOrderFilter = {
  search?: string
  status?: string
}
