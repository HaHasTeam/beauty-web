import { IBooking, IBookingFilter } from '@/types/booking'
import { TServerResponse } from '@/types/request'
import { toQueryFetcher } from '@/utils/query'
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
