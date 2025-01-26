import { useQuery, useQueryClient } from '@tanstack/react-query'
import { MessageSquareText, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import BrandOrderInformation from '@/components/brand/BrandOrderInformation'
import CancelOrderDialog from '@/components/dialog/CancelOrderDialog'
import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import OrderDetailItems from '@/components/order-detail/OrderDetailItems'
import OrderGeneral from '@/components/order-detail/OrderGeneral'
import OrderStatusTracking from '@/components/order-detail/OrderStatusTracking'
import OrderSummary from '@/components/order-detail/OrderSummary'
import OrderStatus from '@/components/order-status'
import { Button } from '@/components/ui/button'
import configs from '@/config'
import { getOrderByIdApi } from '@/network/apis/order'
import { ShippingStatusEnum } from '@/types/enum'

const OrderDetail = () => {
  const { orderId } = useParams()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [openCancelOrderDialog, setOpenCancelOrderDialog] = useState<boolean>(false)
  const [isTrigger, setIsTrigger] = useState<boolean>(false)

  const { data: useOrderData, isFetching } = useQuery({
    queryKey: [getOrderByIdApi.queryKey, orderId ?? ('' as string)],
    queryFn: getOrderByIdApi.fn,
  })

  useEffect(() => {
    if (isTrigger) {
      queryClient.invalidateQueries({
        queryKey: [getOrderByIdApi.queryKey],
      })
    }
  }, [isTrigger, queryClient])

  return (
    <div>
      {isFetching && <LoadingContentLayer />}
      <div className="w-full lg:px-5 md:px-4 sm:px-3 px-3 space-y-6 my-5">
        <div className="flex gap-2 w-full sm:justify-between sm:items-center sm:flex-row flex-col">
          <div className="flex gap-2 sm:items-center sm:flex-row flex-col">
            <span className="text-lg text-muted-foreground font-medium">{t('orderDetail.title')}</span>
            {!isFetching && useOrderData?.data && (
              <span className="text-lg text-muted-foreground">#{useOrderData?.data?.id}</span>
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
              {/* order status tracking */}
              <OrderStatusTracking currentStatus={useOrderData?.data?.status} />

              {/* order customer information, shipment */}
              <div className="flex flex-col md:flex-row gap-4 justify-between w-full items-stretch">
                <div className="w-full md:w-1/2 flex">
                  <OrderGeneral
                    title={t('orderDetail.shippingAddress')}
                    icon={<Truck />}
                    content={
                      <div className="flex flex-col gap-1 text-sm md:text-base">
                        <span>
                          {t('orderDetail.recipientName')}: {useOrderData?.data?.recipientName}
                        </span>
                        <span>
                          {t('orderDetail.address')}: {useOrderData?.data?.shippingAddress}
                        </span>
                        <span>
                          {t('orderDetail.phone')}: {useOrderData?.data?.phone}
                        </span>
                        <span>
                          {t('orderDetail.notes')}: {useOrderData?.data?.notes ?? t('orderDetail.no')}
                        </span>
                      </div>
                    }
                  />
                </div>
                <div className="w-full md:w-1/2 flex">
                  <OrderGeneral
                    title={t('orderDetail.message')}
                    icon={<MessageSquareText />}
                    content={
                      <span className="text-sm md:text-base">
                        {t('orderDetail.message')}:{' '}
                        {useOrderData?.data?.message && useOrderData?.data?.message !== ''
                          ? useOrderData?.data?.message
                          : t('orderDetail.no')}
                      </span>
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                {/* brand */}
                <BrandOrderInformation
                  brandId={
                    (
                      useOrderData?.data?.orderDetails?.[0]?.productClassification?.preOrderProduct ??
                      useOrderData?.data?.orderDetails?.[0]?.productClassification?.productDiscount ??
                      useOrderData?.data?.orderDetails?.[0]?.productClassification
                    )?.product?.brand?.id ?? ''
                  }
                  brandName={
                    (
                      useOrderData?.data?.orderDetails?.[0]?.productClassification?.preOrderProduct ??
                      useOrderData?.data?.orderDetails?.[0]?.productClassification?.productDiscount ??
                      useOrderData?.data?.orderDetails?.[0]?.productClassification
                    )?.product?.brand?.name ?? 'Brand'
                  }
                />

                {/* order items */}
                <div>
                  {/* order items */}
                  <OrderDetailItems
                    orderDetails={useOrderData?.data?.orderDetails}
                    status={useOrderData?.data?.status}
                  />

                  {/* order summary */}
                  <OrderSummary
                    totalProductCost={useOrderData?.data?.subTotal}
                    totalBrandDiscount={useOrderData?.data?.shopVoucherDiscount}
                    totalPlatformDiscount={useOrderData?.data?.platformVoucherDiscount}
                    totalPayment={useOrderData?.data?.totalPrice}
                    paymentMethod={useOrderData?.data?.paymentMethod}
                  />
                </div>
                {(useOrderData?.data?.status === ShippingStatusEnum.TO_PAY ||
                  useOrderData?.data?.status === ShippingStatusEnum.WAIT_FOR_CONFIRMATION) && (
                  <div className="w-full">
                    <Button
                      variant="outline"
                      className="w-full border border-primary text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => setOpenCancelOrderDialog(true)}
                    >
                      {t('order.cancelOrder')}
                    </Button>
                  </div>
                )}
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
            open={openCancelOrderDialog}
            onOpenChange={setOpenCancelOrderDialog}
            setIsTrigger={setIsTrigger}
            orderId={useOrderData?.data?.id ?? ''}
          />
        )}
      </div>
    </div>
  )
}

export default OrderDetail
