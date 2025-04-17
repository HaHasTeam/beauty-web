import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Result from '@/components/result/Result'
import configs from '@/config'
import { ResultEnum } from '@/types/enum'

interface CheckoutResultAllProps {
  status: ResultEnum.SUCCESS | ResultEnum.FAILURE
  orderId: string
  isBooking?: boolean
}

export default function CheckoutResultAll({ status, orderId, isBooking = false }: CheckoutResultAllProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  // Xác định hành động và text trên nút theo loại kết quả (đặt hàng hoặc đặt lịch)
  const getLeftButtonAction = () => {
    if (status === ResultEnum.SUCCESS) {
      // Nếu là booking, đi đến trang danh sách booking
      if (isBooking) {
        return () => navigate(configs.routes.profileBookings)
      }
      // Nếu là order, đi đến chi tiết order
      return () => navigate(configs.routes.profileOrder + '/' + orderId)
    }
    return () => navigate(configs.routes.home)
  }
  
  const getLeftButtonText = () => {
    if (status === ResultEnum.SUCCESS) {
      return isBooking ? t('booking.viewBookings', 'Xem lịch đã đặt') : t('order.viewOrder')
    }
    return t('order.continueShopping')
  }
  
  return (
    <Result
      status={status}
      title={status === ResultEnum.SUCCESS ? 
        (isBooking ? t('booking.success', 'Đặt lịch thành công') : t('order.success')) : 
        t('order.failure')}
      description={status === ResultEnum.SUCCESS ? 
        (isBooking ? t('booking.successDescription', 'Bạn đã đặt lịch thành công!') : t('order.successDescription')) : 
        t('order.failureDescription')}
      leftButtonAction={getLeftButtonAction()}
      rightButtonAction={
        status === ResultEnum.SUCCESS
          ? () => navigate(configs.routes.home)
          : () => navigate(configs.routes.profileOrder + '/' + orderId)
      }
      leftButtonText={getLeftButtonText()}
      rightButtonText={status === ResultEnum.SUCCESS ? t('order.continueShopping') : t('order.tryAgain')}
    />
  )
}
