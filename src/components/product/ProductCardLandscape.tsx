import { ChevronDown, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import IncreaseDecreaseButton from '../IncreaseDecreaseButton'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import ProductTag from './ProductTag'

interface ProductCardLandscapeProps {
  productImage: string
  productId: string
  productName: string
  classification: string
  eventType: string
  currentPrice: number
  price: number
}
const ProductCardLandscape = ({
  productImage,
  productId,
  productName,
  classification,
  currentPrice,
  eventType,
  price,
}: ProductCardLandscapeProps) => {
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
  const totalPrice = currentPrice && currentPrice > 0 ? currentPrice * quantity : price * quantity
  return (
    <div className="w-full p-4 border-b border-gray-200">
      <div className="w-full flex gap-2 items-center">
        <div className="flex gap-1 items-center w-[44%]">
          <Checkbox id={productId} />
          <div className="w-20 h-20">
            <img src={productImage} alt={productName} className="object-cover w-full h-full" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-sm line-clamp-2">{productName}</h3>
            <div>
              <ProductTag tag={eventType} size="small" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 w-[17%]">
          <span className="text-muted-foreground text-sm">Phân Loại Hàng:</span>
          <Button variant="outline" size="sm" className="h-7">
            {classification}
            <ChevronDown className="w-full h-full" />
          </Button>
        </div>
        <div className=" w-[14%] flex gap-1 items-center">
          <span className="text-red-500 text-lg font-medium">
            {t('productCard.currentPrice', { price: currentPrice })}
          </span>
          <span className="text-gray-400 text-sm line-through">{t('productCard.price', { price: price })}</span>
        </div>
        <div className=" w-[12%]">
          <IncreaseDecreaseButton
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
            isIncreaseDisabled={quantity >= 1000}
            isDecreaseDisabled={quantity <= 1}
            inputValue={inputValue}
            handleInputChange={handleInputChange}
            size="small"
          />
        </div>
        <span className="text-red-500 text-lg font-medium  w-[8%]">
          {t('productCard.currentPrice', { price: totalPrice })}
        </span>

        <div className="w-[3%]"></div>
        <Trash2 onClick={() => {}} className="text-red-500 hover:cursor-pointer hover:text-red-700" />
      </div>
    </div>
  )
}

export default ProductCardLandscape
