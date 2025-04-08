/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ArrowLeftIcon } from 'lucide-react'
import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'

import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { QRCodeAlertDialog } from '@/components/payment'
import PaymentSelection from '@/components/payment/PaymentSelection'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import configs from '@/config'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { PAY_TYPE } from '@/network/apis/transaction/type'
import { getUserProfileApi } from '@/network/apis/user'
import { PaymentMethod, ResultEnum } from '@/types/enum'

// Import service details related components
import { ServiceCheckoutItem, ServiceCheckoutTotal } from './components'

// Define interfaces for service booking
interface ServiceConsultant {
  id: string
  name: string
  imageUrl: string
  title: string
  experience: number
}

interface Service {
  id: string
  title: string
  description: string
  price: number
  duration: number
  consultant: ServiceConsultant
  category: string
  type: string
  imageUrl: string
}

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

// Get an array of values from PaymentMethod enum

// Define schema for service booking form
const bookingServiceSchema = z.object({
  serviceId: z.string(),
  consultantId: z.string(),
  bookingDateTime: z.string(), // Combined date and time field
  paymentMethod: z.enum([PaymentMethod.WALLET, PaymentMethod.BANK_TRANSFER]),
  note: z.string().optional(),
})

type BookingServiceFormValues = z.infer<typeof bookingServiceSchema>

const ServiceCheckout = () => {
  const { t } = useTranslation()
  const formId = useId()
  const { serviceId } = useParams()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const navigate = useNavigate()

  // Log the service ID to verify it's being passed correctly
  console.log('Service ID in checkout:', serviceId)

  // States
  const [isLoading, setIsLoading] = useState(false)
  const [serviceDetails, setServiceDetails] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [bookingDateTime, setBookingDateTime] = useState<string>('')

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
    return serviceDetails?.price || 0
  }, [serviceDetails])

  // Total payment calculation - no discount now that vouchers are removed
  const totalPayment = useMemo(() => {
    return servicePrice
  }, [servicePrice])

  const defaultValues = {
    serviceId: serviceId || '',
    consultantId: serviceDetails?.consultant?.id || '',
    bookingDateTime: bookingDateTime, // Combined field for date and time
    paymentMethod: PaymentMethod.BANK_TRANSFER as PaymentMethod.BANK_TRANSFER,
    note: '',
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
    form.setValue('consultantId', serviceDetails?.consultant?.id || '')
    form.setValue('bookingDateTime', bookingDateTime)
  }, [serviceId, serviceDetails, bookingDateTime, form])

  // Queries
  const { isFetching: isGettingProfile } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn,
  })

  // Add mock service data for testing since we don't have actual data yet
  useEffect(() => {
    // For demo purposes, simulate fetching service details
    const mockServiceData: Service = {
      id: serviceId || 'default-id',
      title: 'Tư vấn Skincare Chuyên sâu',
      description: 'Phân tích và tư vấn chăm sóc da toàn diện với bác sĩ chuyên khoa',
      price: 500000,
      duration: 60,
      category: 'Skincare',
      type: 'PREMIUM',
      imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1740&auto=format&fit=crop',
      consultant: {
        id: 'consultant-1',
        name: 'Dr. Nguyễn Thị Minh',
        imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1740&auto=format&fit=crop',
        title: 'Bác sĩ Da liễu',
        experience: 5,
      },
    }

    setServiceDetails(mockServiceData)
  }, [serviceId])

  // Simulated booking service mutation
  const { mutateAsync: bookServiceFn } = useMutation({
    mutationKey: ['bookService'],
    mutationFn: async (bookingData: BookingServiceFormValues) => {
      // This would be a real API call in production
      // For demo, just return a mock response after a delay
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              id: 'booking-' + Math.random().toString(36).substring(2, 9),
              ...bookingData,
              // Extract date and time from combined field for display purposes if needed
              bookingDate: bookingData.bookingDateTime.split('T')[0],
              bookingTime: bookingData.bookingDateTime.split('T')[1].slice(0, 5),
              createdAt: new Date().toISOString(),
              status: 'PENDING',
              paymentStatus: 'PENDING',
            },
          })
        }, 1000)
      })
    },
    onSuccess: (response: any) => {
      if (paymentMethod === PaymentMethod.BANK_TRANSFER) {
        setIsOpenQRCodePayment(true)
        setPaymentId(response.data.id)
        setBookingData(response.data)
        return
      }

      successToast({
        message: t('booking.success'),
      })

      handleReset()
      navigate(configs.routes.checkoutResult, {
        state: { orderData: response, status: ResultEnum.SUCCESS },
      })
    },
  })

  const handleReset = useCallback(() => {
    form.reset()
    setSelectedDate('')
    setSelectedTime('')
    setBookingDateTime('')
  }, [form])

  const onPaymentSuccess = useCallback(() => {
    successToast({
      message: t('booking.paymentSuccess'),
    })

    handleReset()
    navigate(configs.routes.checkoutResult, {
      state: { orderData: bookingData, status: ResultEnum.SUCCESS },
    })
  }, [navigate, bookingData, handleReset, t, successToast])

  // Handle form submission
  async function onSubmit(values: BookingServiceFormValues) {
    try {
      setIsLoading(true)

      const formData = {
        ...values,
      }

      await bookServiceFn(formData)

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
        form,
      })
    }
  }

  // Handle date selection from calendar

  return (
    <>
      <QRCodeAlertDialog
        amount={totalPayment}
        open={isOpenQRCodePayment}
        onOpenChange={setIsOpenQRCodePayment}
        type={PAY_TYPE.ORDER}
        paymentId={paymentId}
        onSuccess={onPaymentSuccess}
      />

      {(isGettingProfile || isLoading) && <LoadingContentLayer />}

      {serviceDetails && (
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
                  {serviceDetails && (
                    <span className="ml-2 text-primary font-normal text-base">#{serviceDetails.id}</span>
                  )}
                </h2>

                <div className="w-full flex gap-3 lg:flex-row md:flex-col flex-col">
                  {/* Left column - Service details and booking options */}
                  <div className="w-full md:w-full lg:w-[calc(65%-6px)] xl:w-[calc(70%-6px)]">
                    {/* Service details section */}
                    <ServiceCheckoutItem service={serviceDetails} form={form} />
                  </div>

                  {/* Right column - Booking summary */}
                  <div className="w-full md:full lg:w-[calc(35%-6px)] xl:w-[calc(30%-6px)] flex flex-col gap-3">
                    {/* Payment Method Section - Using the layout from Checkout/index.tsx */}
                    <div className="w-full">
                      <PaymentSelection form={form as any} hasPreOrderProduct={true} totalPayment={totalPayment} />
                    </div>

                    {/* Order Total */}
                    <ServiceCheckoutTotal
                      isLoading={isLoading}
                      servicePrice={servicePrice}
                      platformVoucherDiscount={0}
                      totalPayment={totalPayment}
                      formId={`form-${formId}`}
                    />
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}

      {!serviceDetails && !isLoading && (
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
