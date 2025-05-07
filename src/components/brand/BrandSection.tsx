import { useTranslation } from 'react-i18next'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import { IBrand } from '@/types/brand'

import ImageWithFallback from '../ImageFallback'
import BrandHeader from './BrandHeader'

interface BrandSectionProps {
  brand: IBrand
}

export default function BrandSection({ brand }: BrandSectionProps) {
  const { t } = useTranslation()
  return (
    <div className="p-4 shadow-sm rounded-lg border-gray-200 border bg-white">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full">
            <ImageWithFallback
              src={brand?.logo}
              alt={brand?.name}
              fallback={fallBackImage}
              className="rounded-full object-cover w-full h-full"
            />
          </div>

          <BrandHeader brandId={brand?.id ?? ''} brandName={brand?.name ?? ''} brandLogo={brand?.logo} />
        </div>
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 w-full place-items-center">
          {brand?.email ? (
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">{t('email')}</div>
              <div className="font-medium text-red-500">{brand?.email}</div>
            </div>
          ) : null}
          {brand?.establishmentDate ? (
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">{t('brand.establishmentDate')}</div>
              <div className="font-medium">
                {t('date.toLocaleDateString', { val: new Date(brand?.establishmentDate) })}
              </div>
            </div>
          ) : null}
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">{t('brand.joined.title')}</div>
            <div className="font-medium">{t('date.toLocaleDateString', { val: new Date(brand?.createdAt) })}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
