import { useTranslation } from 'react-i18next'

import { IClassification } from '@/types/classification'
import { IOrderDetail } from '@/types/order'
import { IProduct } from '@/types/product'

interface ProductOrderLandscapeProps {
  product: IProduct
  productClassification: IClassification
  orderDetail: IOrderDetail
}
const ProductOrderLandscape = ({ product, productClassification, orderDetail }: ProductOrderLandscapeProps) => {
  const { t } = useTranslation()
  return (
    <div className="flex gap-4 mb-4">
      <img src="/placeholder.svg" alt="Product" className="h-20 w-20 object-cover rounded" />
      <div className="flex-1">
        <h3 className="font-medium">{product?.name}</h3>
        <p className="text-sm text-muted-foreground">
          {t('order.classification')}: <span className="text-primary font-medium">{productClassification?.title}</span>
        </p>
        <p className="text-sm">x{orderDetail?.quantity}</p>
      </div>
      <div className="text-right flex items-center">
        <span className="line-through text-sm text-muted-foreground">₫460.300</span>
        <span className="text-red-500">₫460.300</span>
      </div>
    </div>
  )
}

export default ProductOrderLandscape
