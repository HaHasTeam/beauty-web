import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import configs from '@/config'
import { IProduct } from '@/types/product'
import ProductDetail from '@/views/ProductDetail'

import ImageWithFallback from '../ImageFallback'
import ProductStar from './ProductStar'
import ProductTag from './ProductTag'

interface ProductCardProps {
  product: IProduct
  isProductDiscount?: boolean
  isInGroupBuying?: boolean
}
export default function ProductCard({ product, isProductDiscount = false, isInGroupBuying = false }: ProductCardProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  if (isProductDiscount) {
    console.log(product)
  }

  return (
    <Dialog>
      <DialogTrigger className="text-start">
        <Card>
          <CardContent
            className="p-0 relative cursor-pointer overflow-hidden"
            onClick={() => {
              if (!isInGroupBuying) navigate(`${configs.routes.products}/${product.id}`)
            }}
          >
            <div className="absolute top-3 left-3 z-10">{product?.tag && <ProductTag tag={product?.tag} />}</div>

            {/* <button className="absolute top-3 right-3 z-10 bg-gray-300 bg-opacity-30 rounded-full p-2 flex items-center justify-center hover:opacity-70">
              <Heart fill="white" className="w-5 h-5 focus:text-rose-500 transition-colors text-white opacity-100 " />
              <Heart fill="red" className="w-5 h-5 hover:w-5 hover:h-5 text-rose-500 transition-colors  " />
            </button> */}
            <div className="relative aspect-square">
              <ImageWithFallback
                src={product?.images[0]?.fileUrl}
                fallback={fallBackImage}
                alt={product.name}
                className="object-cover w-full h-full rounded-tl-xl rounded-tr-xl"
              />
            </div>
            <div className="w-full h-lg-[130px] h-[150px]  p-2 p-md-3">
              {isProductDiscount && product?.deal && product?.deal > 0 && (
                <ProductTag tag="DealPercent" text={`-${(product?.deal * 100).toFixed(0)}%`} />
              )}
              <div className="min-h-[90px]">
                <span className="text-semibold line-clamp-2 sm:text-sm text-xs">{product?.name}</span>
                <ProductStar rating={product?.rating} ratingAmount={product?.ratingAmount} />
                <div className="mt-1 mb-2">
                  <span className="text-gray-500 text-sm line-clamp-1">
                    {t('productCard.soldInPastMonth', { amount: product?.soldInPastMonth ?? 0 })}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center w-full">
                {product?.deal && product?.deal > 0 ? (
                  <div className="flex gap-1 items-center">
                    <span className="text-red-500 lg:text-base md:text-sm sm:text-xs text-xs font-medium">
                      {t('productCard.currentPrice', { price: product?.currentPrice })}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {t('productCard.price', { price: product?.price })}
                    </span>
                  </div>
                ) : product?.price >= 0 ? (
                  <span className="lg:text-base md:text-sm sm:text-xs text-xs">
                    {t('productCard.price', { price: product?.price })}
                  </span>
                ) : null}
              </div>
            </div>
          </CardContent>
          {/* <CardFooter className="flex flex-col gap-3 p-4 p-md-3">
        <Button
          className="relative  bottom-0 w-full bg-primary hover:bg-primary/70 text-primary-foreground"
          onClick={() => {
            console.log('clicked product', product.name)
            addToCart({
              quantity: 1,
              classification: product.classifications[0].title,
              productClassification: product?.classifications[0].id,
            })
          }}
        >
          {t('button.addToCard')}
        </Button>
      </CardFooter> */}
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-7xl overflow-auto max-h-[80%]">
        <ProductDetail initProductId={product.id} isInGroupBuying />
      </DialogContent>
    </Dialog>
  )
}
