import { axiosWithToken } from '@/network/api'
import { IBooking } from '@/types/booking'
import { BookingStatusEnum } from '@/types/enum'
import { TServerResponse } from '@/types/request'
import { IStatusTracking } from '@/types/statusTracking'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

const mockBookings: IBooking[] = [
  // TO_PAY booking
  {
    id: 'booking1001',
    createdAt: '2023-11-25T14:30:00Z',
    updatedAt: '2023-11-25T14:30:00Z',
    totalPrice: 450000,
    startTime: '2023-12-01T10:00:00Z',
    endTime: '2023-12-01T11:00:00Z',
    paymentMethod: 'CREDIT_CARD',
    notes: null,
    meetUrl: null,
    record: null,
    type: 'SERVICE',
    status: BookingStatusEnum.TO_PAY,
    resultNote: null,
    brand: null,
    consultantService: {
      id: 'cs1001',
      price: 450000,
      detail: 'Standard skin consultation service',
      status: 'ACTIVE',
      account: {
        id: 'user1001',
        firstName: 'Linh',
        lastName: 'Nguyen',
        username: 'linh.nguyen',
        avatar: 'https://i.pravatar.cc/150?img=32',
        email: 'linh.nguyen@example.com',
        gender: 'FEMALE',
        phone: '+84987654321',
        dob: '1992-05-15',
        status: 'ACTIVE',
        yoe: 5,
      },
      systemService: {
        id: 'ss1001',
        name: 'Skin Consultation',
        description: 'Comprehensive skin analysis with personalized recommendations',
        type: 'STANDARD',
        status: 'ACTIVE',
      },
      serviceBookingForm: {
        id: 'form1001',
        title: 'Skin Consultation Form',
        status: 'ACTIVE',
        questions: [],
      },
    },
    account: {
      id: 'user2001',
      firstName: 'Minh',
      lastName: 'Tran',
      username: 'minh.tran',
      avatar: 'https://i.pravatar.cc/150?img=67',
      email: 'minh.tran@example.com',
      gender: 'MALE',
      phone: '+84912345678',
      dob: '1995-08-20',
      status: 'ACTIVE',
      yoe: null,
    },
    slot: {
      id: 'slot1001',
      weekDay: 5,
      startTime: '10:00',
      endTime: '11:00',
      isActive: true,
    },
    bookingFormAnswer: null,
    consultationResult: null,
  },
  // WAIT_FOR_CONFIRMATION booking
  {
    id: 'booking1002',
    createdAt: '2023-11-26T09:15:00Z',
    updatedAt: '2023-11-26T09:15:00Z',
    totalPrice: 650000,
    startTime: '2023-12-03T14:00:00Z',
    endTime: '2023-12-03T15:30:00Z',
    paymentMethod: 'WALLET',
    notes: 'First time consultation',
    meetUrl: null,
    record: null,
    type: 'SERVICE',
    status: BookingStatusEnum.WAIT_FOR_CONFIRMATION,
    resultNote: null,
    brand: null,
    consultantService: {
      id: 'cs1002',
      price: 650000,
      detail: 'Premium hair care consultation',
      status: 'ACTIVE',
      account: {
        id: 'user1002',
        firstName: 'Hoa',
        lastName: 'Le',
        username: 'hoa.le',
        avatar: 'https://i.pravatar.cc/150?img=23',
        email: 'hoa.le@example.com',
        gender: 'FEMALE',
        phone: '+84987123456',
        dob: '1990-03-18',
        status: 'ACTIVE',
        yoe: 7,
      },
      systemService: {
        id: 'ss1002',
        name: 'Hair Care Consultation',
        description: 'Expert hair analysis and customized treatment recommendations',
        type: 'PREMIUM',
        status: 'ACTIVE',
      },
      serviceBookingForm: {
        id: 'form1002',
        title: 'Hair Care Consultation Form',
        status: 'ACTIVE',
        questions: [],
      },
    },
    account: {
      id: 'user2002',
      firstName: 'Lan',
      lastName: 'Pham',
      username: 'lan.pham',
      avatar: 'https://i.pravatar.cc/150?img=41',
      email: 'lan.pham@example.com',
      gender: 'FEMALE',
      phone: '+84901234567',
      dob: '1993-11-30',
      status: 'ACTIVE',
      yoe: null,
    },
    slot: {
      id: 'slot1002',
      weekDay: 0,
      startTime: '14:00',
      endTime: '15:30',
      isActive: true,
    },
    bookingFormAnswer: null,
    consultationResult: null,
  },
  // BOOKING_CONFIRMED booking
  {
    id: 'booking1003',
    createdAt: '2023-11-20T11:45:00Z',
    updatedAt: '2023-11-21T08:30:00Z',
    totalPrice: 550000,
    startTime: '2023-11-27T15:00:00Z',
    endTime: '2023-11-27T16:00:00Z',
    paymentMethod: 'BANK_TRANSFER',
    notes: null,
    meetUrl: 'https://meet.google.com/abc-defg-hij',
    record: null,
    type: 'SERVICE',
    status: BookingStatusEnum.BOOKING_CONFIRMED,
    resultNote: null,
    brand: null,
    consultantService: {
      id: 'cs1003',
      price: 550000,
      detail: 'Anti-aging skin consultation',
      status: 'ACTIVE',
      account: {
        id: 'user1003',
        firstName: 'Thu',
        lastName: 'Tran',
        username: 'thu.tran',
        avatar: 'https://i.pravatar.cc/150?img=29',
        email: 'thu.tran@example.com',
        gender: 'FEMALE',
        phone: '+84976543210',
        dob: '1988-07-12',
        status: 'ACTIVE',
        yoe: 8,
      },
      systemService: {
        id: 'ss1003',
        name: 'Anti-Aging Consultation',
        description: 'Specialized consultation focusing on anti-aging skincare',
        type: 'PREMIUM',
        status: 'ACTIVE',
      },
      serviceBookingForm: {
        id: 'form1003',
        title: 'Anti-Aging Consultation Form',
        status: 'ACTIVE',
        questions: [],
      },
    },
    account: {
      id: 'user2003',
      firstName: 'Tuan',
      lastName: 'Nguyen',
      username: 'tuan.nguyen',
      avatar: 'https://i.pravatar.cc/150?img=53',
      email: 'tuan.nguyen@example.com',
      gender: 'MALE',
      phone: '+84932165478',
      dob: '1991-04-25',
      status: 'ACTIVE',
      yoe: null,
    },
    slot: {
      id: 'slot1003',
      weekDay: 1,
      startTime: '15:00',
      endTime: '16:00',
      isActive: true,
    },
    bookingFormAnswer: null,
    consultationResult: null,
  },
  // SERVICE_BOOKING_FORM_SUBMITED booking
  {
    id: 'booking1004',
    createdAt: '2023-11-15T16:20:00Z',
    updatedAt: '2023-11-16T10:45:00Z',
    totalPrice: 500000,
    startTime: '2023-11-22T09:00:00Z',
    endTime: '2023-11-22T10:00:00Z',
    paymentMethod: 'CREDIT_CARD',
    notes: 'Concerned about acne issues',
    meetUrl: 'https://meet.google.com/jkl-mnop-qrs',
    record: null,
    type: 'SERVICE',
    status: BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED,
    resultNote: null,
    brand: null,
    consultantService: {
      id: 'cs1004',
      price: 500000,
      detail: 'Acne treatment consultation',
      status: 'ACTIVE',
      account: {
        id: 'user1004',
        firstName: 'Minh',
        lastName: 'Pham',
        username: 'minh.pham',
        avatar: 'https://i.pravatar.cc/150?img=12',
        email: 'minh.pham@example.com',
        gender: 'MALE',
        phone: '+84967890123',
        dob: '1994-09-08',
        status: 'ACTIVE',
        yoe: 4,
      },
      systemService: {
        id: 'ss1004',
        name: 'Acne Treatment Consultation',
        description: 'Specialized consultation for acne-prone skin',
        type: 'STANDARD',
        status: 'ACTIVE',
      },
      serviceBookingForm: {
        id: 'form1004',
        title: 'Acne Treatment Form',
        status: 'ACTIVE',
        questions: [],
      },
    },
    account: {
      id: 'user2004',
      firstName: 'Mai',
      lastName: 'Le',
      username: 'mai.le',
      avatar: 'https://i.pravatar.cc/150?img=31',
      email: 'mai.le@example.com',
      gender: 'FEMALE',
      phone: '+84945678901',
      dob: '1997-01-15',
      status: 'ACTIVE',
      yoe: null,
    },
    slot: {
      id: 'slot1004',
      weekDay: 3,
      startTime: '09:00',
      endTime: '10:00',
      isActive: true,
    },
    bookingFormAnswer: {
      id: 'answer1001',
      form: [],
      answers: [],
    },
    consultationResult: null,
  },
  // SENDED_RESULT_SHEET booking
  {
    id: 'booking1005',
    createdAt: '2023-11-10T13:40:00Z',
    updatedAt: '2023-11-17T17:30:00Z',
    totalPrice: 750000,
    startTime: '2023-11-15T16:00:00Z',
    endTime: '2023-11-15T17:30:00Z',
    paymentMethod: 'WALLET',
    notes: 'Need comprehensive skin analysis',
    meetUrl: 'https://meet.google.com/tuv-wxyz-abc',
    record: 'https://storage.example.com/recordings/rec1005',
    type: 'SERVICE',
    status: BookingStatusEnum.SENDED_RESULT_SHEET,
    resultNote: 'Client has combination skin with mild hyperpigmentation',
    brand: null,
    consultantService: {
      id: 'cs1005',
      price: 750000,
      detail: 'Full facial analysis with product recommendations',
      status: 'ACTIVE',
      account: {
        id: 'user1005',
        firstName: 'Hai',
        lastName: 'Vo',
        username: 'hai.vo',
        avatar: 'https://i.pravatar.cc/150?img=15',
        email: 'hai.vo@example.com',
        gender: 'MALE',
        phone: '+84956789012',
        dob: '1989-12-03',
        status: 'ACTIVE',
        yoe: 9,
      },
      systemService: {
        id: 'ss1005',
        name: 'Comprehensive Facial Analysis',
        description: 'Complete facial skin analysis with detailed recommendations',
        type: 'PREMIUM',
        status: 'ACTIVE',
      },
      serviceBookingForm: {
        id: 'form1005',
        title: 'Facial Analysis Form',
        status: 'ACTIVE',
        questions: [],
      },
    },
    account: {
      id: 'user2005',
      firstName: 'Huong',
      lastName: 'Tran',
      username: 'huong.tran',
      avatar: 'https://i.pravatar.cc/150?img=37',
      email: 'huong.tran@example.com',
      gender: 'FEMALE',
      phone: '+84923456789',
      dob: '1996-06-22',
      status: 'ACTIVE',
      yoe: null,
    },
    slot: {
      id: 'slot1005',
      weekDay: 3,
      startTime: '16:00',
      endTime: '17:30',
      isActive: true,
    },
    bookingFormAnswer: {
      id: 'answer1002',
      form: [],
      answers: [],
    },
    consultationResult: {
      id: 'result1001',
      criteria: [],
      results: [],
      suggestedProductClassifications: [],
    },
  },
  // COMPLETED booking
  {
    id: 'booking1006',
    createdAt: '2023-11-01T10:25:00Z',
    updatedAt: '2023-11-09T09:15:00Z',
    totalPrice: 600000,
    startTime: '2023-11-08T11:00:00Z',
    endTime: '2023-11-08T12:00:00Z',
    paymentMethod: 'CREDIT_CARD',
    notes: null,
    meetUrl: 'https://meet.google.com/def-ghij-klm',
    record: 'https://storage.example.com/recordings/rec1006',
    type: 'SERVICE',
    status: BookingStatusEnum.COMPLETED,
    resultNote: 'Client follows the recommended skincare routine',
    brand: null,
    consultantService: {
      id: 'cs1006',
      price: 600000,
      detail: 'Skincare routine consultation',
      status: 'ACTIVE',
      account: {
        id: 'user1006',
        firstName: 'Anh',
        lastName: 'Hoang',
        username: 'anh.hoang',
        avatar: 'https://i.pravatar.cc/150?img=19',
        email: 'anh.hoang@example.com',
        gender: 'FEMALE',
        phone: '+84934567890',
        dob: '1992-02-28',
        status: 'ACTIVE',
        yoe: 6,
      },
      systemService: {
        id: 'ss1006',
        name: 'Skincare Routine Consultation',
        description: 'Creating a personalized daily skincare routine',
        type: 'STANDARD',
        status: 'ACTIVE',
      },
      serviceBookingForm: {
        id: 'form1006',
        title: 'Skincare Routine Form',
        status: 'ACTIVE',
        questions: [],
      },
    },
    account: {
      id: 'user2006',
      firstName: 'Quan',
      lastName: 'Do',
      username: 'quan.do',
      avatar: 'https://i.pravatar.cc/150?img=60',
      email: 'quan.do@example.com',
      gender: 'MALE',
      phone: '+84989012345',
      dob: '1994-10-17',
      status: 'ACTIVE',
      yoe: null,
    },
    slot: {
      id: 'slot1006',
      weekDay: 2,
      startTime: '11:00',
      endTime: '12:00',
      isActive: true,
    },
    bookingFormAnswer: {
      id: 'answer1003',
      form: [],
      answers: [],
    },
    consultationResult: {
      id: 'result1002',
      criteria: [],
      results: [],
      suggestedProductClassifications: [],
    },
  },
  // REFUNDED booking
  {
    id: 'booking1007',
    createdAt: '2023-11-05T08:50:00Z',
    updatedAt: '2023-11-06T14:20:00Z',
    totalPrice: 550000,
    startTime: '2023-11-10T13:00:00Z',
    endTime: '2023-11-10T14:00:00Z',
    paymentMethod: 'BANK_TRANSFER',
    notes: 'Interested in makeup techniques',
    meetUrl: null,
    record: null,
    type: 'SERVICE',
    status: BookingStatusEnum.REFUNDED,
    resultNote: null,
    brand: null,
    consultantService: {
      id: 'cs1007',
      price: 550000,
      detail: 'Makeup consultation',
      status: 'ACTIVE',
      account: {
        id: 'user1007',
        firstName: 'Trang',
        lastName: 'Nguyen',
        username: 'trang.nguyen',
        avatar: 'https://i.pravatar.cc/150?img=25',
        email: 'trang.nguyen@example.com',
        gender: 'FEMALE',
        phone: '+84912345987',
        dob: '1993-08-11',
        status: 'ACTIVE',
        yoe: 5,
      },
      systemService: {
        id: 'ss1007',
        name: 'Makeup Consultation',
        description: 'Learn makeup techniques tailored to your features',
        type: 'STANDARD',
        status: 'ACTIVE',
      },
      serviceBookingForm: {
        id: 'form1007',
        title: 'Makeup Consultation Form',
        status: 'ACTIVE',
        questions: [],
      },
    },
    account: {
      id: 'user2007',
      firstName: 'Ngoc',
      lastName: 'Tran',
      username: 'ngoc.tran',
      avatar: 'https://i.pravatar.cc/150?img=49',
      email: 'ngoc.tran@example.com',
      gender: 'FEMALE',
      phone: '+84978901234',
      dob: '1998-05-03',
      status: 'ACTIVE',
      yoe: null,
    },
    slot: {
      id: 'slot1007',
      weekDay: 5,
      startTime: '13:00',
      endTime: '14:00',
      isActive: true,
    },
    bookingFormAnswer: null,
    consultationResult: null,
  },
  // CANCELLED booking
  {
    id: 'booking1008',
    createdAt: '2023-11-18T15:35:00Z',
    updatedAt: '2023-11-19T10:05:00Z',
    totalPrice: 500000,
    startTime: '2023-11-24T10:30:00Z',
    endTime: '2023-11-24T11:30:00Z',
    paymentMethod: 'WALLET',
    notes: null,
    meetUrl: null,
    record: null,
    type: 'SERVICE',
    status: BookingStatusEnum.CANCELLED,
    resultNote: null,
    brand: null,
    consultantService: {
      id: 'cs1008',
      price: 500000,
      detail: 'Nail care consultation',
      status: 'ACTIVE',
      account: {
        id: 'user1008',
        firstName: 'Thao',
        lastName: 'Vu',
        username: 'thao.vu',
        avatar: 'https://i.pravatar.cc/150?img=33',
        email: 'thao.vu@example.com',
        gender: 'FEMALE',
        phone: '+84967123456',
        dob: '1991-11-22',
        status: 'ACTIVE',
        yoe: 6,
      },
      systemService: {
        id: 'ss1008',
        name: 'Nail Care Consultation',
        description: 'Professional advice on nail health and styling',
        type: 'STANDARD',
        status: 'ACTIVE',
      },
      serviceBookingForm: {
        id: 'form1008',
        title: 'Nail Care Form',
        status: 'ACTIVE',
        questions: [],
      },
    },
    account: {
      id: 'user2008',
      firstName: 'Hoang',
      lastName: 'Pham',
      username: 'hoang.pham',
      avatar: 'https://i.pravatar.cc/150?img=70',
      email: 'hoang.pham@example.com',
      gender: 'MALE',
      phone: '+84945671234',
      dob: '1995-02-14',
      status: 'ACTIVE',
      yoe: null,
    },
    slot: {
      id: 'slot1008',
      weekDay: 5,
      startTime: '10:30',
      endTime: '11:30',
      isActive: true,
    },
    bookingFormAnswer: null,
    consultationResult: null,
  },
] as unknown as IBooking[]
// Get booking details by ID
export const getBookingByIdApi = toQueryFetcher<string, TServerResponse<IBooking>>(
  'getBookingById',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (bookingId) => {
    return {
      message: 'success',
      data:mockBookings[3]
    }
    return privateRequest(`/bookings/${bookingId}`)
   
  },
)

// Get booking status tracking
export const getBookingStatusTrackingApi = toQueryFetcher<string, TServerResponse<IStatusTracking[]>>(
  'getBookingStatusTracking',
  async (bookingId) => {
  return  await privateRequest(`/bookings/status-tracking/${bookingId}`)
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
    return privateRequest(`/bookings/${id}/status`, { 
      method: 'PATCH',
      data: { status }
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
    const response = await axiosWithToken.patch(`/bookings/${bookingId}/cancel`, { reason })
    return response.data
  },
)
