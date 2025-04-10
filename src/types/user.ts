import { IAddress } from './address'
import { IBrand } from './brand'
import { RoleEnum } from './enum'
import { TMetaData } from './request'
import { TRoleResponse } from './role'

export enum UserGenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  BANNED = 'BANNED',
}

export enum UserRoleEnum {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CONSULTANT = 'CONSULTANT',
  CUSTOMER = 'CUSTOMER',
}

// Interface cho user trong web
export interface IUser {
  id: string
  email: string
  displayName: string
  role: RoleEnum
  brandId?: string // Only for brand roles
}

// Type cho user trong management
export type TUser = TMetaData & {
  firstName?: string
  lastName?: string
  username: string
  email: string
  password?: string
  role: UserRoleEnum | string
  gender?: UserGenderEnum | string
  phone?: string
  dob?: string
  avatar?: string
  status: UserStatusEnum | string
  isEmailVerify: boolean
  brands?: IBrand[]
  description?: string
  majorTitle?: string
  introduceVideo?: string
  yoe?: number
  brand?: IBrand[]
  addresses?: IAddress[]
}

// Type cho user response
export type TUserResponse = TUser & {
  createdAt: string
  updatedAt: string
}

// Type cho user với đầy đủ thông tin
export type TUserFull = Omit<TUser, 'role'> & {
  role: TRoleResponse
}

// Type cho user với địa chỉ
export type TUserWithAddress = TUser & {
  addresses?: IAddress[]
}

// Type cho user feedback
export type TUserFeedback = TMetaData & {
  firstName?: string
  lastName?: string
  username: string
  email: string
  password: string
  role: TRoleResponse
  gender?: UserGenderEnum | string
  phone?: string
  dob?: string
  avatar?: string
  status: UserStatusEnum | string
  isEmailVerify: boolean
  brands?: IBrand[]
}

// Type cho user update status tracking
export type TUserUpdateStatusTracking = TMetaData & {
  firstName?: string
  lastName?: string
  username: string
  email: string
  password: string
  role: TRoleResponse
  gender?: UserGenderEnum | string
  phone?: string
  dob?: string
  avatar?: string
  status: UserStatusEnum | string
  isEmailVerify: boolean
  brands?: IBrand[]
}
