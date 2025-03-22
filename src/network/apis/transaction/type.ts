import { TransactionStatusEnum, TransactionTypeEnum } from '@/types/transaction'

export type TGetFilteredTransactionsParams = {
  type?: TransactionTypeEnum
  status?: TransactionStatusEnum
  startDate?: string
  endDate?: string
}
