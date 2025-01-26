import { MessageCircle, Store } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import configs from '@/config'
import { IBrand } from '@/types/brand'
import { OrderEnum, ShippingStatusEnum } from '@/types/enum'
import { IOrderItem } from '@/types/order'

import CancelOrderDialog from '../dialog/CancelOrderDialog'
import OrderStatus from '../order-status'
import { Button } from '../ui/button'
import ProductOrderLandscape from './ProductOrderLandscape'

interface OrderItemProps {
  brand: IBrand | null
  orderItem: IOrderItem
  setIsTrigger: Dispatch<SetStateAction<boolean>>
}
const OrderItem = ({ brand, orderItem, setIsTrigger }: OrderItemProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [openCancelOrderDialog, setOpenCancelOrderDialog] = useState<boolean>(false)

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
            <Button variant="outline" size="sm">
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
            {(orderItem?.status === ShippingStatusEnum.TO_PAY ||
              orderItem?.status === ShippingStatusEnum.WAIT_FOR_CONFIRMATION) && (
              <Button
                variant="outline"
                className="border border-primary text-primary hover:text-primary hover:bg-primary/10"
                onClick={() => setOpenCancelOrderDialog(true)}
              >
                {t('order.cancelOrder')}
              </Button>
            )}
            {orderItem?.status === ShippingStatusEnum.COMPLETED && (
              <Button
                variant="outline"
                className="border border-primary text-primary hover:text-primary hover:bg-primary/10"
              >
                {t('order.returnOrder')}
              </Button>
            )}

            {orderItem?.status === ShippingStatusEnum.COMPLETED && (
              <Button
                variant="outline"
                className="border border-primary text-primary hover:text-primary hover:bg-primary/10"
              >
                {t('order.buyAgain')}
              </Button>
            )}
          </div>
        </div>
      </div>
      <CancelOrderDialog
        open={openCancelOrderDialog}
        onOpenChange={setOpenCancelOrderDialog}
        setIsTrigger={setIsTrigger}
        orderId={orderItem?.id ?? ''}
      />
    </>
  )
}

export default OrderItem
