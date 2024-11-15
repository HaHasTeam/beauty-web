import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import productImage from '@/assets/images/product_sample_img.png'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import configs from '@/config'
import { IProductCard } from '@/types/product-card.interface'

import ProductTag from './ProductTag'
import SoldProgress from './SoldProgress'

interface ProductCardProps {
  product: IProductCard
}
export default function SaleProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation()
  return (
    <Link to={configs.routes.products + '/' + product.id}>
      <Card>
        <CardContent className="p-0 relative">
          <div className="absolute top-3 left-3 z-10">{product?.tag && <ProductTag tag={product?.tag} />}</div>
          <button className="absolute top-3 right-3 z-10 bg-gray-300 bg-opacity-30 rounded-full p-2 flex items-center justify-center hover:opacity-70">
            <Heart fill="white" className="w-5 h-5 focus:text-rose-500 transition-colors text-white opacity-100 " />
            {/* <Heart fill="red" className="w-5 h-5 hover:w-5 hover:h-5 text-rose-500 transition-colors  " /> */}
          </button>
          <div className="relative aspect-square">
            <img
              src={productImage}
              alt="Pink serum bottle with cherry blossoms"
              className="object-cover w-full h-full rounded-tl-xl rounded-tr-xl"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 p-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold">
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
          <div className="w-full space-y-1.5">
            <SoldProgress
              soldAmount={product?.flashSale?.soldAmount ?? 0}
              maxAmount={product?.flashSale?.productAmount ?? 0}
            />
          </div>
          <Button className="w-full bg-primary hover:bg-primary/70 text-primary-foreground">
            {t('button.addToCard')}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
