import { useLocation } from 'react-router-dom'

import CheckoutResultAll from '@/checkout-result/CheckoutResultAll'

const CheckoutResult = () => {
  const location = useLocation()
  const { orderData, status, isBooking } = location.state
  return (
    <div>
      <CheckoutResultAll 
        status={status} 
        orderId={orderData?.id ?? ''} 
        isBooking={isBooking || false} 
      />
    </div>
  )
}

export default CheckoutResult
