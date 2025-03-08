import { MessageCircle, Star } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IBrand } from '@/types/brand'

import GroupBuyingOfBrand from './GroupBuyingOfBrand'

type Props = {
  brand: IBrand
}
export default function BrandOverview({ brand }: Props) {
  const [isFollowing, setIsFollowing] = useState(false)
  const { t } = useTranslation()
  return (
    <div className="w-full">
      <div className="bg-card p-4 rounded-lg shadow-sm border">
        <div
          className="relative h-64 w-full bg-cover bg-center backdrop-blur-md bg-white rounded-2xl overflow-hidden"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1470252649378-9c29740c9fa8')`,
          }}
        >
          <div className="absolute inset-0 backdrop-blur-sm">
            <div className="absolute bottom-6 left-6 flex items-center gap-6 p-4 rounded-2xl overflow-hidden">
              <div className="bg-white rounded-full p-1">
                <img
                  src={
                    brand.logo ||
                    'https://cdn4.iconfinder.com/data/icons/simple-business-1/1000/businessicon_cnvrt-01-512.png'
                  }
                  alt={t('store.logo')}
                  className="w-20 h-20 rounded-full"
                />
              </div>
              <div>
                <h1 className="text-white text-3xl font-bold">{brand.name}</h1>
                <p className="text-gray-200 text-lg">{t('store.online_status')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto">
          <div className="py-6 flex gap-6">
            <Button
              variant={isFollowing ? 'outline' : 'default'}
              className="flex-1 max-w-xs"
              onClick={() => setIsFollowing(!isFollowing)}
            >
              {isFollowing ? t('store.following') : t('store.follow')}
            </Button>
            <Button variant="outline" className="flex-1 max-w-xs">
              <MessageCircle className="mr-2 h-5 w-5" />
              {t('store.chat')}
            </Button>
          </div>

          <div className="pb-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-base">
            <div>
              <div className="text-gray-600 dark:text-gray-400">{t('store.products')}</div>
              <div className="font-medium text-lg">1,1k</div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">{t('store.followers')}</div>
              <div className="font-medium text-lg">52,9k</div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">{t('store.rating')}</div>
              <div className="font-medium text-lg flex items-center">
                4.6
                <Star className="h-5 w-5 text-yellow-400 ml-2" />
                <span className="text-gray-500 ml-2">(69.4k {t('store.reviews')})</span>
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">{t('store.response_rate')}</div>
              <div className="font-medium text-lg text-red-500">84% ({t('store.response_time')})</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <Tabs defaultValue="group_buying" className="mt-6">
          <TabsList className="justify-start border-b w-fit">
            <TabsTrigger value="featured" className="text-red-500">
              {t('store.categories.featured')}
            </TabsTrigger>
            <TabsTrigger value="all">{t('store.categories.all')}</TabsTrigger>
            <TabsTrigger value="new">{t('store.categories.new')}</TabsTrigger>
            <TabsTrigger value="sale">{t('store.categories.sale')}</TabsTrigger>
            <TabsTrigger value="best_selling">{t('store.categories.best_selling')}</TabsTrigger>
            <TabsTrigger value="group_buying">{t('store.categories.group_buying')}</TabsTrigger>
          </TabsList>
          <TabsContent value="group_buying">
            <GroupBuyingOfBrand />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
