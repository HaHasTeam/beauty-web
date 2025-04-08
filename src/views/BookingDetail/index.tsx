import { useQuery, useQueryClient } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import { Calendar, Clock, CreditCard, History, MessageSquare, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import BookingStatus from '@/components/booking/BookingStatus'
import CancelBookingDialog from '@/components/booking/CancelBookingDialog'
import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import configs from '@/config'
import { getBookingByIdApi, getBookingStatusTrackingApi } from '@/network/apis/booking/details'
import { BookingStatusEnum } from '@/types/enum'
import { IStatusTracking } from '@/types/statusTracking'
import { formatCurrency } from '@/views/BeautyConsultation/data/mockData'

// Booking General section for timeline, consultant info, etc.
const BookingGeneral = ({ title, icon, content }: { title: string; icon: React.ReactNode; content: React.ReactNode }) => {
  return (
    <Card className="w-full bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border pb-3 mb-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="font-medium text-lg">{title}</h3>
      </div>
      <div>{content}</div>
    </Card>
  )
}

// Booking Summary section for payment details
const BookingSummary = ({ 
  totalPrice, 
  voucherDiscount = 0, 
  paymentMethod 
}: { 
  totalPrice: number; 
  voucherDiscount?: number; 
  paymentMethod: string 
}) => {
  const { t } = useTranslation()
  
  const getPaymentMethodTranslation = (method: string) => {
    return t(`payment.${method.toLowerCase()}`, String(method).replace('_', ' '))
  }

  return (
    <Card className="w-full bg-white rounded-lg p-4 shadow-sm mt-4">
      <h3 className="font-medium text-lg border-b border-border pb-3 mb-3">{t('booking.paymentSummary')}</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('booking.serviceFee')}</span>
          <span>{formatCurrency(totalPrice + voucherDiscount)}</span>
        </div>
        
        {voucherDiscount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('booking.voucherDiscount')}</span>
            <span className="text-destructive">-{formatCurrency(voucherDiscount)}</span>
          </div>
        )}
        
        <Separator className="my-2" />
        
        <div className="flex justify-between font-medium">
          <span>{t('booking.totalPayment')}</span>
          <span className="text-primary text-lg">{formatCurrency(totalPrice)}</span>
        </div>
        
        <div className="flex justify-between pt-2">
          <span className="text-muted-foreground">{t('booking.paymentMethod')}</span>
          <span className="font-medium">{getPaymentMethodTranslation(paymentMethod)}</span>
        </div>
      </div>
    </Card>
  )
}

// Booking Status Tracking to show status timeline
const BookingStatusTracking = ({ statusTrackingData }: { statusTrackingData: IStatusTracking[] }) => {
  const { t } = useTranslation()

  // Map booking statuses to display names and icons
  const getStatusDisplayInfo = (status: string) => {
    const statusMap: Record<string, { text: string; icon: React.ReactNode }> = {
      [BookingStatusEnum.TO_PAY]: { 
        text: t('booking.status.toPay'), 
        icon: <CreditCard className="w-5 h-5" /> 
      },
      [BookingStatusEnum.WAIT_FOR_CONFIRMATION]: { 
        text: t('booking.status.waitForConfirmation'), 
        icon: <Clock className="w-5 h-5" /> 
      },
      [BookingStatusEnum.BOOKING_CONFIRMED]: { 
        text: t('booking.status.bookingConfirmed'), 
        icon: <Calendar className="w-5 h-5" /> 
      },
      [BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED]: { 
        text: t('booking.status.formSubmitted'), 
        icon: <MessageSquare className="w-5 h-5" /> 
      },
      [BookingStatusEnum.SENDED_RESULT_SHEET]: { 
        text: t('booking.status.resultSent'), 
        icon: <MessageSquare className="w-5 h-5" /> 
      },
      [BookingStatusEnum.COMPLETED]: { 
        text: t('booking.status.completed'), 
        icon: <MessageSquare className="w-5 h-5" /> 
      },
      [BookingStatusEnum.REFUNDED]: { 
        text: t('booking.status.refunded'), 
        icon: <CreditCard className="w-5 h-5" /> 
      },
      [BookingStatusEnum.CANCELLED]: { 
        text: t('booking.status.cancelled'), 
        icon: <Calendar className="w-5 h-5" /> 
      },
    }
    
    return statusMap[status] || { text: status, icon: <Calendar className="w-5 h-5" /> }
  }

  // Create timeline based on statusTrackingData
  const timeline = statusTrackingData.map(tracking => ({
    status: tracking.status,
    text: getStatusDisplayInfo(tracking.status).text,
    icon: getStatusDisplayInfo(tracking.status).icon,
    createdAt: tracking.createdAt,
    isActive: true
  }))

  return (
    <Card className="w-full bg-white rounded-lg p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4 relative">
        {timeline.map((step, index) => (
          <div key={index} className="flex-1 flex flex-col items-center relative z-10">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${step.isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              {step.icon}
            </div>
            <div className="text-center mt-2">
              <div className={`text-sm font-medium ${step.isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {step.text}
              </div>
              {step.createdAt && (
                <div className="text-xs text-muted-foreground mt-1">
                  {format(new Date(step.createdAt), 'dd/MM/yyyy HH:mm')}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Status line connecting the steps */}
        <div className="hidden sm:block absolute top-6 left-0 w-full h-[2px] bg-muted z-0" />
      </div>
    </Card>
  )
}

// Status Tracking Timeline Detail
const BookingStatusTrackingDetail = ({ statusTrackingData }: { statusTrackingData: IStatusTracking[] }) => {
  const { t } = useTranslation()

  // Map booking statuses to display names
  const getStatusDisplayName = (status: string) => {
    const statusMap: Record<string, string> = {
      [BookingStatusEnum.TO_PAY]: t('booking.status.toPay'),
      [BookingStatusEnum.WAIT_FOR_CONFIRMATION]: t('booking.status.waitForConfirmation'),
      [BookingStatusEnum.BOOKING_CONFIRMED]: t('booking.status.bookingConfirmed'),
      [BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED]: t('booking.status.formSubmitted'),
      [BookingStatusEnum.SENDED_RESULT_SHEET]: t('booking.status.resultSent'),
      [BookingStatusEnum.COMPLETED]: t('booking.status.completed'),
      [BookingStatusEnum.REFUNDED]: t('booking.status.refunded'),
      [BookingStatusEnum.CANCELLED]: t('booking.status.cancelled'),
    }
    
    return statusMap[status] || status
  }

  interface TimelineItem {
    status: string
    createdAt: string
    text: string
    icon: React.ReactNode
    reason?: string
    updatedBy?: string
  }

  const defaultTimeline: TimelineItem[] = [{
    status: 'BOOKING_CREATED',
    createdAt: statusTrackingData[0]?.createdAt || new Date().toISOString(),
    text: t('booking.created'),
    icon: <Calendar className="w-5 h-5" />,
  }]

  const timeline: TimelineItem[] = [
    ...defaultTimeline,
    ...statusTrackingData.map(tracking => ({
      status: tracking.status,
      createdAt: tracking.createdAt,
      text: getStatusDisplayName(tracking.status),
      icon: <Calendar className="w-5 h-5" />,
      reason: tracking.reason || '',
      updatedBy: tracking.updatedBy?.username || t('booking.system')
    }))
  ]

  return (
    <ol className="relative border-l border-muted">
      {timeline.map((item, index) => (
        <li key={index} className="mb-6 ml-4">
          <div className="absolute w-3 h-3 bg-primary rounded-full mt-1.5 -left-1.5 border border-white" />
          <div className="flex flex-wrap gap-1 items-center">
            <h3 className="text-base font-medium text-gray-900">{item.text}</h3>
            {item.updatedBy && item.status !== 'BOOKING_CREATED' && (
              <span className="text-xs text-muted-foreground">({t('booking.by')} {item.updatedBy})</span>
            )}
          </div>
          <time className="block text-sm text-muted-foreground">
            {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}
          </time>
          {item.reason && (
            <p className="mt-1 text-sm text-muted-foreground">{t('booking.reason')}: {item.reason}</p>
          )}
        </li>
      ))}
    </ol>
  )
}

// Main BookingDetail component
const BookingDetail = () => {
  const { bookingId } = useParams()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [openCancelBookingDialog, setOpenCancelBookingDialog] = useState<boolean>(false)
  const [isTrigger, setIsTrigger] = useState<boolean>(false)
  // const { successToast } = useToast()
  // const handleServerError = useHandleServerError()

  // Use React Query hooks for data fetching
  const { 
    data: bookingData, 
    isFetching: isFetchingBooking,
  } = useQuery({
    queryKey: [getBookingByIdApi.queryKey, bookingId ?? ''],
    queryFn: () => getBookingByIdApi.fn({ queryKey: [getBookingByIdApi.queryKey, bookingId ?? ''] }),
    enabled: !!bookingId,
  })

  const { 
    data: statusTrackingData, 
    isFetching: isFetchingStatusTracking,
  } = useQuery({
    queryKey: [getBookingStatusTrackingApi.queryKey, bookingId ?? ''],
    queryFn: () => getBookingStatusTrackingApi.fn({ queryKey: [getBookingStatusTrackingApi.queryKey, bookingId ?? ''] }),
    enabled: !!bookingId,
  })

  const isFetching = isFetchingBooking || isFetchingStatusTracking;

  useEffect(() => {
    if (isTrigger && queryClient) {
      queryClient.invalidateQueries({
        queryKey: [getBookingByIdApi.queryKey],
      })
      setIsTrigger(false)
    }
  }, [isTrigger, queryClient])

  const canCancel = bookingData?.data?.status === BookingStatusEnum.TO_PAY || 
                    bookingData?.data?.status === BookingStatusEnum.WAIT_FOR_CONFIRMATION;
  
  const isMeetingJoinable = bookingData?.data?.status === BookingStatusEnum.BOOKING_CONFIRMED && 
                           bookingData?.data?.meetUrl;

  const getFormattedDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return '';
    const date = parseISO(dateTimeString);
    return format(date, 'dd/MM/yyyy - HH:mm')
  }

  return (
    <div className="bg-background min-h-[calc(100vh-64px)] pb-6">
      {isFetching && <LoadingContentLayer />}
      <div className="w-full max-w-screen-xl mx-auto lg:px-5 md:px-4 sm:px-3 px-3 space-y-6 py-5">
        {/* Header with booking ID and status */}
        <div className="flex gap-2 w-full sm:justify-between sm:items-center sm:flex-row flex-col bg-white p-4 rounded-lg shadow-sm">
          <div className="flex gap-2 items-center">
            <span className="text-lg text-foreground font-medium">{t('booking.detail')}</span>
            {!isFetching && bookingData?.data && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="cursor-default">
                    <span className="text-lg text-muted-foreground">#{bookingData?.data?.id?.substring(0, 8)}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{bookingData?.data?.id}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {!isFetching && bookingData?.data && (
            <div className="flex gap-2 items-center">
              <span className="text-muted-foreground font-medium">{t('booking.statusLabel')}: </span>
              <BookingStatus status={bookingData?.data?.status || ''} />
            </div>
          )}
        </div>
        
        {!isFetching && bookingData?.data && (
          <>
            <div className="space-y-6 w-full">
              {/* Booking status tracking */}
              {!isFetchingStatusTracking && statusTrackingData?.data && (
                <BookingStatusTracking statusTrackingData={statusTrackingData?.data} />
              )}

              {/* Consultant info and timeline */}
              <div className="flex flex-col md:flex-row gap-4 justify-between w-full items-stretch">
                <div className="w-full md:w-1/2 flex">
                  <BookingGeneral
                    title={t('booking.timeline')}
                    icon={<History className="w-5 h-5" />}
                    content={
                      !isFetchingStatusTracking && statusTrackingData?.data ? (
                        <BookingStatusTrackingDetail statusTrackingData={statusTrackingData?.data} />
                      ) : (
                        <p></p>
                      )
                    }
                  />
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                  <BookingGeneral
                    title={t('booking.consultantInfo')}
                    icon={<User className="w-5 h-5" />}
                    content={
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-16 w-16 border border-primary/20">
                            <AvatarImage src={bookingData?.data?.account?.avatar} alt={bookingData?.data?.account?.username} />
                            <AvatarFallback className="bg-primary/10 text-primary text-lg">
                              {bookingData?.data?.account?.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Link 
                              to={`/consultant/${bookingData?.data?.account?.id}`} 
                              className="font-medium text-lg hover:text-primary transition-colors"
                            >
                              {bookingData?.data?.account?.username}
                            </Link>
                            <p className="text-sm text-muted-foreground">{bookingData?.data?.account?.email}</p>
                            <p className="text-sm text-muted-foreground">{bookingData?.data?.account?.phone}</p>
                          </div>
                        </div>
                        
                        <div className="mt-2 flex gap-3">
                          <Button className="flex items-center gap-1 bg-primary hover:bg-primary/90" variant="default">
                            <MessageSquare className="w-4 h-4" />
                            <span>{t('booking.chatWithConsultant')}</span>
                          </Button>
                          <Link
                            to={`/consultant/${bookingData?.data?.account?.id}`}
                            className="flex py-2 px-3 rounded-md items-center border border-primary text-primary hover:text-primary hover:bg-primary/10"
                          >
                            <User className="w-4 h-4 mr-1" />
                            {t('booking.viewProfile')}
                          </Link>
                        </div>
                      </div>
                    }
                  />
                  
                  <BookingGeneral
                    title={t('booking.appointmentDetails')}
                    icon={<Calendar className="w-5 h-5" />}
                    content={
                      <div className="flex flex-col gap-2 text-base">
                        <div className="grid grid-cols-2 gap-1">
                          <p className="text-muted-foreground">{t('booking.date')}:</p>
                          <p className="font-medium">{getFormattedDateTime(bookingData?.data?.startTime as string || '')}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-1">
                          <p className="text-muted-foreground">{t('booking.duration')}:</p>
                          <p className="font-medium">60 {t('booking.minutes')}</p>
                        </div>
                        
                        {bookingData?.data?.notes && (
                          <div className="grid grid-cols-1 gap-1 mt-2">
                            <p className="text-muted-foreground">{t('booking.notes')}:</p>
                            <p className="font-medium bg-muted/30 p-2 rounded-md">{bookingData?.data?.notes}</p>
                          </div>
                        )}
                        
                        {isMeetingJoinable && (
                          <div className="mt-3">
                            <a 
                              href={bookingData?.data?.meetUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md inline-flex items-center gap-2 w-full justify-center"
                            >
                              <Calendar className="w-4 h-4" />
                              {t('booking.joinMeeting')}
                            </a>
                          </div>
                        )}
                      </div>
                    }
                  />
                </div>
              </div>

              {/* Service details */}
              <Card className="w-full bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-medium text-lg border-b border-border pb-3 mb-4">{t('booking.serviceDetails')}</h3>
                <div className="flex gap-6 items-start">
                  <div className="w-28 h-28 rounded-md overflow-hidden flex-shrink-0 bg-primary/5">
                    <img 
                      src="https://placehold.co/112x112/png" 
                      alt={bookingData?.data?.consultantService?.systemService?.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg mb-2 text-gray-800">
                          {bookingData?.data?.consultantService?.systemService?.name}
                        </h3>
                        <Badge 
                          variant={bookingData?.data?.consultantService?.systemService?.type === 'PREMIUM' ? 'default' : 'secondary'} 
                          className={bookingData?.data?.consultantService?.systemService?.type === 'PREMIUM' ? 'bg-primary/90 text-sm' : 'text-sm'}
                        >
                          {bookingData?.data?.consultantService?.systemService?.type}
                        </Badge>
                      </div>
                      
                      {/* Price info */}
                      <div className="flex-shrink-0 text-right">
                        <div className="text-xl font-semibold text-primary">
                          {formatCurrency(bookingData?.data?.totalPrice)}
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <p className="text-base text-muted-foreground mb-3">
                      {bookingData?.data?.consultantService?.systemService?.description}
                    </p>
                  </div>
                </div>
              </Card>
              
              {/* Payment summary */}
              <BookingSummary 
                totalPrice={bookingData?.data?.totalPrice} 
                voucherDiscount={0} // Replace with actual value when available
                paymentMethod={bookingData?.data?.paymentMethod} 
              />
              
              {/* Action buttons */}
              <div className="w-full flex items-center gap-2 mt-6">
                {canCancel && (
                  <Button
                    variant="outline"
                    className="w-full border border-destructive text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setOpenCancelBookingDialog(true)}
                  >
                    {t('booking.cancelBooking')}
                  </Button>
                )}
                
                {isMeetingJoinable && (
                  <a 
                    href={bookingData?.data?.meetUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md inline-flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    {t('booking.joinMeeting')}
                  </a>
                )}
              </div>
            </div>
          </>
        )}

        {!isFetching && (!bookingData || !bookingData?.data) && (
          <Empty
            title={t('empty.bookingDetail.title')}
            description={t('empty.bookingDetail.description')}
            link={configs.routes.profileBookings}
            linkText={t('empty.bookingDetail.button')}
          />
        )}

        {/* Cancel Booking Dialog */}
        {!isFetching && bookingData?.data && (
          <CancelBookingDialog
            open={openCancelBookingDialog}
            setOpen={setOpenCancelBookingDialog}
            onOpenChange={setOpenCancelBookingDialog}
            setIsTrigger={setIsTrigger}
            bookingId={bookingData?.data?.id ?? ''}
          />
        )}
      </div>
    </div>
  )
}

export default BookingDetail 