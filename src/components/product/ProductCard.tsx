import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import configs from '@/config'
import { useCart } from '@/hooks/useCarts'
import { IProduct } from '@/types/product'

import Button from '../button'
import ProductStar from './ProductStar'
import ProductTag from './ProductTag'

interface ProductCardProps {
  product: IProduct
}
export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { addToCart } = useCart()
  return (
    <Card className="relative">
      <CardContent
        className="p-0 relative cursor-pointer"
        onClick={() => {
          console.log('onCLick', product.id)
          navigate(`${configs.routes.products}/${product.id}`)
        }}
      >
        <div className="absolute top-3 left-3 z-10">{product?.tag && <ProductTag tag={product?.tag} />}</div>
        <button className="absolute top-3 right-3 z-10 bg-gray-300 bg-opacity-30 rounded-full p-2 flex items-center justify-center hover:opacity-70">
          <Heart fill="white" className="w-5 h-5 focus:text-rose-500 transition-colors text-white opacity-100 " />
          {/* <Heart fill="red" className="w-5 h-5 hover:w-5 hover:h-5 text-rose-500 transition-colors  " /> */}
        </button>
        <div className="relative aspect-square">
          <img
            src={product?.images[0]?.fileUrl}
            alt={product?.images[0]?.id}
            className="object-cover w-full h-full rounded-tl-xl rounded-tr-xl"
          />
        </div>
        <div className="w-full h-lg-[130px] h-[150px]  p-4 p-md-3">
          <span className="text-semibold line-clamp-2">{product?.name}</span>
          <ProductStar rating={product?.rating} ratingAmount={product?.ratingAmount} />
          <div className="mt-1 mb-2">
            <span className="text-gray-500 text-sm">
              {t('productCard.soldInPastMonth', { amount: product?.soldInPastMonth ?? 0 })}
            </span>
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold">
                {t('productCard.currentPrice', { price: product?.currentPrice })}
              </span>
              {product?.deal && product?.deal > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  {t('productCard.price', { price: product?.price })}
                </span>
              )}
            </div>
            {product?.deal && product?.deal > 0 && (
              <ProductTag tag="DealPercent" text={`-${(product?.deal * 100).toFixed(0)}%`} />
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 p-4 p-md-3">
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
      </CardFooter>
    </Card>
  )
}
