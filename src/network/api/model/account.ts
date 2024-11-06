import { GenderEnum, RoleEnum, StatusEnum } from '@/types/enum'

export interface IAccount {
  firstName: string

  lastName: string

  username: string

  email: string

  password: string

  role: RoleEnum

  gender: GenderEnum

  phone: string

  dob: Date

  avatar: string

  status: StatusEnum
}
