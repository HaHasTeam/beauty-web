/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import _ from 'lodash'
import { ArrowLeftIcon } from 'lucide-react'
import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'

import { BookingCalendar } from '@/components/booking-calendar'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { QRCodeAlertDialog } from '@/components/payment'
import PaymentSelection from '@/components/payment/PaymentSelection'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import configs from '@/config'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
// Thêm import cho API
import { createBookingApi, ICreateBookingParams } from '@/network/apis/booking'
import { getConsultantServiceByIdApi } from '@/network/apis/consultant-service'
import { PAY_TYPE } from '@/network/apis/transaction/type'
import { getUserProfileApi } from '@/network/apis/user'
import { IConsultantService } from '@/types/consultant-service'
import { PaymentMethod, ResultEnum } from '@/types/enum'

// Import service details related components
import { ServiceCheckoutItem, ServiceCheckoutTotal } from './components'

// Define interfaces for service booking

interface ServiceBookingData {
  id: string
  serviceId: string
  consultantId: string
  bookingDateTime: string // Combined date and time field
  paymentMethod: PaymentMethod
  note?: string
  createdAt: string
  status: string
  paymentStatus: string
}

// Define schema for service booking form
const bookingServiceSchema = z.object({
  serviceId: z.string(),
  consultantId: z.string(),
  bookingDateTime: z.string(), // Combined date and time field
  paymentMethod: z.enum([PaymentMethod.WALLET, PaymentMethod.BANK_TRANSFER]),
  note: z.string().optional(),
  slotId: z.string().optional(), // Optional slotId field
})

type BookingServiceFormValues = z.infer<typeof bookingServiceSchema>

// Hàm minify string để rút gọn ID
const minifyString = (str: string, length: number = 8) => {
  if (!str) return ''
  return str.substring(0, length)
}

// Hàm tìm ảnh đầu tiên có type là Image

// Hàm để chuyển đổi từ response API sang service model

const ServiceCheckout = () => {
  const { t } = useTranslation()
  const formId = useId()
  const { serviceId } = useParams()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const navigate = useNavigate()

  const { data: serviceData, isLoading: isLoadingService } = useQuery({
    queryKey: [
      getConsultantServiceByIdApi.queryKey,
      {
        id: serviceId as string,
      },
    ],
    queryFn: getConsultantServiceByIdApi.fn,
    enabled: !!serviceId,
  })

  // States
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [bookingDateTime, setBookingDateTime] = useState<string>('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDateTime, setSelectedDateTime] = useState<string | null>(null)
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)

  // Lọc ra các slot có sẵn

  // Update the booking date time whenever date or time changes
  useEffect(() => {
    if (selectedDate && selectedTime) {
      try {
        // Validate format
        const datePart = selectedDate // Already in ISO format: YYYY-MM-DD
        const timePart = selectedTime // Format: HH:MM

        // Create a valid ISO datetime string
        const dateTimeStr = `${datePart}T${timePart}:00`
        const dateObj = new Date(dateTimeStr)

        // Check if valid date
        if (!isNaN(dateObj.getTime())) {
          setBookingDateTime(dateTimeStr)
        } else {
          console.error('Invalid date/time combination')
        }
      } catch (error) {
        console.error('Error parsing date/time:', error)
      }
    }
  }, [selectedDate, selectedTime])

  // QR code payment state
  const [isOpenQRCodePayment, setIsOpenQRCodePayment] = useState(false)
  const [paymentId, setPaymentId] = useState<string | undefined>(undefined)
  const [bookingData, setBookingData] = useState<ServiceBookingData | undefined>(undefined)

  // Calculate service price
  const servicePrice = useMemo(() => {
    return serviceData?.data?.price || 0
  }, [serviceData])

  // Total payment calculation - no discount now that vouchers are removed
  const totalPayment = useMemo(() => {
    return servicePrice
  }, [servicePrice])

  const defaultValues = {
    serviceId: serviceId || '',
    consultantId: serviceData?.data?.account?.id || '',
    bookingDateTime: bookingDateTime, // Combined field for date and time
    paymentMethod: PaymentMethod.BANK_TRANSFER as PaymentMethod.BANK_TRANSFER,
    note: '',
    slotId: selectedSlotId || '',
  }

  const form = useForm<BookingServiceFormValues>({
    resolver: zodResolver(bookingServiceSchema),
    defaultValues,
  })

  // Update form value when bookingDateTime changes
  useEffect(() => {
    if (bookingDateTime) {
      form.setValue('bookingDateTime', bookingDateTime)
    }
  }, [bookingDateTime, form])

  // Watch for form value changes
  const paymentMethod = form.watch('paymentMethod')

  // Update form values when dependencies change
  useEffect(() => {
    form.setValue('serviceId', serviceId || '')
    form.setValue('consultantId', serviceData?.data?.account?.id || '')
    form.setValue('bookingDateTime', bookingDateTime)
  }, [serviceId, serviceData, bookingDateTime, form])

  // Queries
  const { isFetching: isGettingProfile } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn,
  })

  // Mutation để tạo booking
  const {
    mutateAsync: bookServiceFn,
    isSuccess: isBookingSuccess,
    data: bookingDataRes,
  } = useMutation({
    mutationKey: [createBookingApi.mutationKey],
    mutationFn: createBookingApi.fn,
    onSuccess: (response) => {
      // Nếu phương thức thanh toán là chuyển khoản ngân hàng, hiển thị QR code
      if (paymentMethod === PaymentMethod.BANK_TRANSFER) {
        setIsOpenQRCodePayment(true)
        setPaymentId(response.data.id)

        // Tạo dữ liệu booking để sử dụng sau khi thanh toán thành công
        const bookingDetails: ServiceBookingData = {
          id: response.data.id,
          serviceId: serviceId || '',
          consultantId: serviceData?.data?.account?.id || '',
          bookingDateTime: response.data.startTime,
          paymentMethod: PaymentMethod.BANK_TRANSFER,
          createdAt: response.data.createdAt || new Date().toISOString(),
          status: 'PENDING',
          paymentStatus: 'PENDING',
        }
        setBookingData(bookingDetails)
        return bookingDetails
      }

      // Nếu phương thức thanh toán là ví, chuyển thẳng đến trang thành công
      successToast({
        message: t('booking.success'),
      })

      // Reset form và state
      handleReset()

      // Chuyển hướng đến trang kết quả thành công
      navigate(configs.routes.checkoutResult, {
        state: { orderData: response, status: ResultEnum.SUCCESS, isBooking: true },
      })
    },
  })

  console.log('bookingDataRes', bookingDataRes)

  const handleReset = useCallback(() => {
    form.reset()
    setSelectedDate('')
    setSelectedTime('')
    setBookingDateTime('')
    setSelectedDateTime(null)
    setSelectedSlotId(null)
  }, [form])

  const onPaymentSuccess = useCallback(() => {
    successToast({
      message: t('booking.paymentSuccess'),
    })

    // Reset form và state
    handleReset()

    // Chuyển hướng đến trang kết quả thành công
    navigate(configs.routes.checkoutResult, {
      state: { orderData: bookingData, status: ResultEnum.SUCCESS, isBooking: true },
    })
  }, [navigate, bookingData, handleReset, t, successToast])

  // Handle form submission
  async function onSubmit(values: BookingServiceFormValues) {
    try {
      // Kiểm tra nếu dịch vụ là PREMIUM thì cần phải có bookingDateTime
      if (serviceData?.data.systemService?.type === 'PREMIUM' && !values.bookingDateTime) {
        form.setError('bookingDateTime', {
          type: 'manual',
          message: t('booking.errorNoDateTime', 'Vui lòng chọn ngày và giờ cho lịch hẹn'),
        })
        return
      }

      console.log('Form values:', values)

      // Đảm bảo serviceId và slotId được lấy từ form values
      const currentServiceId = values.serviceId || serviceId || ''
      const currentSlotId = values.slotId || selectedSlotId || ''

      if (!currentServiceId) {
        console.error('ServiceId is missing')
        form.setError('serviceId', {
          type: 'manual',
          message: t('booking.errorMissingServiceId', 'Thiếu thông tin dịch vụ'),
        })
        return
      }

      if (serviceData?.data.systemService?.type === 'PREMIUM' && !currentSlotId) {
        console.error('SlotId is missing for PREMIUM service')
        form.setError('bookingDateTime', {
          type: 'manual',
          message: t('booking.errorMissingSlotId', 'Vui lòng chọn thời gian cho lịch hẹn'),
        })
        return
      }

      // Tạo dữ liệu cho booking API
      const bookingParams = {
        totalPrice: totalPayment,
        startTime: values.bookingDateTime,
        endTime: values.bookingDateTime,
        type: 'SERVICE',
        slot: currentSlotId || null,
        paymentMethod: values.paymentMethod,
        consultantService: currentServiceId,
      }

      // Sử dụng lodash để loại bỏ các giá trị null, undefined, NaN, ""
      const cleanParams = _.omitBy(bookingParams, (val) => !val && val !== 0)
      console.log('Clean booking params:', cleanParams)

      // Gọi API để tạo booking
      await bookServiceFn(cleanParams as unknown as ICreateBookingParams)
    } catch (error) {
      handleServerError({
        error,
        form,
      })
    }
  }

  const handleDateTimeSelect = (dateTime: string, slotId?: string) => {
    // Cập nhật bookingDateTime trong form
    form.setValue('bookingDateTime', dateTime)
    setBookingDateTime(dateTime)
    setSelectedDateTime(dateTime)

    // Cập nhật slotId nếu có
    if (slotId) {
      setSelectedSlotId(slotId)
      form.setValue('slotId', slotId)
    }

    // Chỉ đóng dialog khi đã chọn cả thời gian (có slotId)
    setIsDialogOpen(false)
  }

  // Xử lý khi ngày được chọn thay đổi
  const handleDateFocusChange = (date: Date) => {
    // Chỉ cập nhật giá trị tạm thời, không đóng dialog
    console.log('Date focus changed:', date)
  }

  // Hiển thị ngày giờ đã chọn dưới dạng text khi người dùng đã chọn
  const formattedDateTime = selectedDateTime
    ? format(new Date(selectedDateTime), 'EEEE, dd/MM/yyyy - HH:mm', { locale: vi })
    : null

  // Nút chọn ngày giờ
  const dateTimeButton = (
    <Button
      variant={selectedDateTime ? 'default' : 'outline'}
      size="sm"
      className={cn('w-full', selectedDateTime && 'bg-primary text-white font-semibold')}
    >
      {formattedDateTime || t('booking.selectDateTime', 'Chọn ngày và giờ')}
    </Button>
  )

  return (
    <>
      <QRCodeAlertDialog
        amount={totalPayment}
        open={isOpenQRCodePayment}
        onOpenChange={setIsOpenQRCodePayment}
        type={PAY_TYPE.BOOKING}
        paymentId={paymentId}
        onSuccess={onPaymentSuccess}
      />

      {(isGettingProfile || isLoadingService) && <LoadingContentLayer />}

      {serviceData?.data && (
        <div className="relative w-full mx-auto py-5">
          <div className="w-full xl:px-28 lg:px-12 sm:px-2 px-1 space-y-3">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="sm"
              className="mb-4"
              onClick={() => navigate(configs.routes.beautyConsultationDetail.replace(':serviceId', serviceId || ''))}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              {t('booking.backToService', 'Quay lại dịch vụ')}
            </Button>

            <Form {...form}>
              <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
                className="w-full grid gap-4 mb-8"
                id={`form-${formId}`}
              >
                <h2 className="uppercase font-bold text-xl">
                  {t('booking.checkout', 'Đặt lịch dịch vụ')}
                  {serviceData.data && (
                    <span className="ml-2 text-primary font-normal text-base">
                      #{minifyString(serviceData.data.id)}
                    </span>
                  )}
                </h2>

                <div className="w-full flex gap-3 lg:flex-row md:flex-col flex-col">
                  {/* Left column - Service details and booking options */}
                  <div className="w-full md:w-full lg:w-[calc(65%-6px)] xl:w-[calc(70%-6px)]">
                    {/* Service Details Section */}
                    <div className="w-full bg-white rounded-md border border-border/70 shadow-sm mb-4">
                      <ServiceCheckoutItem
                        service={serviceData?.data as IConsultantService}
                        form={form}
                        selectedDateTime={selectedDateTime}
                      />
                    </div>
                  </div>

                  {/* Right column - Booking summary */}
                  <div className="w-full md:full lg:w-[calc(35%-6px)] xl:w-[calc(30%-6px)] flex flex-col gap-3">
                    {/* Schedule Selection Section - Only show for PREMIUM services */}
                    {serviceData.data.systemService.type === 'PREMIUM' && (
                      <div className="w-full bg-white rounded-md border border-border/70 shadow-sm p-4">
                        <h3 className="font-medium mb-3">{t('booking.schedule', 'Lịch hẹn')}</h3>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <FormField
                            control={form.control}
                            name="bookingDateTime"
                            render={() => (
                              <FormItem>
                                <FormControl>
                                  <DialogTrigger asChild>{dateTimeButton}</DialogTrigger>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogContent className="p-0 border rounded-lg max-w-fit">
                            <BookingCalendar
                              onDateTimeSelect={handleDateTimeSelect}
                              onClose={() => setIsDialogOpen(false)}
                              selectedDateTime={selectedDateTime || undefined}
                              consultantId={serviceData?.data.account?.id}
                              onFocusChange={handleDateFocusChange}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}

                    {/* Payment Method Section - Using the layout from Checkout/index.tsx */}
                    <div className="w-full">
                      <PaymentSelection form={form as any} hasPreOrderProduct={true} totalPayment={totalPayment} />
                    </div>

                    {/* Order Total */}
                    <ServiceCheckoutTotal
                      isSubmitting={form.formState.isSubmitting || isBookingSuccess}
                      isLoading={isLoadingService}
                      servicePrice={servicePrice}
                      platformVoucherDiscount={0}
                      totalPayment={totalPayment}
                      formId={`form-${formId}`}
                      bookingData={bookingDataRes?.data}
                    />
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}

      {!serviceData?.data && !isLoadingService && (
        <div className="my-10 w-full h-full flex flex-col justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t('booking.serviceNotFound', 'Không tìm thấy dịch vụ')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('booking.serviceNotFoundDesc', 'Dịch vụ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.')}
            </p>
            <Button onClick={() => navigate(configs.routes.beautyConsultation)}>
              {t('booking.backToServices', 'Quay lại danh sách dịch vụ')}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default ServiceCheckout
