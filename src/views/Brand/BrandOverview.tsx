import { MessageCircle, Star } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import fallBackImage from '@/assets/images/group-bg.webp'
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
                <img
                  src={
                    brand.logo ||
                    'https://cdn4.iconfinder.com/data/icons/simple-business-1/1000/businessicon_cnvrt-01-512.png'
                  }
                  alt={t('store.logo')}
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-white text-2xl font-bold mb-0.5 drop-shadow-md">{brand.name}</h1>
                <p className="text-gray-200 text-sm opacity-90">{t('store.online_status')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5">
          {/* Buttons Section */}
          <div className="py-4 flex gap-3">
            <Button
              variant={isFollowing ? 'outline' : 'default'}
              className={`flex-1 ${isFollowing ? '' : 'bg-rose-500 hover:bg-rose-600'}`}
              onClick={() => setIsFollowing(!isFollowing)}
            >
              {isFollowing ? t('store.following') : t('store.follow')}
            </Button>
            <Button variant="outline" className="flex-1">
              <MessageCircle className="mr-2 h-5 w-5" />
              {t('store.chat')}
            </Button>
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 py-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">{t('store.products')}</div>
              <div className="font-semibold text-lg">1,1k</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">{t('store.followers')}</div>
              <div className="font-semibold text-lg">52,9k</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">{t('store.rating')}</div>
              <div className="font-semibold text-lg flex items-center justify-center">
                4.6
                <Star className="h-4 w-4 text-yellow-500 ml-1" />
                <span className="text-xs text-gray-500 ml-1">(69.4k)</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">{t('store.response_rate')}</div>
              <div className="font-semibold text-lg text-rose-500">84%</div>
              <div className="text-xs text-gray-500 -mt-1">{t('store.response_time')}</div>
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
                value="all" 
                className="data-[state=active]:text-rose-500 data-[state=active]:border-rose-500 data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-4 py-2"
              >
                {t('store.categories.all')}
              </TabsTrigger>
              <TabsTrigger 
                value="new" 
                className="data-[state=active]:text-rose-500 data-[state=active]:border-rose-500 data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-4 py-2"
              >
                {t('store.categories.new')}
              </TabsTrigger>
              <TabsTrigger 
                value="sale" 
                className="data-[state=active]:text-rose-500 data-[state=active]:border-rose-500 data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-4 py-2"
              >
                {t('store.categories.sale')}
              </TabsTrigger>
              <TabsTrigger 
                value="best_selling" 
                className="data-[state=active]:text-rose-500 data-[state=active]:border-rose-500 data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-4 py-2"
              >
                {t('store.categories.best_selling')}
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
        </Tabs>
      </div>
    </div>
  )
}
