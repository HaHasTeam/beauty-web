import 'react-quill-new/dist/quill.bubble.css'

import { format } from 'date-fns'
import { Calendar, Clock, CreditCard, MessageSquare, User } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill-new'
import { Link, useNavigate } from 'react-router-dom'

import DEFAULT_IMAGE from '@/assets/images/consultant-default.jpg'
import BookingStatus from '@/components/booking/BookingStatus'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import configs from '@/config'
import routes from '@/config/routes'
import { IBooking } from '@/types/booking'
import { ServiceTypeEnum } from '@/types/enum'
import { formatCurrency } from '@/views/BeautyConsultation/data/mockData'

interface BookingItemProps {
  booking: IBooking
  setIsTrigger: React.Dispatch<React.SetStateAction<boolean>>
}

const BookingItem: React.FC<BookingItemProps> = ({ booking, setIsTrigger }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const getFormattedDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return format(date, 'dd/MM/yyyy - HH:mm')
  }

  // Helper function to properly format time strings
  const formatTimeString = (timeStr: string) => {
    if (!timeStr) return '00:00'

    // If it starts with :, add 0 in front
    if (timeStr.startsWith(':')) {
      timeStr = '0' + timeStr
    }

    // If it's just hours like '09:00', return as is
    if (timeStr.includes(':')) {
      return timeStr
    }

    // If it's a full date-time string, parse it
    try {
      return format(new Date(timeStr), 'HH:mm')
    } catch {
      // If parsing fails, return original with best guess formatting
      return timeStr.padStart(5, '0')
    }
  }

  const handleViewDetail = () => {
    // Navigate to booking detail page
    navigate(configs.routes.profileBookingDetail.replace(':bookingId', booking.id))
  }

  const handleCancelBooking = () => {
    // Implementation for cancel booking
    console.log('Cancel booking', booking.id)
    setIsTrigger((prev) => !prev)
  }

  const canCancel = ['TO_PAY', 'WAIT_FOR_CONFIRMATION'].includes(booking.status)

  // Use account from consultantService
  const consultantUsername =
    booking.consultantService?.account?.firstName + ' ' + booking.consultantService?.account?.lastName || 'Consultant'
  const consultantId = booking.consultantService?.account?.id || ''
  const consultantAvatar = booking.consultantService?.account?.avatar || undefined
  const consultantEmail = booking.consultantService?.account?.email || ''

  // Check if booking has results available based on status
  const hasResults = booking.status === 'SENDED_RESULT_SHEET' || booking.status === 'COMPLETED'

  // Format payment method for display
  const getPaymentMethodTranslation = (method: string) => {
    return t(`payment.${method.toLowerCase()}`, String(method).replace('_', ' '))
  }

  // Get the first valid image from consultantService or systemService
  const getServiceImage = () => {
    // Helper function to check if URL is an image based on extension
    const isImageUrl = (url: string) => {
      if (!url) return false
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp']
      const lowercaseUrl = url.toLowerCase()
      return imageExtensions.some((ext) => lowercaseUrl.endsWith(ext))
    }

    // First try to use consultantService.images
    if (booking.consultantService?.images && booking.consultantService.images.length > 0) {
      // Try to find the first valid image by extension
      const validImage = booking.consultantService.images.find((img) => img.fileUrl && isImageUrl(img.fileUrl))

      if (validImage) {
        return validImage.fileUrl
      }
    }

    // Fallback to systemService images
    if (booking.consultantService?.systemService?.images && booking.consultantService.systemService.images.length > 0) {
      // Find first valid image from systemService
      const validSystemImage = booking.consultantService.systemService.images.find(
        (img) => img.fileUrl && isImageUrl(img.fileUrl),
      )

      if (validSystemImage) {
        return validSystemImage.fileUrl
      }
    }

    // Use default image if no valid images found
    return DEFAULT_IMAGE
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-all duration-300 border border-gray-100">
      {/* Booking Item Header */}
      <div className="flex flex-col-reverse gap-3 md:flex-row items-start md:justify-between md:items-center border-b border-gray-100 py-3 mb-4">
        {/* Consultant */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-primary/20 shadow-sm">
            <AvatarImage src={consultantAvatar} alt={consultantUsername} />
            <AvatarFallback className="bg-primary/10 text-primary text-base">
              {consultantUsername.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Link
                to={`/consultant/${consultantId}`}
                className="font-medium text-base hover:text-primary transition-colors"
              >
                {consultantUsername}
              </Link>
            </div>
            <span className="text-sm text-muted-foreground">{consultantEmail}</span>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Button
              className="flex items-center gap-1 bg-primary hover:bg-primary/90 transition-colors"
              variant="default"
              size="sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="text-sm">{t('booking.chat')}</span>
            </Button>
            <Link
              to={routes.beautyConsultationDetail.replace(':consultantId', consultantId)}
              className="hidden md:flex py-1.5 px-2 rounded-md items-center border border-primary text-primary hover:text-primary hover:bg-primary/10 transition-colors text-sm"
            >
              <User className="w-3.5 h-3.5 mr-1" />
              {t('booking.viewProfile')}
            </Link>
          </div>
        </div>
        {/* Booking Status */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center">
            <BookingStatus status={booking.status} />
          </div>
          <div className="text-sm text-muted-foreground">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="cursor-default">
                  {t('booking.id')}: {booking.id.substring(0, 8)}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{booking.id}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="mx-1">•</span>
            {t('booking.bookedOn')}: {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}
          </div>
        </div>
      </div>

      {/* Service Info */}
      <div className="border-b border-gray-100 mb-4 pb-4">
        <div className="flex flex-col md:flex-row gap-5 items-start">
          <div className="w-full md:w-24 h-32 md:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-primary/5 border border-gray-100 shadow-sm">
            <img
              src={getServiceImage()}
              alt={booking.consultantService?.systemService?.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-3">
            <h3 className="font-medium text-lg text-gray-800">{booking.consultantService.systemService.name}</h3>
            {booking.consultantService.description && booking.consultantService.description.includes('<') ? (
              <div className="text-base text-muted-foreground" style={{ maxHeight: '3.6em', overflow: 'hidden' }}>
                <ReactQuill value={booking.consultantService.description} readOnly={true} theme="bubble" />
              </div>
            ) : (
              <p className="text-base text-muted-foreground line-clamp-2">
                {booking.consultantService.description || booking.consultantService.systemService.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <Badge
                variant={booking.consultantService.systemService.type === 'PREMIUM' ? 'default' : 'secondary'}
                className={
                  booking.consultantService.systemService.type === 'PREMIUM'
                    ? 'bg-primary/90 text-sm hover:bg-primary/80 transition-colors'
                    : 'text-sm hover:bg-secondary/80 transition-colors'
                }
              >
                {booking.consultantService.systemService.type}
              </Badge>
              <Badge variant="outline" className="text-sm border-gray-200">
                {booking.consultantService.price && formatCurrency(booking.consultantService.price)} /{' '}
                {booking.consultantService.duration || 60} {t('booking.minutes')}
              </Badge>
            </div>
          </div>

          {/* Booking details - right side */}
          <div className="flex flex-col md:flex-row gap-5 ml-auto md:ml-8 mt-4 md:mt-0 bg-gray-50 md:bg-transparent p-3 md:p-0 rounded-lg md:rounded-none w-full md:w-auto">
            <div className="space-y-2 ">
              {booking.consultantService.systemService.type == ServiceTypeEnum.PREMIUM && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-base">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-gray-700">{getFormattedDateTime(String(booking.startTime))}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-gray-700">
                      {booking.slot?.startTime
                        ? formatTimeString(String(booking.slot.startTime))
                        : format(new Date(String(booking.startTime)), 'HH:mm')}{' '}
                      -{' '}
                      {booking.slot?.endTime
                        ? formatTimeString(String(booking.slot.endTime))
                        : format(new Date(String(booking.endTime)), 'HH:mm')}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4 text-primary" />
                <span className="text-gray-700">{getPaymentMethodTranslation(String(booking.paymentMethod))}</span>
              </div>

              {/* Show result icon for bookings with sent results or completed status */}
              {hasResults && (
                <div className="flex items-center gap-2 text-base">
                  <MessageSquare className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 font-medium">{t('booking.resultAvailable')}</span>
                </div>
              )}
            </div>

            {/* Price info */}
            <div className="md:w-[140px] flex-shrink-0 text-right">
              <div className="text-xl font-semibold text-primary">{formatCurrency(booking.totalPrice)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with action buttons */}
      <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-3 pt-1">
        {/* Last update information */}
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">
          {t('booking.lastUpdate')}: {format(new Date(booking.updatedAt), 'dd/MM/yyyy HH:mm')}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetail}
            className="border-primary/30 text-primary hover:text-primary hover:bg-primary/5 transition-colors text-sm"
          >
            {t('booking.viewDetail')}
          </Button>

          {canCancel && (
            <Button variant="destructive" size="sm" onClick={handleCancelBooking} className="text-sm transition-colors">
              {t('booking.cancel')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingItem
