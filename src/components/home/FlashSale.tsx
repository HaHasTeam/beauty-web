import { ArrowRight, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import { IProductCard } from '@/types/product-card.interface'

import ProductCard from '../product/ProductCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'

const FlashSale = () => {
  const { t } = useTranslation()
  const flashSaleProducts: IProductCard[] = [
    {
      id: '1',
      tag: 'Best Seller',
      price: 29.99,
      deal: 0.33,
      soldAmount: 65,
      imageUrl: 'path/to/image1.png',
      name: 'Cherry Blossom Serum',
      currentPrice: 20.09, // 29.99 - (29.99 * 0.33)
      productAmount: 200,
    },
    {
      id: '2',
      tag: 'Limited Edition',
      price: 34.99,
      deal: 0.29,
      soldAmount: 120,
      imageUrl: 'path/to/image2.png',
      name: 'Aloe Vera Moisturizer',
      currentPrice: 24.84, // 34.99 - (34.99 * 0.29)
      productAmount: 190,
    },
    {
      id: '3',
      tag: 'New Arrival',
      price: 19.99,
      deal: 0.25,
      soldAmount: 80,
      imageUrl: 'path/to/image3.png',
      name: 'Vitamin C Brightening Serum',
      currentPrice: 14.99, // 19.99 - (19.99 * 0.25)
      productAmount: 190,
    },
    {
      id: '4',
      tag: 'Hot Deal',
      price: 15.99,
      deal: 0.2,
      soldAmount: 50,
      imageUrl: 'path/to/image4.png',
      name: 'Hydrating Face Mist',
      currentPrice: 12.79,
      productAmount: 190,
    },
    {
      id: '5',
      tag: 'Flash Sale',
      price: 12.99,
      deal: 0.23,
      soldAmount: 30,
      imageUrl: 'path/to/image5.png',
      name: 'Green Tea Cleanser',
      currentPrice: 10.0,
      productAmount: 80,
    },

    {
      id: '6',
      tag: 'Flash Sale',
      price: 12.99,
      deal: 0.23,
      soldAmount: 30,
      imageUrl: 'path/to/image5.png',
      name: 'Green Tea Cleanser',
      currentPrice: 10.0,
      productAmount: 70,
    },

    {
      id: '7',
      tag: 'Flash Sale',
      price: 12.99,
      deal: 0.23,
      soldAmount: 30,
      imageUrl: 'path/to/image5.png',
      name: 'Green Tea Cleanser',
      currentPrice: 10.0,
      productAmount: 200,
    },

    {
      id: '8',
      tag: '',
      price: 12.99,
      deal: 0.23,
      soldAmount: 30,
      imageUrl: 'path/to/image5.png',
      name: 'Green Tea Cleanser',
      currentPrice: 10.0,
      productAmount: 100,
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
          <h2 className="text-xl font-semibold flex items-center gap-1">
            {t('flashSale.title')}
            <Zap className="w-5 h-5 fill-current" />
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
          {t('flashSale.seeAll')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent className="w-full">
            {flashSaleProducts.map((product) => (
              <CarouselItem key={product?.id} className="pl-1 basis-1/3 sm:basis-1/3 lg:basis-1/5">
                <div className="p-1">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute left-14 top-2/4">
            <CarouselPrevious />
          </div>
          <div className="absolute right-14 top-2/4">
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </div>
  )
}

export default FlashSale
