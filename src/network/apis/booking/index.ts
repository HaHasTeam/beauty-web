import { IBooking, IBookingFilter , TSlot } from '@/types/booking'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

export const getMyBookingList = toQueryFetcher<void, TServerResponse<IBooking[]>>('getMyBookingList', async () => {
  return privateRequest('/bookings/get-my-bookings')
})

export const getMyBookingsApi = toQueryFetcher<IBookingFilter, TServerResponse<IBooking[]>>(
  'getMyBookingsApi',
  async (filter) => {
    return privateRequest('/bookings/get-my-bookings', {
      params: filter,
    })
  },
)

// API endpoint for Allure service to get user's bookings
export const getAllureMyBookingsApi = toQueryFetcher<IBookingFilter, TServerResponse<IBooking[]>>(
  'getAllureMyBookingsApi',
  async (filter) => {
    return privateRequest('/bookings/get-my-bookings', {
      params: filter,
    })
  },
)

export type TGetSlotParams= {
    startDate: string
    endDate: string
    id?: string
  }

export const getSomeoneSlotApi = toQueryFetcher<
  TGetSlotParams,
  TServerResponse<TSlot[]>
>('getSomeoneSlotApi', async (data) => {
  return privateRequest(`/bookings/get-someone-slots/${data?.id}`, {
    method: 'POST',
    data: data
  })
})

export interface ICreateBookingParams {
  totalPrice: number
  startTime?: string
  endTime?: string
  type: string
  slot?: string
  paymentMethod: string
  consultantService: string
}

export const createBookingApi = toMutationFetcher<
  ICreateBookingParams,
  TServerResponse<IBooking>
>('createBookingApi', async (data) => {
  return privateRequest('/bookings/', {
    method: 'POST',
    data: data
  })
})

export interface ICancelBookingParams {
  reason?: string
}

// API endpoint to cancel a booking
