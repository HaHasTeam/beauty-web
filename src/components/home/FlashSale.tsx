import { ArrowRight, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import { IProductCard } from '@/types/product-card.interface'

import SaleProductCard from '../product/SaleProductCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'

const FlashSale = () => {
  const { t } = useTranslation()
  const flashSaleProducts: IProductCard[] = [
    {
      id: '1',
      name: 'Cherry Blossom Serum',
      tag: 'Best Seller',
      price: 29.99,
      currentPrice: 20.09, // Calculated with deal
      deal: 0.33,
      flashSale: {
        productAmount: 200,
        soldAmount: 65,
      },
      images: [],
      rating: 0,
      ratingAmount: 0,
      soldInPastMonth: 0,
    },
    {
      id: '2',
      name: 'Aloe Vera Moisturizer',
      tag: 'Limited Edition',
      price: 34.99,
      currentPrice: 24.84, // Calculated with deal
      deal: 0.29,
      flashSale: {
        productAmount: 190,
        soldAmount: 120,
      },
      rating: 0,
      ratingAmount: 0,
      soldInPastMonth: 0,
      images: [],
    },
    {
      id: '3',
      name: 'Vitamin C Brightening Serum',
      tag: 'New Arrival',
      price: 19.99,
      currentPrice: 14.99, // Calculated with deal
      deal: 0.25,
      flashSale: {
        productAmount: 190,
        soldAmount: 80,
      },
      images: [],
      rating: 0,
      ratingAmount: 0,
      soldInPastMonth: 0,
    },
    {
      id: '4',
      name: 'Hydrating Face Mist',
      tag: 'Hot Deal',
      price: 15.99,
      currentPrice: 12.79, // Calculated with deal
      deal: 0.2,
      flashSale: {
        productAmount: 190,
        soldAmount: 50,
      },
      images: [],
      rating: 0,
      ratingAmount: 0,
      soldInPastMonth: 0,
    },
    {
      id: '5',
      name: 'Green Tea Cleanser',
      tag: 'Flash Sale',
      price: 12.99,
      currentPrice: 10.0, // Calculated with deal
      deal: 0.23,
      flashSale: {
        productAmount: 80,
        soldAmount: 30,
      },
      images: [],
      rating: 0,
      ratingAmount: 0,
      soldInPastMonth: 0,
    },
    {
      id: '6',
      name: 'Green Tea Cleanser',
      tag: 'Flash Sale',
      price: 12.99,
      currentPrice: 10.0, // Calculated with deal
      deal: 0.23,
      flashSale: {
        productAmount: 70,
        soldAmount: 30,
      },
      images: [],
      rating: 0,
      ratingAmount: 0,
      soldInPastMonth: 0,
    },
    {
      id: '7',
      name: 'Green Tea Cleanser',
      tag: 'Flash Sale',
      price: 12.99,
      currentPrice: 10.0, // Calculated with deal
      deal: 0.23,
      flashSale: {
        productAmount: 200,
        soldAmount: 30,
      },
      images: [],
      rating: 0,
      ratingAmount: 0,
      soldInPastMonth: 0,
    },
    {
      id: '8',
      name: 'Green Tea Cleanser',
      tag: '', // No specific tag
      price: 12.99,
      currentPrice: 10.0, // Calculated with deal
      deal: 0.23,
      flashSale: {
        productAmount: 100,
        soldAmount: 30,
      },
      images: [],
      rating: 0,
      ratingAmount: 0,
      soldInPastMonth: 0,
    },
  ]

  const [time, setTime] = useState({
    hours: 1,
    minutes: 1,
    seconds: 1,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        const newTime = { ...prevTime }

        if (newTime.seconds > 0) {
          newTime.seconds--
        } else {
          newTime.seconds = 59
          if (newTime.minutes > 0) {
            newTime.minutes--
          } else {
            newTime.minutes = 59
            if (newTime.hours > 0) {
              newTime.hours--
            } else {
              // Timer completed
              clearInterval(timer)
            }
          }
        }

        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-1 text-rose-500">
            {t('flashSale.title')}
            <Zap className="w-5 h-5 fill-current text-rose-500" />
          </h2>
          <div className="flex gap-1 ml-2">
            {[time.hours, time.minutes, time.seconds].map((unit, index) => (
              <div
                key={index}
                className="bg-black text-white w-8 h-8 rounded flex items-center justify-center font-mono"
              >
                {String(unit).padStart(2, '0')}
              </div>
            ))}
          </div>
        </div>
        <Link
          to={configs.routes.productFlashSale}
          className="text-[#FF6B35] hover:opacity-80 transition-opacity flex items-center gap-1"
        >
          {t('button.seeAll')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent className="w-full m-0">
            {flashSaleProducts.map((product) => (
              <CarouselItem key={product?.id} className="pl-1 basis-1/3 sm:basis-1/3 lg:basis-1/5">
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
    </div>
  )
}

export default FlashSale
