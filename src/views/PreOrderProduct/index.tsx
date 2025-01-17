import { useQuery } from '@tanstack/react-query'
import { Clock } from 'lucide-react'

import PreOrderProductCard from '@/components/product/PreOrderProductCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { getPreOrderProductFilterApi } from '@/network/apis/pre-order'

function PreOrderProductSections() {
  const { data: preOrderProductData } = useQuery({
    queryKey: [getPreOrderProductFilterApi.queryKey, { page: 1, limit: 10 }],
    queryFn: getPreOrderProductFilterApi.fn,
    select: (data) => data.data,
  })
  console.log('preOrderProductData', preOrderProductData)

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Clock className="w-6 h-6 text-emerald-500" />
          <h2 className="text-2xl font-bold">Upcoming Products</h2>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {preOrderProductData?.items.map((preOrderProduct) => (
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
      </div>
    </section>
  )
}

export default PreOrderProductSections
