import { MessageCircle, Store, Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import { IProductCart } from '@/types/product'

import ProductCheckoutLandscape from '../product/ProductCheckoutLandscape'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import VoucherCartList from '../voucher/VoucherCartList'

interface CheckoutItemProps {
  brandName: string
  brandId: string
  totalPrice: number
  numberOfProducts: number
  products: IProductCart[]
}
const CheckoutItem = ({ brandName, brandId, products, totalPrice, numberOfProducts }: CheckoutItemProps) => {
  const { t } = useTranslation()

  return (
    <div className="w-full bg-white sm:p-4 p-2 rounded-lg space-y-2 shadow-sm">
      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-4">
        {/* group product of brand checkbox */}
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
      {products?.map((product) => (
        <ProductCheckoutLandscape
          key={product?.id}
          productImage={product?.image}
          productName={product?.name}
          classifications={product?.classifications}
          currentPrice={product?.currentPrice}
          productId={product?.id}
          eventType={product?.eventType}
          productQuantity={product?.quantity}
          totalPrice={product?.totalPrice ?? 0}
          price={product?.price}
        />
      ))}

      {/* Message and brand voucher */}
      <div className="w-full flex md:justify-between justify-start md:flex-row flex-col gap-3 border-b border-gray-200 py-3">
        <div className="order-2 md:order-1 flex items-center gap-3 text-sm w-full">
          <Label>{t('input.message')}</Label>
          <Input className="border border-secondary w-full" placeholder={t('input.message')} />
        </div>
        {/* Voucher */}
        <div className="order-1 md:order-2 flex items-center gap-3 text-sm w-full justify-end">
          <Tag className="w-4 h-4 text-red-500" />
          <span>Voucher giảm đến ₫21k</span>
          <VoucherCartList triggerText={t('cart.viewMoreVoucher')} brandName="Romand" />
        </div>
      </div>
      <div className="w-full flex gap-2 justify-end items-center">
        <span className="lg:text-lg md:text-sm sm:text-xs text-xs text-gray-600">
          {t('cart.total')} ({numberOfProducts} {t('cart.products')}):
        </span>
        <span className="text-red-500 lg:text-lg md:text-sm sm:text-xs text-xs font-medium text-end">
          {t('productCard.currentPrice', { price: totalPrice })}
        </span>
      </div>
    </div>
  )
}

export default CheckoutItem
