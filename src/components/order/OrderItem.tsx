import { MessageCircle, Store } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import configs from '@/config'
import { IBrand } from '@/types/brand'
import { ShippingStatusEnum } from '@/types/enum'
import { IOrderItem } from '@/types/order'

import OrderStatus from '../order-status'
import { Button } from '../ui/button'
import ProductOrderLandscape from './ProductOrderLandscape'

interface OrderItemProps {
  brand: IBrand | null
  orderItem: IOrderItem
}
const OrderItem = ({ brand, orderItem }: OrderItemProps) => {
  console.log(orderItem)
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
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
                  product={productOder?.productClassification?.product}
                  productClassification={productOder?.productClassification}
                />
              </div>
            </Link>
          ))
        : null}

      {/* Action button */}
      <div className="flex justify-between gap-2 pt-4 items-center">
        <div>
          <span className="text-gray-700">
            {t('order.lastUpdated')}: {t('date.toLocaleDateTimeString', { val: new Date(orderItem?.updatedAt) })}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline" onClick={() => navigate(configs.routes.profileOrder + '/' + orderItem?.id)}>
            {t('order.viewDetail')}
          </Button>
          <Button>{t('order.returnOrder')}</Button>
          {orderItem?.status === ShippingStatusEnum.COMPLETED && <Button>{t('order.buyAgain')}</Button>}
        </div>
      </div>
    </div>
  )
}

export default OrderItem
