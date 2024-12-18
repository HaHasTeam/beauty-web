import { IClassification, TClassification } from './classification'
import { TUser } from './user'
import { TVoucher } from './voucher'

interface OrderDetail {
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
  productClassification: TClassification
  productClassificationPreOrder: null | IClassification
}

export interface OrderItem {
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
  orderDetails: OrderDetail[]
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
  children: OrderItem[]
}
