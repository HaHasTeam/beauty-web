import Autoplay from 'embla-carousel-autoplay'
import { useEffect, useRef, useState } from 'react'

import homeBanner1 from '@/assets/images/home_banner_1.jpg'
import homeBanner2 from '@/assets/images/home_banner_2.jpg'
import homeBanner3 from '@/assets/images/home_banner_3.jpg'
import homeBanner4 from '@/assets/images/home_banner_4.jpg'
import homeBanner5 from '@/assets/images/home_banner_5.jpg'
import homeBanner6 from '@/assets/images/home_banner_6.jpg'

import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

const HomeBanner = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))

  const banners = [
    { id: '0', image: homeBanner1, alt: 'Home Banner 1' },
    { id: '1', image: homeBanner2, alt: 'Home Banner 2' },
    { id: '2', image: homeBanner3, alt: 'Home Banner 3' },
    { id: '3', image: homeBanner4, alt: 'Home Banner 4' },
    { id: '4', image: homeBanner5, alt: 'Home Banner 5' },
    { id: '5', image: homeBanner6, alt: 'Home Banner 6' },
  ]
  const handleRadioChange = (id: string) => {
    const index = banners.findIndex((banner) => banner.id === id)
    if (index !== -1) {
      api?.scrollTo(index)
    }
  }
  return (
    <Carousel
      className="w-full"
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      setApi={setApi}
    >
      <CarouselContent>
        {banners.map((banner) => (
          <CarouselItem key={banner?.id}>
            <div className="p-1 w-full h-80 rounded-lg">
              <img
                className="w-full h-full object-cover object-center rounded-lg"
                src={banner?.image}
                alt={banner?.alt}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute bottom-2 flex w-full justify-center text-primary-foreground ">
        <RadioGroup value={banners[current]?.id} onValueChange={handleRadioChange} className="flex space-x-1">
          {banners.map((banner) => (
            <div key={banner?.id}>
              <RadioGroupItem value={banner?.id} id={banner?.id} className="bg-secondary/30" />
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="absolute left-14 top-2/4">
        <CarouselPrevious />
      </div>
      <div className="absolute right-14 top-2/4">
        <CarouselNext />
      </div>
    </Carousel>
  )
}

export default HomeBanner
