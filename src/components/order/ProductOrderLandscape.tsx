import { useTranslation } from 'react-i18next'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import { IClassification } from '@/types/classification'
import { ClassificationTypeEnum, OrderEnum } from '@/types/enum'
import { IOrderDetail } from '@/types/order'
import { IProduct } from '@/types/product'

import ImageWithFallback from '../ImageFallback'
import ProductTag from '../product/ProductTag'

interface ProductOrderLandscapeProps {
  product: IProduct
  productClassification: IClassification
  orderDetail: IOrderDetail
  productType: string
}
const ProductOrderLandscape = ({
  product,
  productClassification,
  orderDetail,
  productType,
}: ProductOrderLandscapeProps) => {
  const { t } = useTranslation()
  return (
    <div className="flex gap-4 mb-4">
      <div className="lg:w-22 lg:h-22 md:w-16 md:h-16 h-10 w-10 my-auto">
        <ImageWithFallback
          src={product?.images[0]?.fileUrl}
          alt={product?.name}
          className="object-cover w-full h-full rounded-md"
          fallback={fallBackImage}
        />
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{product?.name}</h3>
        {productClassification?.type === ClassificationTypeEnum.CUSTOM && (
          <p className="text-sm text-muted-foreground">
            {t('order.classification')}:{' '}
            <span className="text-primary font-medium">{productClassification?.title}</span>
          </p>
        )}

        <p className="text-sm">x{orderDetail?.quantity}</p>
        {productType && productType !== OrderEnum.NORMAL && <ProductTag tag={productType} />}
      </div>
      <div className="text-right flex items-center gap-1">
        {orderDetail?.unitPriceBeforeDiscount - orderDetail?.unitPriceAfterDiscount === 0 ? null : (
          <span className="line-through text-sm text-muted-foreground">
            {t('productCard.price', { price: productClassification?.price })}
          </span>
        )}
        {orderDetail?.unitPriceBeforeDiscount - orderDetail?.unitPriceAfterDiscount === 0 ? (
          <span className="text-red-500">
            {t('productCard.price', {
              price: productClassification?.price,
            })}
          </span>
        ) : (
          <span className="text-red-500">
            {t('productCard.price', {
              price: orderDetail?.unitPriceAfterDiscount,
            })}
          </span>
        )}
      </div>
    </div>
  )
}

export default ProductOrderLandscape
