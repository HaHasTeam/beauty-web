import { TMetaData } from './request'

export type TWallet = TMetaData & {
  balance: number
  availableBalance: number
}
