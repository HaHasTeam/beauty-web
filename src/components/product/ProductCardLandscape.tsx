import { ChevronDown, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import { IClassification } from '@/types/classification.interface'

import IncreaseDecreaseButton from '../IncreaseDecreaseButton'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import ProductTag from './ProductTag'

interface ProductCardLandscapeProps {
  productImage: string
  productId: string
  productName: string
  classifications: IClassification[]
  eventType: string
  currentPrice: number
  price: number
  productQuantity: number
  isSelected: boolean
  onChooseProduct: (productId: string) => void
}
const ProductCardLandscape = ({
  productImage,
  productId,
  productName,
  classifications,
  currentPrice,
  eventType,
  price,
  isSelected,
  onChooseProduct,
  productQuantity,
}: ProductCardLandscapeProps) => {
  const { t } = useTranslation()
  const [quantity, setQuantity] = useState(productQuantity ?? 1)
  const [inputValue, setInputValue] = useState(productQuantity.toString() ?? '1')

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
  const selectedClassifications = classifications.filter((classification) => classification.selected)
  return (
    <div className="w-full py-4 border-b border-gray-200">
      <div className="w-full flex gap-2 items-center">
        <div className="flex gap-1 items-center lg:w-[10%] md:w-[10%] w-[14%]">
          <Checkbox id={productId} checked={isSelected} onClick={() => onChooseProduct(productId)} />
          <Link to={configs.routes.products + '/' + productId}>
            <div className="lg:w-20 lg:h-20 md:w-14 md:h-14 h-8 w-8">
              <img src={productImage} alt={productName} className="object-cover w-full h-full" />
            </div>
          </Link>
        </div>

        <div className="flex md:flex-row flex-col lg:w-[65%] md:w-[65%] sm:w-[34%] w-[34%] gap-2">
          <div className="order-1 flex gap-1 items-center lg:w-[50%] md:w-[35%] w-full">
            <div className="flex flex-col gap-1">
              <Link to={configs.routes.products + '/' + productId}>
                <h3 className="font-semibold lg:text-sm text-xs line-clamp-2">{productName}</h3>
              </Link>
              <div>
                <ProductTag tag={eventType} size="small" />
              </div>
            </div>
          </div>
          <div className="order-3 md:order-2 flex items-center gap-2 lg:w-[30%] md:w-[40%] w-full">
            <span className="text-muted-foreground lg:text-sm text-xs">{t('productDetail.classification')}</span>
            <Button variant="outline" size="sm" className="h-7">
              {selectedClassifications.map((classification) => (
                <span key={classification.id}>{classification.name}</span>
              ))}
              <ChevronDown className="w-full h-full" />
            </Button>
          </div>
          <div className="order-2 md:order-3 w-full md:w-[25%] lg:w-[20%] flex gap-1 items-center">
            <span className="text-red-500 lg:text-lg md:text-sm sm:text-xs text-xs font-medium">
              {t('productCard.currentPrice', { price: currentPrice })}
            </span>
            <span className="text-gray-400 lg:text-sm text-xs line-through">
              {t('productCard.price', { price: price })}
            </span>
          </div>
        </div>

        <div className="w-[26%] md:w-[12%] sm:w-[20%]">
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
        <span className="text-red-500 lg:text-lg md:text-sm sm:text-xs text-xs font-medium w-[16%] md:w-[8%] sm:w-[12%] ">
          {t('productCard.currentPrice', { price: totalPrice })}
        </span>

        <div className="w-[7%] sm:w-[5%]">
          <Trash2 onClick={() => {}} className="text-red-500 hover:cursor-pointer hover:text-red-700" />
        </div>
      </div>
    </div>
  )
}

export default ProductCardLandscape
