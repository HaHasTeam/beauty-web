import { useEffect, useState } from 'react'

import { IProduct } from '@/types/product'

import { Button } from '../ui/button'
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'

interface ProductCarouselProps {
  product: IProduct
}

const ProductCarousel = ({ product }: ProductCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [currentImage, setCurrentImage] = useState(product?.images[0].fileUrl ?? '')

  useEffect(() => {
    if (!api) return

    // Set current index when carousel is initialized
    setCurrent(api.selectedScrollSnap())
    setCurrentImage(product?.images[api.selectedScrollSnap()]?.fileUrl ?? '')

    // Update current and currentImage when the carousel changes
    api.on('select', () => {
      const newIndex = api.selectedScrollSnap()
      setCurrent(newIndex)
      setCurrentImage(product?.images[newIndex]?.fileUrl ?? '')
    })
  }, [api, product?.images])

  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index)
    setCurrent(index)
    setCurrentImage(product?.images[index]?.fileUrl ?? '')
  }
  return (
    <div className="w-full flex flex-col space-y-3">
      {/* product display here */}
      <div className="w-full bg-white flex justify-center align-middle items-center border-gray-200 border rounded-lg">
        <div className="p-1 w-full h-96 rounded-lg flex justify-center align-middle items-center">
          <img className="w-full h-full object-cover object-center rounded-lg" src={currentImage} alt={currentImage} />
        </div>
      </div>
      <Carousel className="w-full flex justify-center items-center" setApi={setApi}>
        <CarouselContent className="w-full ml-0 flex gap-2 items-center justify-center">
          {product?.images?.map((img, index) => (
            <CarouselItem
              key={img?.id}
              className={`p-0 ${product?.images?.length >= 5 ? 'basis-[calc(20%-8px)]' : product?.images?.length === 4 ? 'basis-[calc(25%-8px)]' : product?.images?.length === 3 ? 'basis-[calc(30%-8px)]' : 'basis-[calc(35%-8px)]'} flex-grow flex-shrink-0`}
            >
              <Button
                key={img?.id}
                variant="outline"
                onClick={() => handleThumbnailClick(index)}
                className={`w-full h-24 p-0 rounded-md border ${
                  current === index ? 'border-primary' : 'border-gray-200'
                } focus:outline-none`}
              >
                <img className="w-full h-full object-cover rounded-md" src={img?.fileUrl} alt={img?.fileUrl} />
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        {product?.images?.length > 5 && (
          <>
            <div className="absolute left-14 top-2/4">
              <CarouselPrevious />
            </div>
            <div className="absolute right-14 top-2/4">
              <CarouselNext />
            </div>
          </>
        )}
      </Carousel>
    </div>
  )
}

export default ProductCarousel
