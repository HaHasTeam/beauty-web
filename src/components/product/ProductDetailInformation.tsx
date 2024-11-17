import { useTranslation } from 'react-i18next'

import { IProduct } from '@/types/product.interface'

import { Button } from '../ui/button'
import PriceSection from './PriceSection'
import ProductStar from './ProductStar'
import ProductTag from './ProductTag'
import SpecialEvent from './SpecialEvent'

interface ProductDetailInformationProps {
  product: IProduct
  scrollToReviews: () => void
}

const ProductDetailInformation = ({ product, scrollToReviews }: ProductDetailInformationProps) => {
  const { t } = useTranslation()
  const handleSelectClassification = (classificationId: string) => {
    console.log(classificationId)
  }
  return (
    <div className="w-full flex flex-col gap-4">
      {/* name and tag */}
      <div className="w-full bg-white rounded-lg flex flex-col gap-3 py-4 px-3">
        <div className="flex gap-2">
          {product?.tag && <ProductTag tag={product?.tag} text={product?.tag} />}
          <span className="line-clamp-2 font-semibold text-lg">{product?.name}</span>
        </div>

        {/* rating */}
        <div className="flex gap-2 align-middle items-center">
          <div className="flex gap-2 align-middle items-center hover:cursor-pointer" onClick={scrollToReviews}>
            <span className="font-semibold">{product?.rating}</span>
            <ProductStar rating={product?.rating} ratingAmount={product?.ratingAmount} />
          </div>
          <div className="border-l border-gray-300 px-2">
            <span className="text-gray-500 text-sm">
              {t('productCard.soldInPastMonth', { amount: product?.soldInPastMonth ?? 0 })}
            </span>
          </div>
        </div>

        {/* special flash sale, group buying or pre-order event */}
        <SpecialEvent time="03:12:11" title="flash sale" />
        {/* price */}
        <PriceSection currentPrice={product?.currentPrice ?? 0} deal={product?.deal ?? 0} price={product?.price} />

        {/* brand deals */}
        <div className="flex gap-2">
          <span className="text-gray-600">{t('productDetail.brandDeal')}</span>
          {product?.deal && product?.deal > 0 && <ProductTag tag="DealPercent" text={product?.deal * 100 + '%'} />}
        </div>
        {/* classification */}
        <div className="flex gap-2 items-center">
          <span className="text-gray-600">{t('productDetail.classification')}</span>
          <div className="flex flex-wrap items-start gap-4">
            {product?.classifications?.map((classification) => (
              <Button
                onClick={() => handleSelectClassification(classification?.id)}
                className="font-semibold"
                key={classification?.id}
                variant="outline"
              >
                {classification?.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* description */}
      <div className="w-full py-4 px-3 bg-white rounded-lg">
        <h3 className="font-semibold mb-3 text-lg">{t('productDetail.descriptionTitle')}</h3>
        <p>{product?.description}</p>
      </div>
    </div>
  )
}

export default ProductDetailInformation
