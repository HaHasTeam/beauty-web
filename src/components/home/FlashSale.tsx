import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import { getFlashSaleProductFilterApi } from '@/network/apis/flash-sale'

import LoadingIcon from '../loading-icon'
import SaleProductCard from '../product/SaleProductCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'

const FlashSale = () => {
  const { t } = useTranslation()
  const { data: flashSaleProductData, isFetching } = useQuery({
    queryKey: [getFlashSaleProductFilterApi.queryKey, { page: 1, limit: 10 }],
    queryFn: getFlashSaleProductFilterApi.fn,
    select: (data) => data.data,
  })
  console.log('flashSaleProductData', flashSaleProductData)

  // const [time, setTime] = useState({
  //   hours: 1,
  //   minutes: 1,
  //   seconds: 1,
  // })

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setTime((prevTime) => {
  //       const newTime = { ...prevTime }

  //       if (newTime.seconds > 0) {
  //         newTime.seconds--
  //       } else {
  //         newTime.seconds = 59
  //         if (newTime.minutes > 0) {
  //           newTime.minutes--
  //         } else {
  //           newTime.minutes = 59
  //           if (newTime.hours > 0) {
  //             newTime.hours--
  //           } else {
  //             // Timer completed
  //             clearInterval(timer)
  //           }
  //         }
  //       }

  //       return newTime
  //     })
  //   }, 1000)

  //   return () => clearInterval(timer)
  // }, [])

  return (
    <div>
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-1 text-rose-500">
            {t('flashSale.title')}
            <Zap className="w-5 h-5 fill-current text-rose-500" />
          </h2>
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
      {!isFetching && flashSaleProductData && (
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent className="w-full m-0">
              {flashSaleProductData?.items.map((product) => (
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
      {isFetching && (
        <div className="w-full flex justify-center items-center">
          <LoadingIcon color="primaryBackground" />
        </div>
      )}
    </div>
  )
}

export default FlashSale
