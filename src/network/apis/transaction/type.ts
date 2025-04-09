import { BaseFilterParams } from '@/types/request'
import { TransactionStatusEnum, TransactionTypeEnum } from '@/types/transaction'

export type TGetFilteredTransactionsParams = BaseFilterParams & {
  types?: TransactionTypeEnum[]
  statuses?: TransactionStatusEnum[]
  startDate?: string
  endDate?: string
}

export enum PAY_TYPE {
  ORDER = 'ORDER',
  BOOKING = 'BOOKING',
}
