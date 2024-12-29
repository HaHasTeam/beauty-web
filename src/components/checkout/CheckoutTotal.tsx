import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'

import Button from '../button'

interface CheckoutTotalProps {
  totalProductDiscount: number
  totalProductCost: number
  totalBrandDiscount: number
  totalPlatformDiscount: number
  totalSavings: number
  totalPayment: number
  isLoading: boolean
}
export default function CheckoutTotal({
  totalProductDiscount,
  totalProductCost,
  totalBrandDiscount,
  totalPlatformDiscount,
  totalSavings,
  isLoading,
  totalPayment,
}: CheckoutTotalProps) {
  const { t } = useTranslation()
  return (
    <div className="w-full bg-white rounded-md shadow-sm p-4">
      <div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t('cart.totalCost')}</span>
            <span className="font-medium">{t('productCard.price', { price: totalProductCost })}</span>
          </div>
          {totalProductDiscount && totalProductDiscount > 0 ? (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t('cart.directDiscount')}</span>
              <span className="font-medium text-green-700">
                -{t('productCard.price', { price: totalProductDiscount })}
              </span>
            </div>
          ) : null}
          {totalBrandDiscount && totalBrandDiscount > 0 ? (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t('cart.discountBrand')}</span>
              <span className="text-green-700 font-medium">
                -{t('productCard.price', { price: totalBrandDiscount })}
              </span>
            </div>
          ) : null}
          {totalPlatformDiscount && totalPlatformDiscount > 0 ? (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t('cart.discountPlatform')}</span>
              <span className="text-green-700 font-medium">
                -{t('productCard.price', { price: totalPlatformDiscount })}
              </span>
            </div>
          ) : null}
          <div className="flex justify-between items-center pt-3 border-t text-base font-medium">
            <span>{t('cart.totalPayment')}</span>
            <span className="font-semibold text-red-500 text-lg">
              {t('productCard.price', { price: totalPayment })}
            </span>
          </div>
          {totalSavings && totalSavings > 0 ? (
            <div className="flex gap-1 justify-end items-center text-sm text-green-700">
              <span className="text-green-700 font-medium">{t('cart.savings')}: </span>
              <span className="text-green-700 font-medium">-{t('productCard.price', { price: totalSavings })}</span>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex-col gap-3">
        <p className="text-sm text-muted-foreground my-3 text-right">{t('cart.checkoutDescription')}</p>
        <p className="text-sm text-muted-foreground my-1">
          {t('cart.acceptCondition')}
          <Link to={configs.routes.termsAndConditions} className="text-sm text-blue-500 hover:underline font-medium">
            {t('cart.terms')}
          </Link>
        </p>
        <Button type="submit" className="w-full bg-destructive hover:bg-destructive/80 mt-2" loading={isLoading}>
          {t('cart.checkout')}
        </Button>
      </div>
    </div>
  )
}
