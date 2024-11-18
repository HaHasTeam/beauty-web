import { MessageCircle, Store, Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'

import ProductCardLandscape from '../product/ProductCardLandscape'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import VoucherCartList from '../voucher/VoucherCartList'

interface CartItemProps {
  brandName: string
  brandId: string
  cartItemId: string
}
const CartItem = ({ brandName, brandId, cartItemId }: CartItemProps) => {
  const { t } = useTranslation()
  const products = [{ id: '1' }, { id: '2' }]
  return (
    <div className="w-full bg-white p-4 rounded-lg space-y-2">
      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-4">
        <Checkbox id={cartItemId} />
        <Store className="w-5 h-5 text-red-500" />
        <Link to={configs.routes.brands + `/${brandId}`}>
          <span className="font-medium">{brandName}</span>
        </Link>
        <Button className="p-2 bg-primary hover:bg-primary/80" variant="default">
          <MessageCircle className="w-4 h-4" />
          {t('brand.chatNow')}
        </Button>
      </div>

      {/* Product Cards */}
      {products.map((product) => (
        <ProductCardLandscape
          key={product.id}
          productImage={'https://i.pinimg.com/736x/c9/74/71/c97471cc7179e3164dfacba52cf957ea.jpg'}
          productName={'Rom&nd Juicy lasting tint Lip Tint 5.5 g Nr. 09 - Litchi Coral'}
          classification={'Rose'}
          currentPrice={10000}
          price={1190}
          productId={''}
          eventType={'LiveStream'}
        />
      ))}

      {/* Voucher */}
      <div className="flex items-center gap-3 text-sm">
        <Tag className="w-4 h-4 text-red-500" />
        <span>Voucher giảm đến ₫21k</span>
        <VoucherCartList triggerText={t('cart.viewMoreVoucher')} />
      </div>
    </div>
  )
}

export default CartItem
