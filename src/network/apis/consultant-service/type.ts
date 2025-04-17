import { BaseFilterParams } from '@/types/request'

export type FilterConsultantServiceParams = BaseFilterParams & {
  price?: number
  systemServiceId?: string
  accountIds?: string
  statuses?: string
}

export type GetConsultantServicesParams = {
  consultantId: string
}

export type GetConsultantServiceByIdParams = {
  id: string
}
