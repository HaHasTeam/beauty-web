import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Clock } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BookingCalendar } from '@/components/booking-calendar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/views/BeautyConsultation/data/mockData'

// Define service interface
interface ServiceConsultant {
  id: string
  name: string
  imageUrl: string
  title: string
  experience?: number
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

interface ServiceCheckoutItemProps {
  service: Service
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any // Using any for form because it's complex to type correctly
}

const ServiceCheckoutItem = ({ service, form }: ServiceCheckoutItemProps) => {
  const { t } = useTranslation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDateTime, setSelectedDateTime] = useState<string | null>(null)

  const handleDateTimeSelect = (dateTime: string) => {
    form.setValue('bookingDateTime', dateTime)
    setSelectedDateTime(dateTime)
    setIsDialogOpen(false)
  }

  // Hiển thị ngày giờ đã chọn dưới dạng text khi người dùng đã chọn
  const formattedDateTime = selectedDateTime 
    ? format(new Date(selectedDateTime), 'EEEE, dd/MM/yyyy - HH:mm', { locale: vi })
    : null

  // Nút chọn ngày giờ cho desktop
  const desktopButton = (
    <Button 
      variant={selectedDateTime ? "default" : "outline"} 
      size="sm" 
      className={cn(selectedDateTime && "bg-primary text-white font-semibold")}
    >
      {formattedDateTime || t('booking.selectDateTime', 'Chọn ngày và giờ')}
    </Button>
  )

  // Nút chọn ngày giờ cho mobile
  const mobileButton = (
    <Button 
      variant={selectedDateTime ? "default" : "outline"} 
      size="sm" 
      className={cn("w-full", selectedDateTime && "bg-primary text-white font-semibold")}
    >
      {formattedDateTime || t('booking.selectDateTime', 'Chọn ngày và giờ')}
    </Button>
  )

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="w-full bg-white rounded-md border border-border/70 shadow-sm mb-4 overflow-hidden">
        {/* Desktop header - only visible on md and above */}
        <div className="hidden md:block">
          <h2 className="uppercase font-bold text-xl p-4 border-b border-border/70">
            {t('booking.serviceDetails', 'Chi tiết dịch vụ')}
          </h2>
          <div className="flex items-center gap-4 p-4 border-b border-border/70 bg-muted/10">
            <div className="w-[350px] xl:w-[400px] flex-shrink-0 font-medium flex items-center justify-start">
              {t('booking.service', 'Dịch vụ')}
            </div>
            <div className="w-[180px] xl:w-[200px] flex-shrink-0 font-medium flex items-center justify-start">
              {t('booking.schedule', 'Lịch hẹn')}
            </div>
            <div className="w-[180px] xl:w-[200px] flex-shrink-0 font-medium flex items-center justify-start">
              {t('booking.consultant', 'Chuyên viên')}
            </div>
            <div className="w-[120px] xl:w-[140px] flex-shrink-0 font-medium flex items-center justify-start pl-4">
              {t('booking.price', 'Giá')}
            </div>
          </div>
        </div>

        {/* Mobile header */}
        <div className="md:hidden">
          <h2 className="uppercase font-bold text-xl p-4 border-b border-border/70">
            {t('booking.serviceDetails', 'Chi tiết dịch vụ')}
          </h2>
        </div>

        {/* Content Row */}
        <div className="p-4">
          {/* Mobile view - stacked layout */}
          <div className="md:hidden space-y-4">
            <div className="flex gap-3">
              <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                <Badge
                  variant={service.type === 'PREMIUM' ? 'destructive' : 'secondary'}
                  className="absolute top-0 right-0 text-[10px]"
                >
                  {service.type === 'PREMIUM' ? 'Premium' : 'Standard'}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium mb-1 line-clamp-2">{service.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{service.description}</p>
                <div className="mt-1">
                  <Badge variant="outline">{service.category}</Badge>
                  <Badge variant="outline" className="ml-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {service.duration} {t('booking.minutes', 'phút')}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={service.consultant.imageUrl} alt={service.consultant.name} />
                  <AvatarFallback>{service.consultant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium line-clamp-1">{service.consultant.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{service.consultant.title}</p>
                </div>
              </div>
              <div className="font-medium">
                {formatCurrency(service.price)}
              </div>
            </div>
            
            <div>
              <FormField
                control={form.control}
                name="bookingDateTime"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <DialogTrigger asChild>
                        {mobileButton}
                      </DialogTrigger>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Desktop view - row layout */}
          <div className="hidden md:flex items-center gap-4 overflow-x-auto">
            {/* Service information column - fixed width */}
            <div className="flex gap-3 w-[350px] xl:w-[400px] flex-shrink-0 items-center justify-start">
              <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                <Badge
                  variant={service.type === 'PREMIUM' ? 'destructive' : 'secondary'}
                  className="absolute top-0 right-0 text-[10px]"
                >
                  {service.type === 'PREMIUM' ? 'Premium' : 'Standard'}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium mb-1 line-clamp-2">{service.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{service.description}</p>
                <div className="mt-1">
                  <Badge variant="outline">{service.category}</Badge>
                  <Badge variant="outline" className="ml-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {service.duration} {t('booking.minutes', 'phút')}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Schedule selection column - fixed width */}
            <div className="w-[180px] xl:w-[200px] flex-shrink-0 flex items-center justify-start">
              <FormField
                control={form.control}
                name="bookingDateTime"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <DialogTrigger asChild>
                        {desktopButton}
                      </DialogTrigger>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Consultant information column - fixed width */}
            <div className="flex gap-2 items-center w-[180px] xl:w-[200px] flex-shrink-0 justify-start">
              <Avatar className="h-8 w-8">
                <AvatarImage src={service.consultant.imageUrl} alt={service.consultant.name} />
                <AvatarFallback>{service.consultant.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{service.consultant.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{service.consultant.title}</p>
              </div>
            </div>

            {/* Price column - fixed width */}
            <div className="w-[120px] xl:w-[140px] flex-shrink-0 flex items-center justify-start pl-4">
              {formatCurrency(service.price)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Shared Dialog Content */}
      <DialogContent className="p-0 border rounded-lg  max-w-fit">
        <BookingCalendar 
          onDateTimeSelect={handleDateTimeSelect}
          onClose={() => setIsDialogOpen(false)}
          selectedDateTime={selectedDateTime || undefined}
        />
      </DialogContent>
    </Dialog>
  )
}

export default ServiceCheckoutItem
