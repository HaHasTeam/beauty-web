import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import { getFlashSaleProductFilterApi } from '@/network/apis/flash-sale'
import { FlashSaleStatusEnum } from '@/types/flash-sale'

import Empty from '../empty/Empty'
import LoadingIcon from '../loading-icon'
import SaleProductCard from '../product/SaleProductCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'

const FlashSale = () => {
  const { t } = useTranslation()
  const { data: flashSaleProductData, isFetching } = useQuery({
    queryKey: [getFlashSaleProductFilterApi.queryKey, { page: 1, limit: 10, statuses: FlashSaleStatusEnum.ACTIVE }],
    queryFn: getFlashSaleProductFilterApi.fn,
    select: (data) => data.data,
  })
  console.log('flashSaleProductData', flashSaleProductData)

  return (
    <div>
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 fill-current text-rose-500" />
          <h2 className="text-2xl font-bold flex items-center gap-1 text-rose-500">{t('flashSale.title')}</h2>
          {/* <div className="flex gap-1 ml-2">
            {[time.hours, time.minutes, time.seconds].map((unit, index) => (
              <div
                key={index}
                className="bg-black text-white w-8 h-8 rounded flex items-center justify-center font-mono"
              >
                {String(unit).padStart(2, '0')}
              </div>
            ))}
          </div> */}
        </div>
        <Link
          to={configs.routes.productFlashSale}
          className="text-primary hover:opacity-80 transition-opacity flex items-center gap-1"
        >
          {t('button.seeAll')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isFetching && (
        <div className="w-full flex justify-center items-center">
          <LoadingIcon color="primaryBackground" />
        </div>
      )}

      {!isFetching && (!flashSaleProductData || flashSaleProductData.items.length === 0) && (
        <Empty title={t('empty.flashSale.title')} description={t('empty.flashSale.description')} />
      )}

      {!isFetching && flashSaleProductData && flashSaleProductData.items.length > 0 && (
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent className="w-full m-0">
              {flashSaleProductData.items.map((product) => (
                <CarouselItem key={product?.id} className="pl-1 basis-1/2 sm:basis-1/3 lg:basis-1/5">
                  <div className="p-1">
                    <SaleProductCard product={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute left-16 top-2/4">
              <CarouselPrevious />
            </div>
            <div className="absolute right-16 top-2/4">
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      )}
    </div>
  )
}

export default FlashSale
