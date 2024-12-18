import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'

import Button from '../button'

interface CheckoutTotalProps {
  totalCost: number
  totalDiscount: number
  totalPayment: number
  savings: number
  isLoading: boolean
}
export default function CheckoutTotal({
  totalCost,
  totalDiscount,
  totalPayment,
  savings,
  isLoading,
}: CheckoutTotalProps) {
  const { t } = useTranslation()
  return (
    <div className="w-full bg-white rounded-md shadow-sm p-4">
      <div>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground"> {t('cart.totalCost')}</span>
            <span className="font-medium">{t('productCard.price', { price: totalCost })}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground"> {t('cart.totalDiscount')}</span>
            <span className="text-green-700 font-medium">-{t('productCard.price', { price: totalDiscount })}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t text-base font-medium">
            <span> {t('cart.totalPayment')}</span>
            <span className="text-red-500 text-lg">{t('productCard.price', { price: totalPayment })}</span>
          </div>
          <div className="flex gap-1 justify-end items-center text-sm text-green-700">
            <span className="text-green-700 font-medium"> {t('cart.savings')}: </span>
            <span className="text-green-700 font-medium">{t('productCard.price', { price: savings })}</span>
          </div>
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
        <Button className="w-full bg-destructive hover:bg-destructive/80" loading={isLoading}>
          {t('cart.checkout')}
        </Button>
      </div>
    </div>
  )
}
