import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { History, MessageSquareText, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import AlertMessage from '@/components/alert/AlertMessage'
import BrandOrderInformation from '@/components/brand/BrandOrderInformation'
import Empty from '@/components/empty/Empty'
import LoadingIcon from '@/components/loading-icon'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import CancelOrderDialog from '@/components/order/CancelOrderDialog'
import RequestCancelOrderDialog from '@/components/order/RequestCancelOrderDialog'
import { RequestReturnOrderDialog } from '@/components/order/RequestReturnOrderDialog'
import ReturnOrderSection from '@/components/order/ReturnOrderSection'
import OrderDetailItems from '@/components/order-detail/OrderDetailItems'
import OrderGeneral from '@/components/order-detail/OrderGeneral'
import OrderStatusTracking from '@/components/order-detail/OrderStatusTracking'
import OrderStatusTrackingDetail from '@/components/order-detail/OrderStatusTrackingDetail'
import OrderSummary from '@/components/order-detail/OrderSummary'
import OrderStatus from '@/components/order-status'
import { Button } from '@/components/ui/button'
import configs from '@/config'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import {
  getCancelAndReturnRequestApi,
  getOrderByIdApi,
  getRejectReturnRequestApi,
  getStatusTrackingByIdApi,
  updateOrderStatusApi,
} from '@/network/apis/order'
import { RequestStatusEnum, ShippingStatusEnum } from '@/types/enum'

const OrderDetail = () => {
  const PENDING_REQUEST_RETURN_DAYS = 2
  const PENDING_REQUEST_CANCEL_DAYS = 2
  const { orderId } = useParams()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [openCancelOrderDialog, setOpenCancelOrderDialog] = useState<boolean>(false)
  const [openRequestCancelOrderDialog, setOpenRequestCancelOrderDialog] = useState<boolean>(false)
  const [isTrigger, setIsTrigger] = useState<boolean>(false)
  const [openReqReturnDialog, setOpenReqReturnDialog] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()

  const { data: useOrderData, isFetching } = useQuery({
    queryKey: [getOrderByIdApi.queryKey, orderId ?? ('' as string)],
    queryFn: getOrderByIdApi.fn,
  })

  const { data: useStatusTrackingData, isFetching: isFetchingStatusTracking } = useQuery({
    queryKey: [getStatusTrackingByIdApi.queryKey, orderId ?? ('' as string)],
    queryFn: getStatusTrackingByIdApi.fn,
    enabled: !!orderId,
  })

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [getOrderByIdApi.queryKey],
    })
  }, [isTrigger, queryClient])

  const { data: cancelAndReturnRequestData } = useQuery({
    queryKey: [getCancelAndReturnRequestApi.queryKey, orderId ?? ('' as string)],
    queryFn: getCancelAndReturnRequestApi.fn,
    enabled: !!orderId,
  })
  const { data: rejectReturnRequest } = useQuery({
    queryKey: [getRejectReturnRequestApi.queryKey, orderId ?? ('' as string)],
    queryFn: getRejectReturnRequestApi.fn,
    enabled: !!orderId,
  })

  const { mutateAsync: updateOrderStatusFn } = useMutation({
    mutationKey: [updateOrderStatusApi.mutationKey],
    mutationFn: updateOrderStatusApi.fn,
    onSuccess: async () => {
      successToast({
        message: t('order.receivedOrderStatusSuccess'),
      })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [getOrderByIdApi.queryKey] }),
        queryClient.invalidateQueries({ queryKey: [getStatusTrackingByIdApi.queryKey] }),
      ])
    },
  })
  async function handleUpdateStatus(values: string) {
    try {
      setIsLoading(true)
      await updateOrderStatusFn({ id: useOrderData?.data?.id ?? '', status: values })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
      })
    }
  }
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
              {!isFetchingStatusTracking && useStatusTrackingData && useStatusTrackingData?.data && (
                <OrderStatusTracking statusTrackingData={useStatusTrackingData?.data} />
              )}

              {/* cancel request information */}
              {!isLoading &&
                cancelAndReturnRequestData?.data?.cancelOrderRequest?.status === RequestStatusEnum.PENDING && (
                  <AlertMessage
                    title={t('order.cancelRequestPendingTitle')}
                    message={t('order.cancelRequestPendingMessage', { count: PENDING_REQUEST_CANCEL_DAYS })}
                    isShowIcon={false}
                  />
                )}
              {!isLoading &&
                cancelAndReturnRequestData?.data?.cancelOrderRequest?.status === RequestStatusEnum.REJECTED && (
                  <AlertMessage
                    className="bg-red-100"
                    color="danger"
                    isShowIcon={false}
                    title={t('order.cancelRequestRejectedTitle')}
                    message={t('order.cancelRequestRejectedMessage')}
                  />
                )}

              {/* return request information */}
              {!isLoading &&
                (cancelAndReturnRequestData?.data?.refundRequest?.status === RequestStatusEnum.PENDING ||
                  (cancelAndReturnRequestData?.data?.refundRequest?.status === RequestStatusEnum.REJECTED &&
                    rejectReturnRequest?.data?.status === RequestStatusEnum.PENDING)) && (
                  <AlertMessage
                    title={t('return.returnRequestPendingTitleCustomer')}
                    message={t('return.returnRequestPendingMessageCustomer', { count: PENDING_REQUEST_RETURN_DAYS })}
                    isShowIcon={false}
                  />
                )}
              {!isLoading &&
                (cancelAndReturnRequestData?.data?.refundRequest?.status === RequestStatusEnum.REJECTED ||
                  (cancelAndReturnRequestData?.data?.refundRequest?.status === RequestStatusEnum.REJECTED &&
                    rejectReturnRequest?.data?.status === RequestStatusEnum.APPROVED)) && (
                  <AlertMessage
                    className="bg-red-100"
                    color="danger"
                    isShowIcon={false}
                    title={t('return.returnRequestRejectedTitleCustomer')}
                    message={t('return.returnRequestRejectedMessageCustomer')}
                  />
                )}

              {!isLoading &&
                (cancelAndReturnRequestData?.data?.refundRequest?.status === RequestStatusEnum.APPROVED ||
                  (cancelAndReturnRequestData?.data?.refundRequest?.status === RequestStatusEnum.REJECTED &&
                    rejectReturnRequest?.data?.status === RequestStatusEnum.REJECTED)) && (
                  <ReturnOrderSection orderId={useOrderData?.data?.id} />
                )}

              {/* order customer timeline, information, shipment */}
              <div className="flex flex-col md:flex-row gap-4 justify-between w-full items-stretch">
                <div className="w-full md:w-1/2 flex">
                  <OrderGeneral
                    title={t('orderDetail.timeline')}
                    icon={<History />}
                    content={
                      !isFetchingStatusTracking && useStatusTrackingData && useStatusTrackingData?.data ? (
                        <OrderStatusTrackingDetail statusTrackingData={useStatusTrackingData?.data} />
                      ) : (
                        <p></p>
                      )
                    }
                  />
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-2">
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
                  <OrderGeneral
                    title={t('orderDetail.message')}
                    icon={<MessageSquareText />}
                    content={
                      <p className="text-sm md:text-base">
                        <span className="font-medium">{t('orderDetail.message')}: </span>
                        {useOrderData?.data?.message && useOrderData?.data?.message !== ''
                          ? useOrderData?.data?.message
                          : t('orderDetail.no')}
                      </p>
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
                  brandLogo={
                    (
                      useOrderData?.data?.orderDetails?.[0]?.productClassification?.preOrderProduct ??
                      useOrderData?.data?.orderDetails?.[0]?.productClassification?.productDiscount ??
                      useOrderData?.data?.orderDetails?.[0]?.productClassification
                    )?.product?.brand?.logo ?? 'Brand'
                  }
                />

                {/* order items */}
                <div>
                  {/* order items */}
                  <OrderDetailItems
                    orderDetails={useOrderData?.data?.orderDetails}
                    status={useOrderData?.data?.status}
                    brand={
                      (
                        useOrderData?.data?.orderDetails?.[0]?.productClassification?.preOrderProduct ??
                        useOrderData?.data?.orderDetails?.[0]?.productClassification?.productDiscount ??
                        useOrderData?.data?.orderDetails?.[0]?.productClassification
                      )?.product?.brand ?? null
                    }
                    accountAvatar={useOrderData?.data?.account?.avatar ?? ''}
                    accountName={useOrderData?.data?.account?.username ?? ''}
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
                <div className="w-full flex items-center flex-1 gap-2">
                  {(cancelAndReturnRequestData?.data?.cancelOrderRequest?.status === RequestStatusEnum.PENDING ||
                    cancelAndReturnRequestData?.data?.cancelOrderRequest?.status === RequestStatusEnum.APPROVED ||
                    cancelAndReturnRequestData?.data?.cancelOrderRequest?.status === RequestStatusEnum.REJECTED) && (
                    <div className="w-full">
                      <Button
                        variant="outline"
                        className="w-full border border-primary text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => setOpenRequestCancelOrderDialog(true)}
                      >
                        {t('order.cancelOrder')}
                      </Button>
                    </div>
                  )}
                  {useOrderData?.data?.status === ShippingStatusEnum.DELIVERED &&
                    !cancelAndReturnRequestData?.data?.refundRequest && (
                      <Button
                        variant="default"
                        className="w-full hover:bg-primary/80"
                        onClick={() => {
                          handleUpdateStatus(ShippingStatusEnum.COMPLETED)
                        }}
                      >
                        {isLoading ? <LoadingIcon color="primaryBackground" /> : t('order.received')}
                      </Button>
                    )}
                  {useOrderData?.data?.status === ShippingStatusEnum.DELIVERED &&
                    !cancelAndReturnRequestData?.data?.refundRequest && (
                      <Button
                        variant="outline"
                        type="button"
                        className="w-full border border-primary text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => setOpenReqReturnDialog(true)}
                      >
                        {isLoading ? <LoadingIcon color="primaryBackground" /> : t('order.returnOrder')}
                      </Button>
                    )}
                </div>
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
            setOpen={setOpenCancelOrderDialog}
            onOpenChange={setOpenCancelOrderDialog}
            setIsTrigger={setIsTrigger}
            orderId={useOrderData?.data?.id ?? ''}
          />
        )}
        {!isFetching && useOrderData?.data && (
          <RequestCancelOrderDialog
            open={openRequestCancelOrderDialog}
            setOpen={setOpenRequestCancelOrderDialog}
            onOpenChange={setOpenRequestCancelOrderDialog}
            setIsTrigger={setIsTrigger}
            orderId={useOrderData?.data?.id ?? ''}
          />
        )}
        {!isFetching && useOrderData?.data && (
          <RequestReturnOrderDialog
            open={openReqReturnDialog}
            setOpen={setOpenReqReturnDialog}
            onOpenChange={setOpenReqReturnDialog}
            setIsTrigger={setIsTrigger}
            orderId={useOrderData?.data?.id ?? ''}
          />
        )}
      </div>
    </div>
  )
}

export default OrderDetail
