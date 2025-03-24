import { useQuery } from '@tanstack/react-query'
import { Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import Empty from '@/components/empty/Empty'
import LoadingIcon from '@/components/loading-icon'
import PreOrderProductCard from '@/components/product/PreOrderProductCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { getPreOrderProductFilterApi } from '@/network/apis/pre-order'

function PreOrderProductSections() {
  const { t } = useTranslation()
  const { data: preOrderProductData, isLoading } = useQuery({
    queryKey: [getPreOrderProductFilterApi.queryKey, { page: 1, limit: 10 }],
    queryFn: getPreOrderProductFilterApi.fn,
    select: (data) => data.data,
  })

  const hasProducts = preOrderProductData?.items && preOrderProductData.items.length > 0

  return (
    <section className="py-12 px-4 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Clock className="w-6 h-6 text-emerald-500" />
          <h2 className="text-2xl font-bold">{t('home.preOrderTitle')}</h2>
        </div>

        {isLoading && (
          <div className="w-full flex justify-center items-center min-h-[200px]">
            <LoadingIcon color="primaryBackground" />
          </div>
        )}

        {!isLoading && !hasProducts && (
          <Empty title={t('empty.preOrder.title')} description={t('empty.preOrder.description')} />
        )}

        {!isLoading && hasProducts && (
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {preOrderProductData.items.map((preOrderProduct) => (
                <CarouselItem key={preOrderProduct.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/3">
                  <div className="h-full">
                    <PreOrderProductCard preOrderProduct={preOrderProduct} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-0 -translate-x-1/2" />
              <CarouselNext className="right-0 translate-x-1/2" />
            </div>
          </Carousel>
        )}
      </div>
    </section>
  )
}

export default PreOrderProductSections
