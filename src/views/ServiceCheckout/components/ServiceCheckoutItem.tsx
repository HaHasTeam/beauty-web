import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import DEFAULT_IMAGE from '@/assets/images/consultant-default.jpg'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { IConsultantService } from '@/types/consultant-service'
import { ServiceTypeEnum } from '@/types/enum'
import { formatCurrency } from '@/views/BeautyConsultation/data/mockData'

interface ServiceCheckoutItemProps {
  service: IConsultantService
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any // Using any for form because it's complex to type correctly
  selectedDateTime?: string | null
}

const ServiceCheckoutItem = ({ service, form, selectedDateTime }: ServiceCheckoutItemProps) => {
  const { t } = useTranslation()
  // Hiển thị ngày giờ đã chọn dưới dạng text khi người dùng đã chọn
  const formattedDateTime = selectedDateTime
    ? format(new Date(selectedDateTime), 'EEEE, dd/MM/yyyy - HH:mm', { locale: vi })
    : null

  // Lấy thông tin cơ bản từ service
  const serviceType = service.systemService?.type || 'STANDARD'
  const serviceName = service.systemService?.name || 'Dịch vụ tư vấn'
  const serviceCategory = service.systemService?.category?.name || ''
  const serviceDuration = serviceType === ServiceTypeEnum.PREMIUM ? 60 : 0
  
  // Lấy avatar và tên consultant từ account
  const consultantName = service.account.firstName+" "+service.account.lastName || 'Chuyên gia tư vấn'
  const consultantTitle = service.account.majorTitle|| "Chuyên gia tư vấn"

  
  return (
    <div className="w-full">
      {/* Desktop header - only visible on md and above */}
      <div className="hidden md:block">
        <div className="flex items-center gap-3 p-4 border-b border-border/70 bg-primary/25">
          <div className="flex-1 font-medium">
            {t('booking.service', 'Dịch vụ')}
          </div>
          {serviceType === 'PREMIUM' && (
            <div className="w-[160px] flex-shrink-0 font-medium">
              {t('booking.schedule', 'Lịch hẹn')}
            </div>
          )}
          <div className="w-[160px] flex-shrink-0 font-medium">
            {t('booking.consultant', 'Chuyên viên')}
          </div>
          <div className="w-[100px] flex-shrink-0 font-medium text-right">
            {t('booking.price', 'Giá')}
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden">
        <h2 className="uppercase font-bold text-xl p-4 border-b border-border/70 bg-primary/25">
          {t('booking.serviceDetails', 'Chi tiết dịch vụ')}
        </h2>
      </div>

      {/* Content Row */}
      <div className="p-4">
        {/* Mobile view - stacked layout */}
        <div className="md:hidden space-y-4">
          <div className="flex gap-3">
            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <img src={DEFAULT_IMAGE} alt={serviceName} className="w-full h-full object-cover" />
              <Badge
                variant={serviceType === 'PREMIUM' ? 'destructive' : 'secondary'}
                className="absolute top-0 right-0 text-[10px]"
              >
                {serviceType === 'PREMIUM' ? 'Premium' : 'Standard'}
              </Badge>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium mb-1 line-clamp-1">{serviceName}</h3>
              <div className="mt-1">
                <Badge variant="outline">{serviceCategory}</Badge>
                {serviceType === 'PREMIUM' && serviceDuration > 0 && (
                  <Badge variant="outline" className="ml-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {serviceDuration} {t('booking.minutes', 'phút')}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={DEFAULT_IMAGE} alt={consultantName} />
                <AvatarFallback>{consultantName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium line-clamp-1">{consultantName}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{consultantTitle}</p>
              </div>
            </div>
            <div className="font-medium">{formatCurrency(service.price || 0)}</div>
          </div>

          {serviceType === 'PREMIUM' && (
            <div>
              <FormField
                control={form.control}
                name="bookingDateTime"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="text-sm font-medium">
                        {formattedDateTime || t('booking.noDateTimeSelected', 'Chưa chọn ngày giờ')}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* Desktop view - row layout */}
        <div className="hidden md:flex items-center gap-3 overflow-x-auto">
          {/* Service information column - flex grow */}
          <div className="flex gap-3 flex-1 items-center">
            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <img src={DEFAULT_IMAGE} alt={serviceName} className="w-full h-full object-cover" />
              <Badge
                variant={serviceType === 'PREMIUM' ? 'destructive' : 'secondary'}
                className="absolute top-0 right-0 text-[10px]"
              >
                {serviceType === 'PREMIUM' ? 'Premium' : 'Standard'}
              </Badge>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium mb-1 line-clamp-1">{serviceName}</h3>
              <div className="mt-1">
                <Badge variant="outline">{serviceCategory}</Badge>
                {serviceType === 'PREMIUM' && serviceDuration > 0 && (
                  <Badge variant="outline" className="ml-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {serviceDuration} {t('booking.minutes', 'phút')}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Schedule selection column - fixed width */}
          {serviceType === 'PREMIUM' && (
            <div className="w-[160px] flex-shrink-0">
              <FormField
                control={form.control}
                name="bookingDateTime"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="text-sm font-medium">
                        {formattedDateTime || t('booking.noDateTimeSelected', 'Chưa chọn ngày giờ')}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Consultant information column - fixed width */}
          <div className="flex gap-2 items-center w-[160px] flex-shrink-0">
            <Avatar className="h-8 w-8">
              <AvatarImage src={DEFAULT_IMAGE} alt={consultantName} />
              <AvatarFallback>{consultantName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-1">{consultantName}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{consultantTitle}</p>
            </div>
          </div>

          {/* Price column - fixed width and right-aligned */}
          <div className="w-[100px] flex-shrink-0 text-right font-medium">
            {formatCurrency(service.price || 0)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceCheckoutItem
