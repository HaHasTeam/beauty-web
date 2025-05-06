import { BrandStatusEnum, IBranch } from '@/types/brand'
import { TBaseFilterRequestParams } from '@/types/types'

export type TRequestCreateBrandParams = IBranch

export type TGetBrandByIdRequestParams = {
  brandId: string
}
export type TUpdateStatusBrandRequestParams = TGetBrandByIdRequestParams & {
  reason: string
  status: string
}

export type TUpdateBrandRequestParams = TGetBrandByIdRequestParams & IBranch

export type FilterParamBrands = TBaseFilterRequestParams & {
  name?: string
  reviewerId?: string
  statuses?: BrandStatusEnum[]
}
