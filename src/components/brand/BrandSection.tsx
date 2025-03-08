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
          <div className="relative w-16 h-16">
            <ImageWithFallback
              src={brand?.logo}
              alt={brand?.name}
              fallback={fallBackImage}
              className="rounded-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold">{brand?.name}</h1>
            <div className="text-sm text-muted-foreground">{t('brand.lastOnline', { time: '59 Minutes' })}</div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button className="flex-1 md:flex-none bg-primary hover:bg-primary/80" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                {t('brand.chatNow')}
              </Button>
              <Link
                to={configs.routes.brands + '/' + brand?.id}
                className="px-2 rounded-md flex items-center flex-1 md:flex-none border-primary text-primary hover:text-primary hover:bg-primary/10"
              >
                <Store className="w-4 h-4 mr-2" />
                {t('brand.viewShop')}
              </Link>
            </div>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full place-items-center">
          {/* <div className="space-y-1">
            <div className="text-sm text-muted-foreground">{t('brand.reviews.title')}</div>
            <div className="font-medium text-red-500">{t('brand.reviews.count', { count: 100.8 })}</div>
          </div> */}

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">{t('brand.responseRate.title')}</div>
            <div className="font-medium text-red-500">{t('brand.responseRate.value', { rate: '98' })}</div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">{t('brand.responseTime.title')}</div>
            <div className="font-medium text-red-500">{t('brand.responseTime.value', { time: 'a few hours' })}</div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">{t('brand.joined.title')}</div>
            <div className="font-medium">{t('date.toLocaleDateString', { val: new Date(brand?.createdAt) })}</div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">{t('brand.products.title')}</div>
            <div className="font-medium">{t('brand.products.count', { count: 93 })}</div>
          </div>

          {/* <div className="space-y-1">
            <div className="text-sm text-muted-foreground">{t('brand.followers.title')}</div>
            <div className="font-medium">{t('brand.followers.count', { count: 183.6 })}</div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
