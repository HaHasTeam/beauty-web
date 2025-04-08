import { IReport, ReportTypeEnum } from '@/types/report'

export type TGetFilteredReportRequestParams = {
  type?: ReportTypeEnum
  status?: ReportTypeEnum
  assigneeId?: string
  page?: number
  pageSize?: number
}

export type TCreateReportRequestParams = Pick<IReport, 'type' | 'reason'> & {
  orderId?: string
  bookingId?: string
  transactionId?: string
  files: string[]
}
