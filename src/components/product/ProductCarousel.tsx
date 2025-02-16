import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { IClassification } from '@/types/classification'
import { StatusEnum } from '@/types/enum'
import { IProduct } from '@/types/product'

import { Button } from '../ui/button'
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'

interface ProductCarouselProps {
  product: IProduct
  activeClassification: IClassification | null
}

const ProductCarousel = ({ product, activeClassification }: ProductCarouselProps) => {
  const { t } = useTranslation()
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  // const activeImages = useMemo(
  //   () => product?.images?.filter((img) => img.status === StatusEnum.ACTIVE) ?? [],
  //   [product?.images],
  // )
  const [imageSource, setImageSource] = useState('product') // 'product' or 'classification'

  const activeImages = useMemo(() => {
    if (imageSource === 'classification' && activeClassification && activeClassification?.images?.length > 0) {
      return activeClassification.images.filter((img) => img.status === StatusEnum.ACTIVE)
    }
    return product?.images?.filter((img) => img.status === StatusEnum.ACTIVE) ?? []
  }, [product?.images, activeClassification, imageSource])
  const [currentImage, setCurrentImage] = useState(activeImages[0].fileUrl ?? '')

  // useEffect(() => {
  //   if (!api) return

  //   // Set current index when carousel is initialized
  //   const updateCurrentImage = () => {
  //     const newIndex = api.selectedScrollSnap()
  //     setCurrent(newIndex)
  //     setCurrentImage(activeImages[newIndex]?.fileUrl ?? '')
  //   }

  //   updateCurrentImage()
  //   api.on('select', updateCurrentImage)

  //   return () => api.off('select', updateCurrentImage)
  // }, [api, activeImages])
  useEffect(() => {
    if (!api) return

    // Set current index when carousel is initialized
    setCurrent(api.selectedScrollSnap())
    setCurrentImage(activeImages[api.selectedScrollSnap()]?.fileUrl ?? '')

    // Update current and currentImage when the carousel changes
    api.on('select', () => {
      const newIndex = api.selectedScrollSnap()
      setCurrent(newIndex)
      setCurrentImage(activeImages[newIndex]?.fileUrl ?? '')
    })
  }, [api, activeImages])
  // Reset carousel when switching image sources
  useEffect(() => {
    setCurrent(0)
    setCurrentImage(activeImages[0]?.fileUrl ?? '')
    api?.scrollTo(0)
  }, [imageSource, activeImages, api])

  useEffect(() => {
    if (activeClassification !== null) {
      setImageSource('classification')
    }
  }, [activeClassification])

  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index)
    setCurrent(index)
    setCurrentImage(activeImages[index]?.fileUrl ?? '')
  }

  const thumbnailWidth = useMemo(() => {
    const count = activeImages.length
    if (count >= 5) return 'basis-[calc(20%-8px)]'
    if (count === 4) return 'basis-[calc(25%-8px)]'
    if (count === 3) return 'basis-[calc(33%-8px)]'
    if (count === 2) return 'basis-[calc(50%-8px)]'
    return 'basis-[calc(100%)]'
  }, [activeImages.length])
  return (
    <div className="w-full flex flex-col space-y-3">
      {/* Image Source Indicator */}
      {activeClassification && activeClassification.images?.length > 0 && (
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setImageSource(imageSource === 'product' ? 'classification' : 'product')}
            className="hover:bg-primary/10 hover:text-primary text-sm text-primary border border-primary"
          >
            {imageSource === 'product'
              ? // t('productDetail.viewClassificationImages', {
                //     classification:
                //       activeClassification[
                //         activeClassification.color ? 'color' : activeClassification.size ? 'size' : 'other'
                //       ],
                //   })
                t('productDetail.viewClassificationImages')
              : t('productDetail.viewProductImages')}
          </Button>
          {imageSource === 'classification' && (
            <span className="text-sm text-gray-500">
              {t('productDetail.viewing')}:{' '}
              {[activeClassification.color, activeClassification.size, activeClassification.other]
                .filter(Boolean)
                .join(' & ')}
            </span>
          )}
        </div>
      )}
      {/* product display here */}
      <div className="w-full bg-white flex justify-center align-middle items-center border-gray-200 border rounded-lg">
        <div className="p-1 w-full h-96 rounded-lg flex justify-center align-middle items-center">
          <img
            className="w-full h-full object-cover object-center rounded-lg"
            src={currentImage}
            alt={`${imageSource === 'product' ? 'Product' : 'Classification'} view ${current + 1}`}
          />
        </div>
      </div>
      <Carousel className="w-full flex justify-center items-center" setApi={setApi}>
        <CarouselContent className="w-full ml-0 flex gap-2 items-center justify-center">
          {activeImages.map((img, index) => (
            <CarouselItem key={img?.id} className={`p-0 ${thumbnailWidth} flex-grow flex-shrink-0`}>
              <Button
                key={img?.id}
                variant="outline"
                onClick={() => handleThumbnailClick(index)}
                className={`w-full h-24 p-0 rounded-md border ${
                  current === index ? 'border-primary' : 'border-gray-200'
                } focus:outline-none`}
              >
                <img
                  className="w-full h-full object-cover rounded-md"
                  src={img?.fileUrl}
                  alt={`Thumbnail ${index + 1}`}
                />
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        {activeImages?.length > 5 && (
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
