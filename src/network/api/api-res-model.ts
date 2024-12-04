import { TAuth } from '@/types'

export interface resBaseInfo<DataModel> {
  rsCode: string
  rsCause: string
  data: DataModel
}

export interface GetCityTotalNumberModel {
  city: string
  peoplesOfLogin: number
}

export type GetCityTotal = GetCityTotalNumberModel[]

export type LoginResponse = TAuth
export interface IToken {
  accountId: string
  iat: number
  exp: number
}
