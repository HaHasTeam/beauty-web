import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { IClassification } from '@/types/classification.interface'
import { IProduct } from '@/types/product.interface'

import { Button } from '../ui/button'
import PriceSection from './PriceSection'

interface ProductDetailActionProps {
  product: IProduct
  chosenClassification: IClassification
}

const ProductDetailAction = ({ product, chosenClassification }: ProductDetailActionProps) => {
  const { t } = useTranslation()
  const [quantity, setQuantity] = useState(1)
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const formatPrice = (price: number) => {
    return (
      new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
        maximumFractionDigits: 0,
      }).format(price) + 'đ'
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <PriceSection price={product?.price} currentPrice={product?.currentPrice ?? 0} deal={product?.deal ?? 0} />
      </div>

      <div>
        <Button className="font-semibold" key={chosenClassification?.id} variant="outline">
          {chosenClassification?.name}
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">{t('productDetail.quantity')}</label>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={decreaseQuantity} className="h-10 w-10">
              -
            </Button>
            <input type="text" value={quantity} readOnly className="w-16 h-10 text-center border rounded-md" />
            <Button variant="outline" size="icon" onClick={increaseQuantity} className="h-10 w-10">
              +
            </Button>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-1">{t('productDetail.total')}</div>
          <div className="text-2xl font-bold">
            {formatPrice(
              product.currentPrice && product.currentPrice > 0
                ? product.currentPrice * quantity
                : product?.price * quantity,
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Button className="w-full bg-primary hover:bg-primary/80 text-white">{t('productDetail.buyNow')}</Button>
          <Button
            variant="outline"
            className="w-full border-primary text-primary hover:text-primary hover:bg-primary/10"
          >
            {t('productDetail.addToCart')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailAction
