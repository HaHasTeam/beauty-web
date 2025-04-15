import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import configs from '@/config'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getMasterConfigApi } from '@/network/apis/master-config'
import { filterOrdersParentApi, getParentOrderByIdApi } from '@/network/apis/order'
import { payTransactionApi } from '@/network/apis/transaction'
import { PAY_TYPE } from '@/network/apis/transaction/type'
import { getMyWalletApi } from '@/network/apis/wallet'
import { OrderEnum, PaymentMethod } from '@/types/enum'
import { IOrder } from '@/types/order'
import { calculatePaymentCountdown } from '@/utils/order'

import AlertMessage from '../alert/AlertMessage'
import Button from '../button'
import { QRCodeAlertDialog } from '../payment'
import RePaymentDialog from '../payment/RePaymentDialog'
import CancelOrderDialog from './CancelOrderDialog'
import OrderItem from './OrderItem'

interface OrderParentItemProps {
  order: IOrder
  setIsTrigger: Dispatch<SetStateAction<boolean>>
}
const OrderParentItem = ({ order, setIsTrigger }: OrderParentItemProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { successToast } = useToast()
  const [isOpenQRCodePayment, setIsOpenQRCodePayment] = useState(false)
  const [openRepayment, setOpenRepayment] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentId, setPaymentId] = useState<string | undefined>(undefined)
  const [openCancelParentOrderDialog, setOpenCancelParentOrderDialog] = useState<boolean>(false)
  const [isChangePaymentMethod, setIsChangePaymentMethod] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const handleServerError = useHandleServerError()
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const { data: masterConfig } = useQuery({
    queryKey: [getMasterConfigApi.queryKey],
    queryFn: getMasterConfigApi.fn,
  })
  const { mutateAsync: payTransaction } = useMutation({
    mutationKey: [payTransactionApi.mutationKey],
    mutationFn: payTransactionApi.fn,
    onSuccess: () => {
      setIsLoading(false)
      successToast({
        message: t('payment.paymentSuccess'),
      })
      queryClient.invalidateQueries({
        queryKey: [filterOrdersParentApi.queryKey],
      })
      queryClient.invalidateQueries({
        queryKey: [getMyWalletApi.queryKey],
      })
      queryClient.invalidateQueries({
        queryKey: [getParentOrderByIdApi.queryKey],
      })
    },
    onError: (error) => {
      setIsLoading(false)
      handleServerError({ error })
    },
  })

  useEffect(() => {
    if (masterConfig && order) {
      setTimeLeft(calculatePaymentCountdown(order, masterConfig.data).timeLeft)
      const timer = setInterval(() => {
        setTimeLeft(calculatePaymentCountdown(order, masterConfig.data).timeLeft)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [order, masterConfig])

  const isShowPayment = useMemo(
    () => masterConfig && calculatePaymentCountdown(order, masterConfig.data).remainingTime > 0,
    [masterConfig, order],
  )

  const onPaymentSuccess = useCallback(() => {
    successToast({
      message: t('payment.paymentSuccess'),
    })
    setOpenRepayment(false)
    setIsLoading(false)
  }, [successToast, t])
  const onClose = useCallback(() => {
    setIsLoading(false)
    setOpenRepayment(false)
    if (isChangePaymentMethod) {
      queryClient.invalidateQueries({
        queryKey: [filterOrdersParentApi.queryKey],
      })
      queryClient.invalidateQueries({
        queryKey: [getMyWalletApi.queryKey],
      })
      queryClient.invalidateQueries({
        queryKey: [getParentOrderByIdApi.queryKey],
      })
    }
  }, [isChangePaymentMethod, queryClient])
  return (
    <div className="bg-white border rounded-md">
      {order.children?.map((orderItem) => (
        <div key={orderItem?.id}>
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
            total: t('productCard.currentPrice', { price: order.totalPrice }),
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
            {isShowPayment && (
              <>
                {order.type !== OrderEnum.GROUP_BUYING && !order.isPaymentMethodUpdated && (
                  <Button
                    variant="outline"
                    className="border border-primary text-primary hover:text-primary hover:bg-primary/10"
                    onClick={() => {
                      setOpenRepayment(true)
                    }}
                  >
                    {t('payment.changePaymentMethod')}
                  </Button>
                )}
                <Button
                  loading={isLoading}
                  onClick={() => {
                    if (order.paymentMethod === PaymentMethod.BANK_TRANSFER) {
                      setIsOpenQRCodePayment(true)
                      setPaymentId(order.id)
                      return
                    }
                    if (order.paymentMethod === PaymentMethod.WALLET) {
                      if (order && order.id) {
                        setIsLoading(true)
                        payTransaction({ orderId: order.id, id: order.id, type: PAY_TYPE.ORDER })
                      }
                      return
                    }
                  }}
                >
                  {t('order.payment')}
                </Button>
              </>
            )}
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
      <QRCodeAlertDialog
        amount={order.totalPrice}
        open={isOpenQRCodePayment}
        onOpenChange={setIsOpenQRCodePayment}
        type={PAY_TYPE.ORDER}
        paymentId={paymentId}
        onSuccess={onPaymentSuccess}
        onClose={onClose}
      />
      <RePaymentDialog
        onOpenChange={setOpenRepayment}
        open={openRepayment}
        orderId={order?.id}
        paymentMethod={order?.paymentMethod as PaymentMethod}
        setIsOpenQRCodePayment={setIsOpenQRCodePayment}
        setPaymentId={setPaymentId}
        totalPayment={order?.totalPrice}
        setIsChangePaymentMethod={setIsChangePaymentMethod}
      />
    </div>
  )
}

export default OrderParentItem
