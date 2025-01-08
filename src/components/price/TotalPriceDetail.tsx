import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Separator } from '../ui/separator'

interface TotalPriceDetailProps {
  triggerComponent: ReactElement<unknown>
  totalProductDiscount: number
  totalBrandDiscount: number
  totalPlatformDiscount: number
  totalPayment: number
  totalSavings: number
  totalProductCost: number
}
const TotalPriceDetail = ({
  triggerComponent,
  totalBrandDiscount,
  totalPayment,
  totalPlatformDiscount,
  totalProductDiscount,
  totalSavings,
  totalProductCost,
}: TotalPriceDetailProps) => {
  const { t } = useTranslation()
  return (
    <Popover>
      <PopoverTrigger asChild>{triggerComponent}</PopoverTrigger>
      <PopoverContent className="w-96 bg-white">
        <div className="space-y-3">
          <h3 className="text-xl">{t('cart.discountDetails')}</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('cart.totalCost')}</span>
              <span className="font-medium">{t('productCard.price', { price: totalProductCost })}</span>
            </div>
            {totalProductDiscount && totalProductDiscount > 0 ? (
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('cart.directDiscount')}</span>
                <span className="font-medium text-sm text-green-700">
                  -{t('productCard.price', { price: totalProductDiscount })}
                </span>
              </div>
            ) : null}
            {totalBrandDiscount && totalBrandDiscount > 0 ? (
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('cart.discountBrand')}</span>
                <span className="font-medium text-sm text-green-700">
                  -{t('productCard.price', { price: totalBrandDiscount })}
                </span>
              </div>
            ) : null}
            {totalPlatformDiscount && totalPlatformDiscount > 0 ? (
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('cart.discountPlatform')}</span>
                <span className="font-medium text-sm text-green-700">
                  -{t('productCard.price', { price: totalPlatformDiscount })}
                </span>
              </div>
            ) : null}
            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-base font-medium">{t('cart.totalPayment')}</span>
              <span className="font-medium text-lg text-red-500">
                {t('productCard.price', { price: totalPayment })}
              </span>
            </div>
            {totalSavings && totalSavings > 0 ? (
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('cart.savings')}</span>
                <span className="font-medium text-sm text-green-700">
                  -{t('productCard.price', { price: totalSavings })}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default TotalPriceDetail
