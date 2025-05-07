import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import fallBackImage from '@/assets/images/group-bg.webp'
import ImageWithFallback from '@/components/ImageFallback'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IBrand } from '@/types/brand'

import GroupBuyingOfBrand from './GroupBuyingOfBrand'
import ProductsOfBrand from './ProductsOfBrand'

type Props = {
  brand: IBrand
}
export default function BrandOverview({ brand }: Props) {
  const { t } = useTranslation()
  const { brandId } = useParams()
  return (
    <div className="w-full">
      {/* Brand Header Card */}
      <div className="bg-white rounded-xl shadow-md border border-rose-100 overflow-hidden">
        {/* Banner with gradient overlay */}
        <div
          className="relative h-48 w-full bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: `url(${fallBackImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70">
            {/* Brand logo and info positioned at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end gap-5">
              <div className="bg-white rounded-full p-1.5 shadow-lg border-4 border-white">
                <ImageWithFallback
                  src={
                    brand.logo ||
                    'https://cdn4.iconfinder.com/data/icons/simple-business-1/1000/businessicon_cnvrt-01-512.png'
                  }
                  alt={t('store.logo')}
                  className="w-20 h-20 rounded-full object-cover"
                  fallback={fallBackImage}
                />
              </div>
              <div className="flex-1">
                <h1 className="text-white text-2xl font-bold mb-0.5 drop-shadow-md">{brand.name}</h1>
                <p className="text-gray-200 text-sm opacity-90">{t('store.online_status')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-5">
        <Tabs defaultValue="group_buying" className="w-full">
          <div className="border-b border-gray-200 mb-4">
            <TabsList className="justify-start bg-transparent p-0 h-auto">
              <TabsTrigger
                value="featured"
                className="data-[state=active]:text-rose-500 data-[state=active]:border-rose-500 data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-4 py-2"
              >
                {t('store.categories.featured')}
              </TabsTrigger>
              <TabsTrigger
                value="group_buying"
                className="data-[state=active]:text-rose-500 data-[state=active]:border-rose-500 data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-4 py-2"
              >
                {t('store.categories.group_buying')}
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="group_buying" className="pt-2">
            <GroupBuyingOfBrand />
          </TabsContent>
          <TabsContent value="featured" className="pt-2">
            <ProductsOfBrand brandId={brandId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
