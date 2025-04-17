import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import  Button  from '@/components/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import configs from '@/config'
import { IBooking } from '@/types/booking'
import { formatCurrency } from '@/views/BeautyConsultation/data/mockData'

interface ServiceCheckoutTotalProps {
  isLoading: boolean
  servicePrice: number
  platformVoucherDiscount: number
  totalPayment: number
  formId: string
  isSubmitting?: boolean
  bookingData?: IBooking
}

const ServiceCheckoutTotal = ({
  isLoading,
  servicePrice,
  platformVoucherDiscount,
  totalPayment,
  formId,
  isSubmitting,
  bookingData
}: ServiceCheckoutTotalProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-4 space-y-3">
        <h3 className="font-medium text-lg">{t('booking.summary', 'Tổng quan đặt lịch')}</h3>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{t('booking.servicePrice', 'Giá dịch vụ')}</span>
            <span>{formatCurrency(servicePrice)}</span>
          </div>

          {platformVoucherDiscount > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span>{t('booking.platformVoucherDiscount', 'Giảm giá từ voucher')}</span>
              <span>- {formatCurrency(platformVoucherDiscount)}</span>
            </div>
          )}

          <div className="border-t border-border pt-2 flex justify-between items-center font-medium">
            <span>{t('booking.totalPayment', 'Tổng tiền thanh toán')}</span>
            <span className="text-primary text-lg">{formatCurrency(totalPayment)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {bookingData?.id ? <Button variant="outline" className="w-full" onClick={() => navigate(configs.routes.profileBookingDetail.replace(':bookingId', bookingData.id))}>
          {t('booking.viewBooking', 'Xem đơn hàng')}
        </Button> : <Button type="submit" form={formId} disabled={isLoading || isSubmitting} className="w-full" loading={isSubmitting}>
          {t('booking.confirmBooking', 'Xác nhận đặt lịch')}
        </Button> }
      </CardFooter>
    </Card>
  )
}

export default ServiceCheckoutTotal
