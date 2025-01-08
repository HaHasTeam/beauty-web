import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import { IClassification } from '@/types/classification'
import { ClassificationTypeEnum, DiscountTypeEnum } from '@/types/enum'
import { DiscountType } from '@/types/product-discount'
import { calculateDiscountPrice, calculateTotalPrice } from '@/utils/price'

import { Label } from '../ui/label'
import ProductTag from './ProductTag'

interface ProductCheckoutLandscapeProps {
  productImage: string
  productId: string
  productName: string
  selectedClassification: string
  eventType: string
  discountType?: DiscountType | null
  discount?: number | null
  price: number
  productQuantity: number
  productClassification: IClassification | null
}
const ProductCheckoutLandscape = ({
  productImage,
  productId,
  productName,
  discountType,
  discount,
  eventType,
  productQuantity,
  selectedClassification,
  price,
  productClassification,
}: ProductCheckoutLandscapeProps) => {
  const { t } = useTranslation()
  const totalPrice = calculateTotalPrice(price, productQuantity, discount, discountType)
  const discountPrice = calculateDiscountPrice(price, discount, discountType)
  return (
    <div className="w-full py-4 border-b border-gray-200">
      <div className="w-full flex gap-2 items-center">
        <div className="flex gap-1 items-center lg:w-[10%] md:w-[10%] w-[16%]">
          <Link to={configs.routes.products + '/' + productId}>
            <div className="md:w-20 md:h-20 sm:w-20 sm:h-20 h-16 w-16">
              <img src={productImage} alt={productName} className="object-cover w-full h-full" />
            </div>
          </Link>
        </div>

        <div className="flex sm:flex-row flex-col lg:w-[68%] md:w-[77%] sm:w-[66%] w-[54%] gap-2">
          <div className="order-1 flex gap-1 items-center xl:w-[50%] lg:w-[45%] md:w-[40%] w-full">
            <div className="flex flex-col gap-1">
              <Link to={configs.routes.products + '/' + productId}>
                <h3 className="lg:text-sm text-xs line-clamp-2">{productName}</h3>
              </Link>
              <div>{eventType && eventType !== '' && <ProductTag tag={eventType} size="small" />}</div>
            </div>
          </div>
          <div className="order-3 sm:order-2 xl:w-[30%] lg:w-[30%] md:w-[30%] w-full">
            {productClassification?.type === ClassificationTypeEnum?.CUSTOM && (
              <div className="w-full flex items-center gap-2">
                <Label>
                  <span className="text-muted-foreground lg:text-sm text-xs overflow-ellipsis">
                    {t('productDetail.classification')}:
                  </span>
                </Label>
                <span className="line-clamp-2 lg:text-sm md:text-sm sm:text-xs text-xs">{selectedClassification}</span>
              </div>
            )}
          </div>
          {discount &&
          discount > 0 &&
          (discountType === DiscountTypeEnum.AMOUNT || discountType === DiscountTypeEnum.PERCENTAGE) ? (
            <div className="order-2 sm:order-3 w-full md:w-[25%] lg:w-[25%] xl:w-[20%] flex gap-1 items-center justify-start sm:justify-end">
              <span className="text-red-500 xl:text-base lg:text-sm md:text-sm sm:text-xs text-xs">
                {t('productCard.currentPrice', { price: discountPrice })}
              </span>
              <span className="text-gray-400 xl:text-base lg:text-sm text-xs line-through">
                {t('productCard.price', { price: price })}
              </span>
            </div>
          ) : (
            <div className="order-2 sm:order-3 w-full md:w-[25%] lg:w-[25%] xl:w-[20%] flex gap-1 items-center justify-start sm:justify-end">
              <span className="xl:text-base lg:text-sm md:text-sm sm:text-xs text-xs">
                {t('productCard.price', { price: price })}
              </span>
            </div>
          )}
        </div>

        <div className="w-[10%] md:w-[9%] sm:w-[8%] text-end">
          <span className="lg:text-sm md:text-sm sm:text-xs text-xs">{productQuantity}</span>
        </div>
        <span className="font-medium text-red-500 lg:text-base md:text-sm sm:text-xs text-xs w-[20%] md:w-[14%] sm:w-[12%] text-end">
          {t('productCard.currentPrice', { price: totalPrice })}
        </span>
      </div>
    </div>
  )
}

export default ProductCheckoutLandscape
