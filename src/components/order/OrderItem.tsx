import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MessageCircle, Store } from 'lucide-react'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import configs from '@/config'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { createCartItemApi, getMyCartApi } from '@/network/apis/cart'
import { getMasterConfigApi } from '@/network/apis/master-config'
import {
  getCancelAndReturnRequestApi,
  getOrderByIdApi,
  getStatusTrackingByIdApi,
  updateOrderStatusApi,
} from '@/network/apis/order'
import { IBrand } from '@/types/brand'
import { OrderEnum, RequestStatusEnum, ShippingStatusEnum } from '@/types/enum'
import { IOrderItem } from '@/types/order'

import LoadingIcon from '../loading-icon'
import OrderStatus from '../order-status'
import { getRequestStatusColor } from '../request-status'
import { Button } from '../ui/button'
import CancelOrderDialog from './CancelOrderDialog'
import ProductOrderLandscape from './ProductOrderLandscape'
import RequestCancelOrderDialog from './RequestCancelOrderDialog'
import { RequestReturnOrderDialog } from './RequestReturnOrderDialog'

interface OrderItemProps {
  brand: IBrand | null
  orderItem: IOrderItem
  setIsTrigger: Dispatch<SetStateAction<boolean>>
}
const OrderItem = ({ brand, orderItem, setIsTrigger }: OrderItemProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [openCancelOrderDialog, setOpenCancelOrderDialog] = useState<boolean>(false)
  const [openRequestCancelOrderDialog, setOpenRequestCancelOrderDialog] = useState<boolean>(false)
  const [openReqReturnDialog, setOpenReqReturnDialog] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)

  const { data: cancelAndReturnRequestData } = useQuery({
    queryKey: [getCancelAndReturnRequestApi.queryKey, orderItem.id ?? ('' as string)],
    queryFn: getCancelAndReturnRequestApi.fn,
    enabled: !!orderItem.id,
  })
  const { data: useStatusTrackingData } = useQuery({
    queryKey: [getStatusTrackingByIdApi.queryKey, orderItem.id ?? ('' as string)],
    queryFn: getStatusTrackingByIdApi.fn,
    enabled: !!orderItem.id,
  })
  const { data: masterConfig } = useQuery({
    queryKey: [getMasterConfigApi.queryKey],
    queryFn: getMasterConfigApi.fn,
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const { successToast } = useToast()
  const queryClient = useQueryClient()
  const handleServerError = useHandleServerError()
  const { mutateAsync: createCartItemFn } = useMutation({
    mutationKey: [createCartItemApi.mutationKey],
    mutationFn: createCartItemApi.fn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [getMyCartApi.queryKey],
      })
      successToast({
        message: t('cart.addToCartSuccess'),
        isShowDescription: false,
      })
    },
  })

  const handleCreateCartItem = async () => {
    if (isProcessing) return
    setIsProcessing(true)
    try {
      if (orderItem?.orderDetails?.length) {
        await Promise.all(
          orderItem.orderDetails.map((productOrder) =>
            createCartItemFn({
              classification: productOrder?.productClassification?.title,
              productClassification: productOrder?.productClassification?.id,
              quantity: 1,
            }),
          ),
        )
      }
    } catch (error) {
      handleServerError({ error })
    } finally {
      setIsProcessing(false)
    }
  }

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
      setIsTrigger((prev) => !prev)
    },
  })
  async function handleUpdateStatus(values: string) {
    try {
      setIsLoading(true)
      await updateOrderStatusFn({ id: orderItem?.id, status: values })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
      })
    }
  }

  const showReturnButton = useMemo(() => {
    const isOrderDeliveredRecently = () => {
      const deliveredStatusTrack = useStatusTrackingData?.data?.find(
        (track) => track.status === ShippingStatusEnum.DELIVERED,
      )

      if (!deliveredStatusTrack?.createdAt) return false

      const deliveredDate = new Date(deliveredStatusTrack.createdAt)
      const currentDate = new Date()
      const allowedTimeInMs = masterConfig?.data[0].refundTimeExpired
        ? parseInt(masterConfig?.data[0].refundTimeExpired)
        : null
      console.log(currentDate.getTime() - deliveredDate.getTime())
      return allowedTimeInMs ? currentDate.getTime() - deliveredDate.getTime() <= allowedTimeInMs : true
    }
    return (
      (orderItem?.status === ShippingStatusEnum.DELIVERED || orderItem?.status === ShippingStatusEnum.COMPLETED) &&
      !cancelAndReturnRequestData?.data?.refundRequest &&
      isOrderDeliveredRecently()
    )
  }, [
    cancelAndReturnRequestData?.data?.refundRequest,
    masterConfig?.data,
    orderItem?.status,
    useStatusTrackingData?.data,
  ])
  const showReceivedButton = useMemo(() => {
    const isOrderDeliveredRecently = () => {
      const deliveredStatusTrack = useStatusTrackingData?.data?.find(
        (track) => track.status === ShippingStatusEnum.DELIVERED,
      )

      if (!deliveredStatusTrack?.createdAt) return false

      const deliveredDate = new Date(deliveredStatusTrack.createdAt)
      const currentDate = new Date()
      const allowedTimeInMs = masterConfig?.data[0].expiredCustomerReceivedTime
        ? parseInt(masterConfig?.data[0].expiredCustomerReceivedTime)
        : null
      console.log(currentDate.getTime() - deliveredDate.getTime())
      return allowedTimeInMs ? currentDate.getTime() - deliveredDate.getTime() <= allowedTimeInMs : true
    }
    return (
      orderItem?.status === ShippingStatusEnum.DELIVERED &&
      !cancelAndReturnRequestData?.data?.refundRequest &&
      isOrderDeliveredRecently()
    )
  }, [
    cancelAndReturnRequestData?.data?.refundRequest,
    masterConfig?.data,
    orderItem?.status,
    useStatusTrackingData?.data,
  ])

  return (
    <>
      <div className="p-4">
        {/* Order Item Header */}
        <div className="flex flex-col-reverse gap-2 md:flex-row items-start md:justify-between md:items-center border-b py-2 mb-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-red-500" />
              <Link to={configs.routes.brands + `/${brand?.id}`}>
                <span className="font-medium">{brand?.name}</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Button className="flex-1 md:flex-none bg-primary hover:bg-primary/80" variant="default" size="sm">
                <MessageCircle className="w-4 h-4" />
                {t('brand.chat')}
              </Button>
              <Link
                to={configs.routes.brands + '/' + brand?.id}
                className="hidden md:flex py-1.5 px-2 rounded-md items-center flex-1 md:flex-none border border-primary text-primary hover:text-primary hover:bg-primary/10 text-sm"
              >
                <Store className="w-4 h-4 mr-2" />
                {t('brand.viewShop')}
              </Link>
            </div>
          </div>
          {/* Order and request status */}
          <div className="flex flex-col items-end gap-1">
            {/* Order Status */}
            <div className="flex items-center">
              {/* {cancelAndReturnRequestData?.data?.refundRequest &&
              (cancelAndReturnRequestData?.data?.refundRequest?.status === RequestStatusEnum.PENDING ||
                (cancelAndReturnRequestData?.data?.refundRequest?.status === RequestStatusEnum.REJECTED &&
                  cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest?.status ===
                    RequestStatusEnum.PENDING)) ? (
                <OrderStatus tag={ShippingStatusEnum.PENDING_RETURN_APPROVED} />
              ) : cancelAndReturnRequestData?.data?.cancelRequest &&
                cancelAndReturnRequestData?.data?.cancelRequest?.status === RequestStatusEnum.PENDING ? (
                <OrderStatus tag={ShippingStatusEnum.PENDING_CANCELLATION} />
              ) : (
                <OrderStatus tag={orderItem?.status} />
              )} */}
              <OrderStatus tag={orderItem?.status} />
            </div>
          </div>
        </div>

        {/* Product list */}
        {orderItem?.orderDetails && orderItem?.orderDetails?.length > 0
          ? orderItem?.orderDetails?.map((productOder) => (
              <Link to={configs.routes.profileOrder + '/' + orderItem?.id} key={productOder?.id}>
                <div className="border-b mb-2">
                  <ProductOrderLandscape
                    orderDetail={productOder}
                    product={
                      productOder?.productClassification?.preOrderProduct?.product ??
                      productOder?.productClassification?.productDiscount?.product ??
                      productOder?.productClassification?.product
                    }
                    productClassification={productOder?.productClassification}
                    productType={
                      productOder?.productClassification?.preOrderProduct?.product
                        ? OrderEnum.PRE_ORDER
                        : productOder?.productClassification?.productDiscount?.product
                          ? OrderEnum.FLASH_SALE
                          : OrderEnum.NORMAL
                    }
                  />
                </div>
              </Link>
            ))
          : null}
        {/* total price */}
        <div className="w-full ml-auto flex justify-end gap-1 text-lg">
          <span className="text-muted-foreground font-medium">{t('cart.totalPrice')}: </span>
          <span className="text-red-500 font-semibold">{t('productCard.price', { price: orderItem?.totalPrice })}</span>
        </div>

        {/* Request Status Information (Enhanced) */}
        {(cancelAndReturnRequestData?.data?.refundRequest ||
          cancelAndReturnRequestData?.data?.cancelRequest ||
          cancelAndReturnRequestData?.data?.complaintRequest) && (
          <div className="mt-2 py-2 border-y">
            {cancelAndReturnRequestData?.data?.cancelRequest && (
              <div className="flex justify-between items-center">
                <span className="font-medium">{t('request.cancelRequest')}</span>
                <span
                  className={`px-2 py-1 rounded-full uppercase font-bold cursor-default text-xs ${getRequestStatusColor(
                    cancelAndReturnRequestData?.data?.cancelRequest?.status,
                  )}`}
                >
                  {t(`request.status.BRAND_${cancelAndReturnRequestData?.data?.cancelRequest?.status}`)}
                </span>
              </div>
            )}
            {cancelAndReturnRequestData?.data?.refundRequest && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t('request.returnRequest')}</span>
                  <span
                    className={`px-2 py-1 rounded-full uppercase font-bold cursor-default text-xs ${getRequestStatusColor(
                      cancelAndReturnRequestData?.data?.refundRequest?.status,
                    )}`}
                  >
                    {t(`request.status.BRAND_${cancelAndReturnRequestData?.data?.refundRequest?.status}`)}
                  </span>
                </div>

                {/* Show rejection details if applicable */}
                {cancelAndReturnRequestData?.data?.refundRequest?.status === RequestStatusEnum.REJECTED && (
                  <>
                    {/* Show pending counter-request if any */}
                    {cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest && (
                      <div className="">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{t('request.appealRequest')}</span>
                          <span
                            className={`px-2 py-1 rounded-full uppercase font-bold cursor-default text-xs ${getRequestStatusColor(
                              cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest?.status,
                            )}`}
                          >
                            {t(
                              `request.status.ADMIN_${cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest?.status}`,
                            )}
                          </span>
                        </div>
                        {cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest?.status ===
                          RequestStatusEnum.PENDING && (
                          <div className="text-sm text-gray-600 mt-1">{t('request.awaitingResponse')}</div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {cancelAndReturnRequestData?.data?.complaintRequest && (
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t('request.complaintRequest')}</span>
                  <span
                    className={`px-2 py-1 rounded-full uppercase font-bold cursor-default text-xs ${getRequestStatusColor(
                      cancelAndReturnRequestData?.data?.refundRequest?.status,
                    )}`}
                  >
                    {t(`request.status.ADMIN_${cancelAndReturnRequestData?.data?.refundRequest?.status}`)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action button */}
        <div className="flex flex-col items-end md:flex-row md:justify-between gap-2 pt-4 md:items-center">
          <div>
            <span className="text-gray-700 lg:text-base md:text-sm text-xs">
              {t('order.lastUpdated')}: {t('date.toLocaleDateTimeString', { val: new Date(orderItem?.updatedAt) })}
            </span>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <Button
              variant="outline"
              className="border border-primary text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => navigate(configs.routes.profileOrder + '/' + orderItem?.id)}
            >
              {t('order.viewDetail')}
            </Button>
            {(orderItem?.status === ShippingStatusEnum.TO_PAY ||
              orderItem?.status === ShippingStatusEnum.WAIT_FOR_CONFIRMATION) &&
              orderItem?.type !== OrderEnum.GROUP_BUYING && (
                <Button
                  variant="outline"
                  className="border border-primary text-primary hover:text-primary hover:bg-primary/10"
                  onClick={() => setOpenCancelOrderDialog(true)}
                >
                  {t('order.cancelOrder')}
                </Button>
              )}
            {orderItem?.status === ShippingStatusEnum.PREPARING_ORDER &&
              orderItem?.type !== OrderEnum.GROUP_BUYING &&
              !cancelAndReturnRequestData?.data?.cancelRequest && (
                <Button
                  variant="outline"
                  className="border border-primary text-primary hover:text-primary hover:bg-primary/10"
                  onClick={() => setOpenRequestCancelOrderDialog(true)}
                >
                  {t('order.cancelOrder')}
                </Button>
              )}
            {showReturnButton && (
              <Button
                variant="outline"
                className="border border-primary text-primary hover:text-primary hover:bg-primary/10"
                onClick={() => setOpenReqReturnDialog(true)}
              >
                {t('order.returnOrder')}
              </Button>
            )}
            {showReceivedButton && (
              <Button
                className="hover:bg-primary/80"
                onClick={() => {
                  handleUpdateStatus(ShippingStatusEnum.COMPLETED)
                }}
              >
                {isLoading ? <LoadingIcon color="primaryBackground" /> : t('order.received')}
              </Button>
            )}

            {orderItem?.status === ShippingStatusEnum.COMPLETED && (
              <Button
                variant="outline"
                className="border border-primary text-primary hover:text-primary hover:bg-primary/10"
                onClick={() => handleCreateCartItem()}
              >
                {isProcessing ? <LoadingIcon color="primaryBackground" /> : t('order.buyAgain')}
              </Button>
            )}
          </div>
        </div>
      </div>
      <CancelOrderDialog
        open={openCancelOrderDialog}
        setOpen={setOpenCancelOrderDialog}
        onOpenChange={setOpenCancelOrderDialog}
        setIsTrigger={setIsTrigger}
        orderId={orderItem?.id ?? ''}
      />
      <RequestCancelOrderDialog
        open={openRequestCancelOrderDialog}
        setOpen={setOpenRequestCancelOrderDialog}
        onOpenChange={setOpenRequestCancelOrderDialog}
        setIsTrigger={setIsTrigger}
        orderId={orderItem?.id ?? ''}
      />
      <RequestReturnOrderDialog
        open={openReqReturnDialog}
        setOpen={setOpenReqReturnDialog}
        onOpenChange={setOpenReqReturnDialog}
        setIsTrigger={setIsTrigger}
        orderId={orderItem?.id ?? ''}
      />
    </>
  )
}

export default OrderItem
