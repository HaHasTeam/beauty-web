import { AddressEnum } from './enum'

export interface IAddress {
  id?: string
  createdAt?: string
  updatedAt?: string
  fullName: string
  phoneNumber: string
  detailAddress: string
  ward?: string
  district?: string
  province?: string
  fullAddress?: string
  type?: AddressEnum.HOME | AddressEnum.OFFICE | AddressEnum.OTHER
  status?: string
  isDefault?: boolean
}
