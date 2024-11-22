import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import { IClassification } from '@/types/classification.interface'

import { Label } from '../ui/label'
import ProductTag from './ProductTag'

interface ProductCheckoutLandscapeProps {
  productImage: string
  productId: string
  productName: string
  classifications: IClassification[]
  eventType: string
  currentPrice: number
  price: number
  totalPrice: number
  productQuantity: number
}
const ProductCheckoutLandscape = ({
  productImage,
  productId,
  productName,
  currentPrice,
  eventType,
  productQuantity,
  totalPrice,
  classifications,
  price,
}: ProductCheckoutLandscapeProps) => {
  const { t } = useTranslation()
  const selectedOptionName =
    classifications.find((classification) => classification.selected === true)?.name || t('productDetail.selectOption')
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
                <h3 className="font-semibold lg:text-sm text-xs line-clamp-2">{productName}</h3>
              </Link>
              <div>
                <ProductTag tag={eventType} size="small" />
              </div>
            </div>
          </div>
          <div className="order-3 sm:order-2 flex items-center gap-2 xl:w-[30%] lg:w-[30%] md:w-[30%] w-full">
            <Label>
              <span className="text-muted-foreground lg:text-sm text-xs overflow-ellipsis">
                {t('productDetail.classification')}:
              </span>
            </Label>
            <span className="line-clamp-2 lg:text-base md:text-sm sm:text-xs text-xs">{selectedOptionName}</span>
          </div>
          <div className="order-2 sm:order-3 w-full md:w-[25%] lg:w-[25%] xl:w-[20%] flex gap-1 items-center justify-start sm:justify-end">
            <span className="text-red-500 xl:text-lg lg:text-base md:text-sm sm:text-xs text-xs font-medium">
              {t('productCard.currentPrice', { price: currentPrice })}
            </span>
            <span className="text-gray-400 lg:text-sm text-xs line-through">
              {t('productCard.price', { price: price })}
            </span>
          </div>
        </div>

        <div className="w-[10%] md:w-[9%] sm:w-[8%] text-end">
          <span className="lg:text-base md:text-sm sm:text-xs text-xs">{productQuantity}</span>
        </div>
        <span className="text-red-500 lg:text-lg md:text-sm sm:text-xs text-xs font-medium w-[20%] md:w-[14%] sm:w-[12%] text-end">
          {t('productCard.currentPrice', { price: totalPrice })}
        </span>
      </div>
    </div>
  )
}

export default ProductCheckoutLandscape
