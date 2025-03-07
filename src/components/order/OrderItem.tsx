import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MessageCircle, Store } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import configs from '@/config'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { createCartItemApi, getMyCartApi } from '@/network/apis/cart'
import {
  getCancelAndReturnRequestApi,
  getOrderByIdApi,
  getStatusTrackingByIdApi,
  updateOrderStatusApi,
} from '@/network/apis/order'
import { IBrand } from '@/types/brand'
import { OrderEnum, ShippingStatusEnum } from '@/types/enum'
import { IOrderItem } from '@/types/order'

import LoadingIcon from '../loading-icon'
import OrderStatus from '../order-status'
import { Button } from '../ui/button'
import CancelOrderDialog from './CancelOrderDialog'
import ProductOrderLandscape from './ProductOrderLandscape'
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
  const [openReqReturnDialog, setOpenReqReturnDialog] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)

  const { data: cancelAndReturnRequestData } = useQuery({
    queryKey: [getCancelAndReturnRequestApi.queryKey, orderItem.id ?? ('' as string)],
    queryFn: getCancelAndReturnRequestApi.fn,
    enabled: !!orderItem.id,
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

  return (
    <>
      <div className="p-4">
        {/* Order Item Header */}
        <div className="flex justify-between items-center border-b py-2 mb-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-red-500" />
            <Link to={configs.routes.brands + `/${brand?.id}`}>
              <span className="font-medium">{brand?.name}</span>
            </Link>
            <Button className="bg-primary hover:bg-primary/80" variant="default" size="sm">
              <MessageCircle className="w-4 h-4" />
              {t('brand.chat')}
            </Button>
            <Button variant="outline" size="sm" className="">
              <Store className="h-4 w-4" />
              {t('brand.viewShop')}
            </Button>
          </div>
          {/* Order Status */}
          <div className="flex items-center">
            <OrderStatus tag={orderItem?.status} />
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

        {/* Action button */}
        <div className="flex justify-between gap-2 pt-4 items-center">
          <div>
            <span className="text-gray-700 text-base">
              {t('order.lastUpdated')}: {t('date.toLocaleDateTimeString', { val: new Date(orderItem?.updatedAt) })}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              className="border border-primary text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => navigate(configs.routes.profileOrder + '/' + orderItem?.id)}
            >
              {t('order.viewDetail')}
            </Button>
            {orderItem?.status === ShippingStatusEnum.TO_PAY ||
              orderItem?.status === ShippingStatusEnum.WAIT_FOR_CONFIRMATION ||
              (orderItem?.status === ShippingStatusEnum.PREPARING_ORDER &&
                !isLoading &&
                !cancelAndReturnRequestData?.data?.cancelOrderRequest && (
                  <Button
                    variant="outline"
                    className="border border-primary text-primary hover:text-primary hover:bg-primary/10"
                    onClick={() => setOpenCancelOrderDialog(true)}
                  >
                    {t('order.cancelOrder')}
                  </Button>
                ))}
            {orderItem?.status === ShippingStatusEnum.DELIVERED && !cancelAndReturnRequestData?.data?.refundRequest && (
              <Button
                variant="outline"
                className="border border-primary text-primary hover:text-primary hover:bg-primary/10"
                onClick={() => setOpenReqReturnDialog(true)}
              >
                {t('order.returnOrder')}
              </Button>
            )}
            {orderItem?.status === ShippingStatusEnum.DELIVERED && (
              <Button
                variant="outline"
                className="border border-primary text-primary hover:text-primary hover:bg-primary/10"
                onClick={() => {
                  handleUpdateStatus(ShippingStatusEnum.COMPLETED)
                }}
              >
                {isProcessing ? <LoadingIcon color="primaryBackground" /> : t('order.received')}
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
