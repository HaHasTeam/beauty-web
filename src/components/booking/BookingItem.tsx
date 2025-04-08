import { format } from 'date-fns'
import { Calendar, Clock, CreditCard, MessageSquare, User } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import BookingStatus from '@/components/booking/BookingStatus'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { IBooking } from '@/types/booking'
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

  const handleViewDetail = () => {
    // Navigate to booking detail page
    navigate(`/booking/${booking.id}`)
  }

  const handleCancelBooking = () => {
    // Implementation for cancel booking
    console.log('Cancel booking', booking.id)
    setIsTrigger(prev => !prev)
  }

  const canCancel = ['TO_PAY', 'WAIT_FOR_CONFIRMATION'].includes(booking.status)

  // Use account from booking instead of from consultantService
  const consultantUsername = booking.account?.username || 'Consultant'
  const consultantId = booking.account?.id || ''
  const consultantAvatar = booking.account?.avatar || undefined
  const consultantEmail = booking.account?.email || ''
  
  // Check if booking has results available based on status
  const hasResults = booking.status === 'SENDED_RESULT_SHEET' || 
                     booking.status === 'COMPLETED'

  // Format payment method for display
  const getPaymentMethodTranslation = (method: string) => {
    return t(`payment.${method.toLowerCase()}`, String(method).replace('_', ' '))
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Booking Item Header */}
      <div className="flex flex-col-reverse gap-3 md:flex-row items-start md:justify-between md:items-center border-b py-3 mb-4">
        {/* Consultant */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-primary/20">
            <AvatarImage src={consultantAvatar} alt={consultantUsername} />
            <AvatarFallback className="bg-primary/10 text-primary text-base">
              {consultantUsername.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Link to={`/consultant/${consultantId}`} className="font-medium text-base hover:text-primary transition-colors">
                {consultantUsername}
              </Link>
            </div>
            <span className="text-sm text-muted-foreground">{consultantEmail}</span>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Button className="flex items-center gap-1 bg-primary hover:bg-primary/90" variant="default" size="sm">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="text-sm">{t('booking.chat')}</span>
            </Button>
            <Link
              to={`/consultant/${consultantId}`}
              className="hidden md:flex py-1.5 px-2 rounded-md items-center border border-primary text-primary hover:text-primary hover:bg-primary/10 text-sm"
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
      <div className="border-b mb-4 pb-4">
        <div className="flex gap-4 items-start">
          <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0 bg-primary/5">
            <img 
              src="https://placehold.co/96x96/png" 
              alt={booking.consultantService.systemService.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-lg mb-2 text-gray-800">
              {booking.consultantService.systemService.name}
            </h3>
            <p className="text-base text-muted-foreground line-clamp-2 mb-2">
              {booking.consultantService.systemService.description}
            </p>
            
            <div className="flex gap-2">
              <Badge variant={booking.consultantService.systemService.type === 'PREMIUM' ? 'default' : 'secondary'} 
                     className={booking.consultantService.systemService.type === 'PREMIUM' ? 'bg-primary/90 text-sm' : 'text-sm'}>
                {booking.consultantService.systemService.type}
              </Badge>
            </div>
          </div>

          {/* Booking details - right side */}
          <div className="flex flex-col md:flex-row gap-5 ml-auto">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{getFormattedDateTime(String(booking.startTime))}</span>
              </div>
              <div className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-primary" />
                <span>
                  {format(new Date(String(booking.startTime)), 'HH:mm')} - {format(new Date(String(booking.endTime)), 'HH:mm')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4 text-primary" />
                <span>{getPaymentMethodTranslation(String(booking.paymentMethod))}</span>
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
      <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-2 pt-1">
        {/* Last update information */}
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">
          {t('booking.lastUpdate')}: {format(new Date(booking.updatedAt), 'dd/MM/yyyy HH:mm')}
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleViewDetail} className="border-primary/30 text-primary hover:text-primary hover:bg-primary/5 text-sm">
            {t('booking.viewDetail')}
          </Button>
          
          {canCancel && (
            <Button variant="destructive" size="sm" onClick={handleCancelBooking} className="text-sm">
              {t('booking.cancel')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingItem 