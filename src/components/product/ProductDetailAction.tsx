import '@/components/product/Product.css'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import configs from '@/config'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { createCartItemApi, getMyCartApi } from '@/network/apis/cart'
import useCartStore from '@/store/cart'
import { IClassification } from '@/types/classification'
import { IProduct } from '@/types/product'
import { createCartFromProduct } from '@/utils/cart'

import IncreaseDecreaseButton from '../IncreaseDecreaseButton'
import { Button } from '../ui/button'
import PriceSection from './PriceSection'

interface ProductDetailActionProps {
  product: IProduct
  chosenClassification: IClassification
}

const ProductDetailAction = ({ product, chosenClassification }: ProductDetailActionProps) => {
  const { t } = useTranslation()
  const { setSelectedCartItem } = useCartStore()
  const [quantity, setQuantity] = useState(1)
  const [inputValue, setInputValue] = useState('1')
  const MAX_QUANTITY_IN_CART = chosenClassification?.quantity // change to max quantity of products
  const [isProcessing, setIsProcessing] = useState(false)
  const { successToast, errorToast } = useToast()
  const handleServerError = useHandleServerError()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutateAsync: createCartItemFn } = useMutation({
    mutationKey: [createCartItemApi.mutationKey],
    mutationFn: createCartItemApi.fn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [getMyCartApi.queryKey],
      })
      successToast({
        message: t('cart.addToCartSuccess'),
        isShowDescription: false,
      })
    },
  })

  const handleCreateCartItem = useCallback(async () => {
    if (isProcessing) return
    setIsProcessing(true)
    setQuantity(quantity)
    setInputValue(quantity.toString())
    try {
      await createCartItemFn({
        classification: chosenClassification?.title,
        productClassification: chosenClassification?.id,
        quantity: quantity,
      })
    } catch (error) {
      handleServerError({ error })
    } finally {
      setIsProcessing(false)
    }
  }, [
    isProcessing,
    quantity,
    createCartItemFn,
    chosenClassification?.title,
    chosenClassification?.id,
    handleServerError,
  ])

  const decreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      setInputValue(newQuantity.toString())
    }
  }

  const increaseQuantity = () => {
    if (quantity < MAX_QUANTITY_IN_CART) {
      const newQuantity = quantity + 1
      setQuantity(newQuantity)
      setInputValue(newQuantity.toString())
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
        setInputValue(value)
        setQuantity(parsedValue)
      } else if (parsedValue > MAX_QUANTITY_IN_CART) {
        errorToast({
          message: t('cart.maxQuantityError', { maxQuantity: MAX_QUANTITY_IN_CART }),
          isShowDescription: false,
        })
      } else if (parsedValue <= 0) {
        errorToast({ message: t('cart.negativeQuantityError'), isShowDescription: false })
      }
    }
  }

  const total =
    product.currentPrice && product.currentPrice > 0 ? product.currentPrice * quantity : product?.price * quantity

  const handleBlur = () => {
    const newQuantity = parseInt(inputValue, 10)
    setQuantity(newQuantity)
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newQuantity = parseInt(inputValue, 10)
      setQuantity(newQuantity)
    }
  }

  const handleCheckout = () => {
    setSelectedCartItem(createCartFromProduct(product, quantity, chosenClassification))
    navigate(configs.routes.checkout)
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <PriceSection price={product?.price} currentPrice={product?.currentPrice ?? 0} deal={product?.deal ?? 0} />
      </div>

      <div>
        <Button className="font-semibold" key={chosenClassification?.id} variant="outline">
          {chosenClassification?.title}
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
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            isProcessing={isProcessing}
            size="small"
          />
        </div>

        <div>
          <div className="text-sm font-medium mb-1">{t('productDetail.total')}</div>
          <div className="text-2xl font-bold">{total}</div>
        </div>

        <div className="space-y-2">
          <Button className="w-full bg-primary hover:bg-primary/80 text-white" onClick={() => handleCheckout()}>
            {t('productDetail.buyNow')}
          </Button>
          <Button
            variant="outline"
            className="w-full border-primary text-primary hover:text-primary hover:bg-primary/10"
            onClick={() => handleCreateCartItem()}
          >
            {t('productDetail.addToCart')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailAction
