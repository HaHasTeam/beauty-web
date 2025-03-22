import { TBrand } from './brand'
import { IConsultantService } from './consultant-service'
import { PaymentMethodEnum } from './payment'
import { TMetaData } from './request'
import { ISlot } from './slot'
import { IStatusTracking } from './statusTracking'
import { TUser } from './user'
import { TVoucher } from './voucher'

export type IBooking = TMetaData & {
  totalPrice: number
  startTime: Date
  endTime: Date
  voucherDiscount: number
  paymentMethod: PaymentMethodEnum
  notes: string
  meetUrl: string
  record: string
  type: BookingTypeEnum
  status: BookingStatusEnum
  voucher: TVoucher
  slot: ISlot
  account: TUser
  brand: TBrand
  assigneeToInterview: TUser
  resultNote: string
  consultantService: IConsultantService
  statusTrackings: IStatusTracking[]
  report: Report
}
export enum BookingTypeEnum {
  SERVICE = 'SERVICE',
  INTERVIEW = 'INTERVIEW',
}

export enum BookingStatusEnum {
  TO_PAY = 'TO_PAY',
  WAIT_FOR_CONFIRMATION = 'WAIT_FOR_CONFIRMATION',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  SERVICE_BOOKING_FORM_SUBMITED = 'SERVICE_BOOKING_FORM_SUBMITED',
  SENDED_RESULT_SHEET = 'SENDED_RESULT_SHEET',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}
