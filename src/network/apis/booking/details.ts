import { z } from 'zod'

import { BookingFormAnswerUpdateSchema, ConsultationResultSchema } from '@/schemas/booking.schema'
import { IBooking } from '@/types/booking'
import { TServerResponse } from '@/types/request'
import { IStatusTracking } from '@/types/statusTracking'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

// Get booking details by ID
export const getBookingByIdApi = toQueryFetcher<string, TServerResponse<IBooking>>(
  'getBookingById',
  async (bookingId) => {
    return privateRequest(`/bookings/get-by-id/${bookingId}`)
  },
)

// Get booking status tracking
export const getBookingStatusTrackingApi = toQueryFetcher<string, TServerResponse<IStatusTracking[]>>(
  'getBookingStatusTracking',
  async (bookingId) => {
    return await privateRequest(`/bookings/status-tracking/${bookingId}`)
  },
)

// Update booking status
interface UpdateBookingStatusParams {
  id: string
  status: string
  bookingFormAnswer?: z.infer<typeof BookingFormAnswerUpdateSchema>
  consultationResult?: z.infer<typeof ConsultationResultSchema>
  mediaFiles?: string[]
  resultNote?: string
}

export const updateBookingStatusApi = toMutationFetcher<UpdateBookingStatusParams, TServerResponse<IBooking>>(
  'updateBookingStatus',
  async ({ id, status, bookingFormAnswer, consultationResult, mediaFiles, resultNote }) => {
    return privateRequest(`/bookings/update-booking-status/${id}`, {
      method: 'PUT',
      data: {
        status,
        bookingFormAnswer: bookingFormAnswer ? bookingFormAnswer : undefined,
        consultationResult: consultationResult ? consultationResult : undefined,
        mediaFiles: mediaFiles ? mediaFiles : undefined,
        resultNote: resultNote ? resultNote : undefined,
      },
    })
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
    return privateRequest(`/bookings/cancelled-booking/${bookingId}`, {
      method: 'PUT',
      data: {
        reason,
      },
    })
  },
)
