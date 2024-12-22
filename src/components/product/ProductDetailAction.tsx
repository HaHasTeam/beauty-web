import '@/components/product/Product.css'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { IClassification } from '@/types/classification'
import { IProduct } from '@/types/product'

import IncreaseDecreaseButton from '../IncreaseDecreaseButton'
import { Button } from '../ui/button'
import PriceSection from './PriceSection'

interface ProductDetailActionProps {
  product: IProduct
  chosenClassification: IClassification
}

const ProductDetailAction = ({ product, chosenClassification }: ProductDetailActionProps) => {
  const { t } = useTranslation()
  const [quantity, setQuantity] = useState(1)
  const [inputValue, setInputValue] = useState('1')
  const MAX_QUANTITY_IN_CART = 1000 // change to max quantity of products
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setInputValue(`${quantity - 1}`)
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < MAX_QUANTITY_IN_CART) {
      setInputValue(`${quantity + 1}`)
      setQuantity(quantity + 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow clearing the input
    if (value === '') {
      setInputValue('')
      setQuantity(1)
      return
    }

    // Allow only valid positive integers
    if (/^\d+$/.test(value)) {
      const parsedValue = parseInt(value, 10)

      if (parsedValue > 0 && parsedValue <= MAX_QUANTITY_IN_CART) {
        setInputValue(value) // Update input with valid value
        setQuantity(parsedValue) // Update quantity
      }
    }
  }

  const total =
    product.currentPrice && product.currentPrice > 0 ? product.currentPrice * quantity : product?.price * quantity
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
          <IncreaseDecreaseButton
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
            isIncreaseDisabled={quantity >= MAX_QUANTITY_IN_CART}
            isDecreaseDisabled={quantity <= 1}
            inputValue={inputValue}
            handleInputChange={handleInputChange}
          />
        </div>

        <div>
          <div className="text-sm font-medium mb-1">{t('productDetail.total')}</div>
          <div className="text-2xl font-bold">{total}</div>
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
