import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { History, MessageSquareText, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import AlertMessage from '@/components/alert/AlertMessage'
import BrandOrderInformation from '@/components/brand/BrandOrderInformation'
import CancelOrderDialog from '@/components/dialog/CancelOrderDialog'
import RequestCancelOrderDialog from '@/components/dialog/RequestCancelOrderDialog'
import Empty from '@/components/empty/Empty'
import LoadingIcon from '@/components/loading-icon'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
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
  getMyCancelRequestApi,
  getOrderByIdApi,
  getStatusTrackingByIdApi,
  updateOrderStatusApi,
} from '@/network/apis/order'
import { CancelOrderRequestStatusEnum, ShippingStatusEnum } from '@/types/enum'
import { ICancelRequestOrder } from '@/types/order'

const OrderDetail = () => {
  const { orderId } = useParams()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [openCancelOrderDialog, setOpenCancelOrderDialog] = useState<boolean>(false)
  const [openRequestCancelOrderDialog, setOpenRequestCancelOrderDialog] = useState<boolean>(false)
  const [isTrigger, setIsTrigger] = useState<boolean>(false)
  const [cancelRequests, setCancelRequests] = useState<ICancelRequestOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
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

  const { mutateAsync: getMyCancelRequestOrderFn } = useMutation({
    mutationKey: [getMyCancelRequestApi.mutationKey],
    mutationFn: getMyCancelRequestApi.fn,
    onSuccess: (data) => {
      setCancelRequests(data?.data)
      setIsLoading(false)
    },
  })
  useEffect(() => {
    const fetchCancelRequests = async () => {
      setIsLoading(true)
      await getMyCancelRequestOrderFn({})
    }
    fetchCancelRequests()
  }, [getMyCancelRequestOrderFn])

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
                cancelRequests &&
                cancelRequests?.some(
                  (request) =>
                    request?.order?.id === useOrderData?.data?.id &&
                    request.status === CancelOrderRequestStatusEnum.PENDING,
                ) && (
                  <AlertMessage
                    title={t('order.cancelRequestPendingTitle')}
                    message={t('order.cancelRequestPendingMessage')}
                    isShowIcon={false}
                  />
                )}
              {!isLoading &&
                cancelRequests &&
                cancelRequests?.some(
                  (request) =>
                    request?.order?.id === useOrderData?.data?.id &&
                    request.status === CancelOrderRequestStatusEnum.REJECTED,
                ) && (
                  <AlertMessage
                    className="bg-red-100"
                    color="danger"
                    isShowIcon={false}
                    title={t('order.cancelRequestRejectedTitle')}
                    message={t('order.cancelRequestRejectedMessage')}
                  />
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
                    recipientAvatar=""
                    recipientName={useOrderData?.data?.recipientName}
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
                {useOrderData?.data?.status === ShippingStatusEnum.PREPARING_ORDER &&
                  !isLoading &&
                  !cancelRequests?.some((cancelRequest) => cancelRequest?.order?.id === useOrderData?.data?.id) && (
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
                {useOrderData?.data?.status === ShippingStatusEnum.DELIVERED && (
                  <Button
                    variant="outline"
                    className="w-full border border-primary text-primary hover:text-primary hover:bg-primary/10"
                    onClick={() => {
                      handleUpdateStatus(ShippingStatusEnum.COMPLETED)
                    }}
                  >
                    {isLoading ? <LoadingIcon color="primaryBackground" /> : t('order.received')}
                  </Button>
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
      </div>
    </div>
  )
}

export default OrderDetail
