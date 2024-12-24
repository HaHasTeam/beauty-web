import { MessageCircle, Store } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import { IBrand } from '@/types/brand'
import { IOrderItem } from '@/types/order'

import { Button } from '../ui/button'
import ProductOrderLandscape from './ProductOrderLandscape'

interface OrderItemProps {
  brand: IBrand | null
  orderItem: IOrderItem
}
const OrderItem = ({ brand, orderItem }: OrderItemProps) => {
  console.log(orderItem)
  const { t } = useTranslation()
  return (
    <div className="p-4">
      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-4">
        <Store className="w-5 h-5 text-red-500" />
        <Link to={configs.routes.brands + `/${brand?.id}`}>
          <span className="font-medium">{brand?.name}</span>
        </Link>
        <Button className="p-2 bg-primary hover:bg-primary/80" variant="default">
          <MessageCircle className="w-4 h-4" />
          {t('brand.chatNow')}
        </Button>
        <Button variant="outline" size="sm">
          <Store className="h-4 w-4 mr-2" />
          {t('brand.viewShop')}
        </Button>
      </div>

      {/* Product list */}
      {orderItem?.orderDetails && orderItem?.orderDetails?.length > 0
        ? orderItem?.orderDetails?.map((productOder) => (
            <div key={productOder?.id} className="border-b mb-2">
              <ProductOrderLandscape
                orderDetail={productOder}
                product={productOder?.productClassification?.product}
                productClassification={productOder?.productClassification}
              />
            </div>
          ))
        : null}

      {/* Action button */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline">{t('order.viewDetail')}</Button>
        <Button>{t('order.buyAgain')}</Button>
      </div>
    </div>
  )
}

export default OrderItem
