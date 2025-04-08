import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { formatCurrency } from '@/views/BeautyConsultation/data/mockData'

interface ServiceCheckoutTotalProps {
  isLoading: boolean
  servicePrice: number
  platformVoucherDiscount: number
  totalPayment: number
  formId: string
}

const ServiceCheckoutTotal = ({
  isLoading,
  servicePrice,
  platformVoucherDiscount,
  totalPayment,
  formId,
}: ServiceCheckoutTotalProps) => {
  const { t } = useTranslation()

  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-4 space-y-3">
        <h3 className="font-medium text-lg">{t('booking.summary', 'Tổng quan đặt lịch')}</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">
              {t('booking.servicePrice', 'Giá dịch vụ')}
            </span>
            <span>{formatCurrency(servicePrice)}</span>
          </div>
          
          {platformVoucherDiscount > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span>
                {t('booking.platformVoucherDiscount', 'Giảm giá từ voucher')}
              </span>
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
        <Button 
          type="submit"
          form={formId}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {t('booking.processing', 'Đang xử lý')}
            </span>
          ) : (
            t('booking.confirmBooking', 'Xác nhận đặt lịch')
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ServiceCheckoutTotal 