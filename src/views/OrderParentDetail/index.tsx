import { useQuery, useQueryClient } from '@tanstack/react-query'
import { MessageSquareText, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import AlertMessage from '@/components/alert/AlertMessage'
import BrandOrderInformation from '@/components/brand/BrandOrderInformation'
import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import CancelOrderDialog from '@/components/order/CancelOrderDialog'
import OrderDetailItems from '@/components/order-detail/OrderDetailItems'
import OrderGeneral from '@/components/order-detail/OrderGeneral'
import OrderSummary from '@/components/order-detail/OrderSummary'
import OrderStatus from '@/components/order-status'
import { Button } from '@/components/ui/button'
import configs from '@/config'
import { getMasterConfigApi } from '@/network/apis/master-config'
import { getParentOrderByIdApi, getStatusTrackingByIdApi } from '@/network/apis/order'
import { PaymentMethod, ShippingStatusEnum } from '@/types/enum'
import { calculatePaymentCountdown } from '@/utils/order'

const OrderParentDetail = () => {
  const { orderId } = useParams()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [openCancelParentOrderDialog, setOpenCancelParentOrderDialog] = useState<boolean>(false)
  const [isTrigger, setIsTrigger] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const { data: useOrderData, isFetching } = useQuery({
    queryKey: [getParentOrderByIdApi.queryKey, orderId ?? ('' as string)],
    queryFn: getParentOrderByIdApi.fn,
  })

  const { data: useStatusTrackingData } = useQuery({
    queryKey: [getStatusTrackingByIdApi.queryKey, orderId ?? ('' as string)],
    queryFn: getStatusTrackingByIdApi.fn,
    enabled: !!orderId,
  })
  const { data: masterConfig } = useQuery({
    queryKey: [getMasterConfigApi.queryKey],
    queryFn: getMasterConfigApi.fn,
  })

  useEffect(() => {
    if (masterConfig && useOrderData && useOrderData.data) {
      setTimeLeft(calculatePaymentCountdown(useOrderData.data, masterConfig.data))
      const timer = setInterval(() => {
        setTimeLeft(calculatePaymentCountdown(useOrderData.data, masterConfig.data))
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [useOrderData, masterConfig])

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [getParentOrderByIdApi.queryKey],
    })
  }, [isTrigger, queryClient])

  return (
    <div>
      {isFetching && <LoadingContentLayer />}
      <div className="w-full lg:px-5 md:px-4 sm:px-3 px-3 space-y-6 my-5">
        <div className="flex gap-2 w-full sm:justify-between sm:items-center sm:flex-row flex-col">
          <div className="flex gap-2 items-center">
            <span className="text-lg text-muted-foreground font-medium">{t('orderDetail.title')}</span>
            {!isFetching && useOrderData?.data && (
              <span className="text-lg text-muted-foreground">
                #{useOrderData?.data?.id?.substring(0, 8).toUpperCase()}
              </span>
            )}
          </div>
          {!isFetching && useOrderData?.data && (
            <div className="flex gap-2 items-center">
              <span className="text-muted-foreground font-medium">{t('orderDetail.status')}: </span>
              <OrderStatus tag={useOrderData?.data?.status ?? ''} size="medium" />
            </div>
          )}
        </div>
        {!isFetching && useOrderData && useOrderData?.data && (
          <>
            <div className="space-y-6 w-full">
              {/* payment */}
              {useOrderData.data.paymentMethod === PaymentMethod.WALLET &&
                useOrderData.data.status === ShippingStatusEnum.TO_PAY && (
                  <AlertMessage
                    title={t('order.paymentTitle')}
                    message={t('payment.notifyPayment', {
                      val:
                        String(timeLeft.hours).padStart(2, '0') +
                        ':' +
                        String(timeLeft.minutes).padStart(2, '0') +
                        ':' +
                        String(timeLeft.seconds).padStart(2, '0'),
                      method:
                        useOrderData?.data.paymentMethod === PaymentMethod.WALLET
                          ? t('wallet.WALLET')
                          : useOrderData?.data.paymentMethod === PaymentMethod.BANK_TRANSFER
                            ? t('payment.methods.bank_transfer')
                            : t('payment.methods.cash'),
                    })}
                    isShowIcon={false}
                    buttonText="payment"
                    onClick={() => {}}
                  />
                )}

              {/* order customer timeline, information, shipment */}
              <div className="flex flex-col md:flex-row gap-4 justify-between w-full items-stretch">
                <div className="w-full flex flex-col gap-2">
                  <OrderGeneral
                    title={t('orderDetail.shippingAddress')}
                    icon={<Truck />}
                    content={
                      <div className="flex flex-col gap-1 text-sm md:text-base">
                        <p>
                          <span className="font-medium">{t('orderDetail.recipientName')}:</span>{' '}
                          {useOrderData?.data?.recipientName}
                        </p>
                        <p>
                          <span className="font-medium">{t('orderDetail.address')}:</span>{' '}
                          {useOrderData?.data?.shippingAddress}
                        </p>
                        <p>
                          <span className="font-medium">{t('orderDetail.phone')}:</span> {useOrderData?.data?.phone}
                        </p>
                        <p>
                          <span className="font-medium">{t('orderDetail.notes')}:</span>{' '}
                          {useOrderData?.data?.notes ?? t('orderDetail.no')}
                        </p>
                      </div>
                    }
                  />
                </div>
              </div>

              {useOrderData.data.children.length > 0 &&
                useOrderData.data.children.map((orderItem) => (
                  <div className="space-y-2">
                    {/* brand */}
                    <BrandOrderInformation
                      brandId={
                        (
                          orderItem?.orderDetails?.[0]?.productClassification?.preOrderProduct ??
                          orderItem?.orderDetails?.[0]?.productClassification?.productDiscount ??
                          orderItem?.orderDetails?.[0]?.productClassification
                        )?.product?.brand?.id ?? ''
                      }
                      brandName={
                        (
                          orderItem?.orderDetails?.[0]?.productClassification?.preOrderProduct ??
                          orderItem?.orderDetails?.[0]?.productClassification?.productDiscount ??
                          orderItem?.orderDetails?.[0]?.productClassification
                        )?.product?.brand?.name ?? 'Brand'
                      }
                      brandLogo={
                        (
                          orderItem?.orderDetails?.[0]?.productClassification?.preOrderProduct ??
                          orderItem?.orderDetails?.[0]?.productClassification?.productDiscount ??
                          orderItem?.orderDetails?.[0]?.productClassification
                        )?.product?.brand?.logo ?? 'Brand'
                      }
                    />

                    {/* order children items */}
                    <div>
                      {/* order items */}
                      <OrderDetailItems
                        orderDetails={orderItem?.orderDetails}
                        status={orderItem?.status}
                        brand={
                          (
                            orderItem?.orderDetails?.[0]?.productClassification?.preOrderProduct ??
                            orderItem?.orderDetails?.[0]?.productClassification?.productDiscount ??
                            orderItem?.orderDetails?.[0]?.productClassification
                          )?.product?.brand ?? null
                        }
                        accountAvatar={orderItem?.account?.avatar ?? ''}
                        accountName={orderItem?.account?.username ?? ''}
                        masterConfig={masterConfig?.data}
                        statusTracking={useStatusTrackingData?.data}
                      />

                      {/* order summary */}
                      <OrderSummary
                        totalProductCost={orderItem?.subTotal}
                        totalBrandDiscount={orderItem?.shopVoucherDiscount}
                        totalPlatformDiscount={orderItem?.platformVoucherDiscount}
                        totalPayment={orderItem?.totalPrice}
                        paymentMethod={orderItem?.paymentMethod}
                      />
                    </div>

                    <OrderGeneral
                      title={t('orderDetail.message')}
                      icon={<MessageSquareText />}
                      content={
                        <p className="text-sm md:text-base">
                          <span className="font-medium">{t('orderDetail.message')}: </span>
                          {orderItem?.message && orderItem?.message !== '' ? orderItem?.message : t('orderDetail.no')}
                        </p>
                      }
                    />
                  </div>
                ))}
              <div className="flex items-center gap-3 w-full justify-between">
                <Button
                  variant="outline"
                  className="w-1/3 border border-primary text-primary hover:text-primary hover:bg-primary/10"
                  onClick={() => setOpenCancelParentOrderDialog(true)}
                >
                  {t('order.cancelOrder')}
                </Button>
                <Button
                  variant="outline"
                  className="w-1/3 border border-primary text-primary hover:text-primary hover:bg-primary/10"
                  onClick={() => {}}
                >
                  {t('payment.changePaymentMethod')}
                </Button>
                <Button className="w-1/3">{t('order.payment')}</Button>
              </div>
            </div>
          </>
        )}
        {!isFetching && (!useOrderData || !useOrderData?.data) && (
          <Empty
            title={t('empty.orderDetail.title')}
            description={t('empty.orderDetail.description')}
            link={configs.routes.profileOrder}
            linkText={t('empty.orderDetail.button')}
          />
        )}
        {!isFetching && useOrderData?.data && (
          <CancelOrderDialog
            open={openCancelParentOrderDialog}
            setOpen={setOpenCancelParentOrderDialog}
            onOpenChange={setOpenCancelParentOrderDialog}
            setIsTrigger={setIsTrigger}
            orderId={useOrderData?.data?.id ?? ''}
            isParent
          />
        )}
      </div>
    </div>
  )
}

export default OrderParentDetail
