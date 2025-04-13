import { useQuery } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import configs from '@/config'
import { getMasterConfigApi } from '@/network/apis/master-config'
import { PaymentMethod } from '@/types/enum'
import { IOrder } from '@/types/order'
import { calculatePaymentCountdown } from '@/utils/order'

import AlertMessage from '../alert/AlertMessage'
import Button from '../button'
import CancelOrderDialog from './CancelOrderDialog'
import OrderItem from './OrderItem'

interface OrderParentItemProps {
  order: IOrder
  setIsTrigger: Dispatch<SetStateAction<boolean>>
}
const OrderParentItem = ({ order, setIsTrigger }: OrderParentItemProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [openCancelParentOrderDialog, setOpenCancelParentOrderDialog] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const { data: masterConfig } = useQuery({
    queryKey: [getMasterConfigApi.queryKey],
    queryFn: getMasterConfigApi.fn,
  })

  useEffect(() => {
    if (masterConfig && order) {
      setTimeLeft(calculatePaymentCountdown(order, masterConfig.data))
      const timer = setInterval(() => {
        setTimeLeft(calculatePaymentCountdown(order, masterConfig.data))
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [order, masterConfig])

  return (
    <div className="bg-white border rounded-md">
      {order.children?.map((orderItem) => (
        <div key={order?.id}>
          <OrderItem
            brand={
              orderItem?.orderDetails[0]?.productClassification?.preOrderProduct?.product?.brand ??
              orderItem?.orderDetails[0]?.productClassification?.productDiscount?.product?.brand ??
              orderItem?.orderDetails[0]?.productClassification?.product?.brand ??
              null
            }
            orderItem={orderItem}
            setIsTrigger={setIsTrigger}
            isShowAction={false}
            orderId={order?.id}
          />
        </div>
      ))}
      <div className="px-4 w-full">
        <AlertMessage
          message={t('payment.notifyPayment', {
            val:
              String(timeLeft.hours).padStart(2, '0') +
              ':' +
              String(timeLeft.minutes).padStart(2, '0') +
              ':' +
              String(timeLeft.seconds).padStart(2, '0'),
            method:
              order.paymentMethod === PaymentMethod.WALLET
                ? t('payment.methods.wallet')
                : order.paymentMethod === PaymentMethod.BANK_TRANSFER
                  ? t('payment.methods.bank_transfer')
                  : t('payment.methods.cash'),
          })}
        />
      </div>
      <div className="px-4 pb-3 w-full">
        <div className="flex flex-col items-end md:flex-row md:justify-between gap-2 pt-4 md:items-center">
          <div>
            <span className="text-gray-700 lg:text-base md:text-sm text-xs">
              {t('order.lastUpdated')}: {t('date.toLocaleDateTimeString', { val: new Date(order?.updatedAt) })}
            </span>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <Button
              variant="outline"
              className="border border-primary text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => navigate(configs.routes.profileOrderOrigin + '/' + order?.id)}
            >
              {t('order.viewDetail')}
            </Button>
            <Button
              variant="outline"
              className="border border-primary text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => setOpenCancelParentOrderDialog(true)}
            >
              {t('order.cancelOrder')}
            </Button>
            <Button
              variant="outline"
              className="border border-primary text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => {}}
            >
              {t('payment.changePaymentMethod')}
            </Button>
            <Button>{t('order.payment')}</Button>
          </div>
        </div>
      </div>
      <CancelOrderDialog
        open={openCancelParentOrderDialog}
        setOpen={setOpenCancelParentOrderDialog}
        onOpenChange={setOpenCancelParentOrderDialog}
        setIsTrigger={setIsTrigger}
        orderId={order?.id ?? ''}
        isParent
      />
    </div>
  )
}

export default OrderParentItem
