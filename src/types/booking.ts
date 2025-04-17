import { TBrand } from './brand'
import { IConsultantService } from './consultant-service'
import { BookingStatusEnum, BookingTypeEnum } from './enum'
import { PaymentMethodEnum } from './payment'
import { TMetaData } from './request'
import { ISlot } from './slot'
import { IStatusTracking } from './statusTracking'
import { TUser } from './user'
import { TVoucher } from './voucher'

export type IBooking = TMetaData & {
  totalPrice: number
  startTime: string
  endTime: string
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

export interface IBookingFilter {
  statuses?: string
  search?: string
}

export interface IConsultant {
  id: string
  firstName: string
  lastName: string
  username: string
  avatar: string | null
  email: string
  gender: string | null
  phone: string | null
  dob: string | null
  status: string
  yoe: number | null
}

export interface ISystemService {
  id: string
  name: string
  description: string
  type: string
  status: string
}

export interface IServiceQuestion {
  id: string
  question: string
  orderIndex: number
  mandatory: boolean
  answers: Record<string, string>
  type: string
  status: string
  images: {
    id: string
    name: string
    fileUrl: string
    status: string
  }[]
}

export interface IServiceBookingForm {
  id: string
  title: string
  status: string
  questions: IServiceQuestion[]
}

export interface IBookingFormAnswer {
  id: string
  form: {
    type: string
    images: {
      name: string
      fileUrl: string
    }[]
    answers: Record<string, string>
    question: string
    mandatory: boolean
    orderIndex: number
  }[]
  answers: {
    answers: Record<string, string>
    question: string
    orderIndex: number
    images?: {
      name: string
      fileUrl: string
    }[]
  }[]
}

export interface IConsultationResult {
  id: string
  criteria: {
    section: string
    orderIndex: number
  }[]
  results: {
    answers: string
    section: string
    orderIndex: number
    images?: {
      name: string
      fileUrl: string
    }[]
  }[]
  suggestedProductClassifications: {
    name: string
    productClassificationId: string
  }[]
}

export interface IBookingSlot {
  id: string
  weekDay: number
  startTime: string
  endTime: string
  isActive: boolean
}

export type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  resource: IBooking
}

export interface TSlot {
  id: string
  startTime: string
  endTime: string
  isAvailable: boolean
  consultantId: string
  serviceId: string
  date: string
  status: 'AVAILABLE' | 'BOOKED' | 'CANCELLED'
  createdAt: string
  updatedAt: string
}
