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
