import { CircleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { DiscountTypeEnum } from '@/types/enum'
import { calculateDiscountPrice } from '@/utils/price'

import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import ProductTag from './ProductTag'

interface PriceSectionProps {
  price: number
  currentPrice: number
  deal: number
  minOrder?: number
  discountValue?: number
  discountType?: DiscountTypeEnum
  discountVoucher?: number
  isHighlight?: boolean
}
const PriceSection = ({
  price,
  currentPrice,
  deal,
  discountType,
  discountValue,
  minOrder,
  discountVoucher,
  isHighlight = true,
}: PriceSectionProps) => {
  const { t } = useTranslation()
  return (
    <div className="flex gap-1">
      <div className="flex items-center gap-2">
        <span className={`${isHighlight ? 'text-red-500' : ''} text-2xl font-medium`}>
          {t('productCard.currentPrice', { price: currentPrice })}
        </span>
        {deal && deal > 0 ? <ProductTag tag="DealPercent" text={deal * 100 + '%'} /> : null}
        {deal && deal > 0 ? (
          <span className="text-gray-400 text-sm line-through">{t('productCard.price', { price: price })}</span>
        ) : null}
      </div>
      {deal > 0 ? (
        <HoverCard>
          <HoverCardTrigger asChild>
            <CircleAlert className="text-gray-400 h-4 w-4 hover:cursor-pointer" />
          </HoverCardTrigger>
          <HoverCardContent className="w-80 p-0">
            <div className="w-full bg-red-50/50 rounded-lg">
              <div className="space-y-4 p-4">
                <h3 className="font-medium text-gray-900">{t('productDetail.priceDetail')}</h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('productDetail.originalPrice')}</span>
                    <span className="text-red-500">{t('productCard.price', { price: price })}</span>
                  </div>

                  {deal > 0 ? (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('cart.directDiscount')}</span>
                      <span className="text-red-500">{t('productCard.price', { price: price * deal })}</span>
                    </div>
                  ) : null}

                  {(discountValue ?? 0) > 0 ? (
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('cart.discountBrand')}</span>
                        <span className="text-red-500">-{t('productCard.price', { price: discountValue })}</span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">
                        {discountType === DiscountTypeEnum.PERCENTAGE
                          ? t('cart.buyToDiscountPercentage', { minOrder: minOrder, discount: discountValue })
                          : t('cart.buyToDiscountCurrency', { minOrder: minOrder, discount: discountVoucher })}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900">{t('cart.estimateProductPrice')}</span>
                    <span className="text-red-500 font-medium">
                      {t('productCard.price', {
                        price: calculateDiscountPrice(price, deal, DiscountTypeEnum.PERCENTAGE),
                      })}
                    </span>
                  </div>
                  {/* <p className="text-gray-500 text-sm mt-2 italic">{t('cart.voucherNote')}</p> */}
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ) : null}
    </div>
  )
}

export default PriceSection
