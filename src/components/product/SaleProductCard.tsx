import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import configs from '@/config'
import { DiscountTypeEnum, OrderEnum, StatusEnum } from '@/types/enum'
import { TFlashSale } from '@/types/flash-sale'
import { calculateDiscountPrice } from '@/utils/price'
import { getCheapestClassification } from '@/utils/product'

import ImageWithFallback from '../ImageFallback'
import ProductTag from './ProductTag'
import SoldProgress from './SoldProgress'

interface ProductCardProps {
  product: TFlashSale
}
export default function SaleProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation()
  const cheapestClassification = useMemo(
    () => getCheapestClassification(product.productClassifications ?? []),
    [product.productClassifications],
  )

  const getTotalSellProduct = useMemo(() => {
    const totalQuantity = product.productClassifications.reduce((a, b) => {
      return a + b.quantity
    }, 0)
    // console.log('totalQuantity', totalQuantity)
    return totalQuantity
  }, [product.productClassifications])
  const imageUrl =
    cheapestClassification?.title == 'Default'
      ? product?.images?.filter((el) => el.status === StatusEnum.ACTIVE)?.[0]?.fileUrl
      : cheapestClassification?.images?.filter((img) => img.status === StatusEnum.ACTIVE)?.[0]?.fileUrl
  return (
    <Link to={configs.routes.products + '/' + product.product.id}>
      <Card>
        <CardContent className="p-0 relative">
          <div className="absolute top-3 left-3 z-10">
            <ProductTag tag={OrderEnum.FLASH_SALE} />
          </div>
          {/* <button className="absolute top-3 right-3 z-10 bg-gray-300 bg-opacity-30 rounded-full p-2 flex items-center justify-center hover:opacity-70">
            <Heart fill="white" className="w-5 h-5 focus:text-rose-500 transition-colors text-white opacity-100 " />
            <Heart fill="red" className="w-5 h-5 hover:w-5 hover:h-5 text-rose-500 transition-colors  " />
          </button> */}
          <div className="relative aspect-square">
            <ImageWithFallback
              fallback={fallBackImage}
              src={imageUrl}
              alt={cheapestClassification?.title}
              className="object-cover w-full h-full rounded-tl-xl rounded-tr-xl"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:p-4 px-2 py-4">
          <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center items-end w-full flex-wrap">
            <div className="sm:order-1 order-2 flex items-baseline gap-2">
              <span className="text-xl font-semibold">
                {t('productCard.currentPrice', {
                  price: calculateDiscountPrice(
                    cheapestClassification?.price ?? 0,
                    product.discount,
                    DiscountTypeEnum.PERCENTAGE,
                  ),
                })}
              </span>
              {product?.discount && product?.discount > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  {t('productCard.price', {
                    price: cheapestClassification?.price ?? 0,
                  })}
                </span>
              )}
            </div>
            {product?.discount && product?.discount > 0 && (
              <div className="sm:order-2 order-1">
                <ProductTag tag="DealPercent" text={`-${(product.discount * 100).toFixed(0)}%`} />
              </div>
            )}
          </div>
          <div className="w-full space-y-1.5">
            <SoldProgress soldAmount={10} maxAmount={getTotalSellProduct} />
          </div>
          {/* <Button className="w-full bg-primary hover:bg-primary/70 text-primary-foreground">
            {t('button.addToCard')}
          </Button> */}
        </CardFooter>
      </Card>
    </Link>
  )
}
