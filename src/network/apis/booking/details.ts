import { axiosWithToken } from '@/network/api'
import { IBooking } from '@/types/booking'
import { TServerResponse } from '@/types/request'
import { IStatusTracking } from '@/types/statusTracking'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'

// Get booking details by ID
export const getBookingByIdApi = toQueryFetcher<string, TServerResponse<IBooking>>(
  'getBookingById',
  async (bookingId) => {
    const response = await axiosWithToken.get(`/bookings/${bookingId}`)
    return response.data
  },
)

// Get booking status tracking
export const getBookingStatusTrackingApi = toQueryFetcher<string, TServerResponse<IStatusTracking[]>>(
  'getBookingStatusTracking',
  async (bookingId) => {
    const response = await axiosWithToken.get(`/bookings/status-tracking/${bookingId}`)
    return response.data
  },
)

// Update booking status
interface UpdateBookingStatusParams {
  id: string
  status: string
}

export const updateBookingStatusApi = toMutationFetcher<UpdateBookingStatusParams, TServerResponse<IBooking>>(
  'updateBookingStatus',
  async ({ id, status }) => {
    const response = await axiosWithToken.patch(`/bookings/${id}/status`, { status })
    return response.data
  },
)

// Cancel booking
interface CancelBookingParams {
  bookingId: string
  reason: string
}

export const cancelBookingApi = toMutationFetcher<CancelBookingParams, TServerResponse<IBooking>>(
  'cancelBooking',
  async ({ bookingId, reason }) => {
    const response = await axiosWithToken.patch(`/bookings/${bookingId}/cancel`, { reason })
    return response.data
  },
)
