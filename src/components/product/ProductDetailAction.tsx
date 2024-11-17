import '@/components/product/Product.css'

import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { IClassification } from '@/types/classification.interface'
import { IProduct } from '@/types/product.interface'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import PriceSection from './PriceSection'

interface ProductDetailActionProps {
  product: IProduct
  chosenClassification: IClassification
}

const ProductDetailAction = ({ product, chosenClassification }: ProductDetailActionProps) => {
  const { t } = useTranslation()
  const [quantity, setQuantity] = useState(1)
  const [inputValue, setInputValue] = useState('1')
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setInputValue(`${quantity - 1}`)
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < 1000) {
      setInputValue(`${quantity + 1}`)
      setQuantity(quantity + 1)
    }
  }

  // const formatPrice = (price: number) => {
  //   return (
  //     new Intl.NumberFormat('vi-VN', {
  //       style: 'decimal',
  //       maximumFractionDigits: 0,
  //     }).format(price) + 'đ'
  //   )
  // }
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

      if (parsedValue > 0 && parsedValue <= 1000) {
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={quantity <= 1}
              size="icon"
              onClick={decreaseQuantity}
              className={`h-10 w-10 border-gray-400 ${quantity <= 1 ? 'border-gray-300 text-gray-400' : ''}`}
            >
              <Minus />
            </Button>
            <Input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              min={1}
              className="w-16 h-10 text-center border-gray-400 rounded-md"
            />
            <Button
              variant="outline"
              disabled={quantity >= 1000}
              size="icon"
              onClick={increaseQuantity}
              className={`h-10 w-10 border-gray-400 ${quantity >= 1000 ? 'border-gray-300 text-gray-400' : ''}`}
            >
              <Plus />
            </Button>
          </div>
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
