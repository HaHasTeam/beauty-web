import '@/components/product/Product.css'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import configs from '@/config'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { createCartItemApi, getMyCartApi } from '@/network/apis/cart'
import useCartStore from '@/store/cart'
import { useStore } from '@/store/store'
import { IClassification } from '@/types/classification'
import { DiscountTypeEnum, OrderEnum, ProductDiscountEnum, ProductEnum, StatusEnum } from '@/types/enum'
import { IProduct } from '@/types/product'
import { createCartFromProduct } from '@/utils/cart'
import { calculateDiscountPrice, calculateTotalPrice } from '@/utils/price'

import ImageWithFallback from '../ImageFallback'
import IncreaseDecreaseButton from '../IncreaseDecreaseButton'
import { Button } from '../ui/button'

interface ProductDetailActionProps {
  product: IProduct
  chosenClassification: IClassification | null
  discount?: number
  discountType?: DiscountTypeEnum | null
  hasCustomType?: boolean
  inStock: boolean
  isInGroupBuying?: boolean
  event: OrderEnum
}

const ProductDetailAction = ({
  isInGroupBuying = false,
  product,
  chosenClassification,
  discount,
  discountType,
  hasCustomType,
  inStock,
  event,
}: ProductDetailActionProps) => {
  const { t } = useTranslation()
  const { setSelectedCartItem, cartItems } = useCartStore()
  const { user } = useStore(
    useShallow((state) => ({
      user: state.user,
    })),
  )
  let groupBuying = useParams().groupId
  groupBuying = isInGroupBuying ? groupBuying : undefined

  const [quantity, setQuantity] = useState(1)
  const [inputValue, setInputValue] = useState('1')
  const MAX_QUANTITY_IN_CART = chosenClassification
    ? chosenClassification?.quantity
    : (product?.productClassifications ?? [])[0]?.quantity // change to max quantity of products
  const [isProcessing, setIsProcessing] = useState(false)
  const { successToast, errorToast } = useToast()
  const handleServerError = useHandleServerError()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // when quantity add to cart is greater than product classification quantity
  // const cartQuantity = useMemo(() => {
  //   return (
  //     cartItems[product?.brand?.name ?? '']?.find(
  //       (cartItem) => cartItem.productClassification.id === chosenClassification?.id,
  //     )?.quantity ?? 0
  //   )
  // }, [cartItems, chosenClassification?.id, product?.brand?.name])
  const cartQuantity = useMemo(() => {
    const brandName = product?.brand?.name ?? ''
    if (!cartItems || !cartItems[brandName] || !Array.isArray(cartItems[brandName])) {
      return 0
    }

    if (!chosenClassification?.id) {
      return 0
    }

    const foundItem = cartItems[brandName].find(
      (cartItem) => cartItem.productClassification?.id === chosenClassification.id,
    )

    return foundItem?.quantity ?? 0
  }, [cartItems, chosenClassification?.id, product?.brand?.name])
  // const maxAcceptQuantity = useMemo(() => {
  //   return (
  //     MAX_QUANTITY_IN_CART -
  //     (cartItems[product?.brand?.name ?? '']?.find(
  //       (cartItem) => cartItem.productClassification.id === chosenClassification?.id,
  //     )?.quantity ?? 0)
  //   )
  // }, [MAX_QUANTITY_IN_CART, cartItems, chosenClassification?.id, product?.brand?.name])
  // const disabledAddToCartButton = useMemo(() => {
  //   return (
  //     (cartItems[product?.brand?.name ?? '']?.find(
  //       (cartItem) => cartItem.productClassification.id === chosenClassification?.id,
  //     )?.quantity ?? 0) +
  //       quantity >
  //     MAX_QUANTITY_IN_CART
  //   )
  // }, [MAX_QUANTITY_IN_CART, cartItems, chosenClassification?.id, product?.brand?.name, quantity])

  const maxAcceptQuantity = useMemo(() => {
    const brandName = product?.brand?.name ?? ''
    if (!cartItems || !cartItems[brandName] || !Array.isArray(cartItems[brandName])) {
      return MAX_QUANTITY_IN_CART
    }

    if (!chosenClassification?.id) {
      return MAX_QUANTITY_IN_CART
    }

    const foundItem = cartItems[brandName].find(
      (cartItem) => cartItem.productClassification?.id === chosenClassification.id,
    )

    return MAX_QUANTITY_IN_CART - (foundItem?.quantity ?? 0)
  }, [MAX_QUANTITY_IN_CART, cartItems, chosenClassification?.id, product?.brand?.name])

  const disabledAddToCartButton = useMemo(() => {
    const brandName = product?.brand?.name ?? ''
    if (!cartItems || !cartItems[brandName] || !Array.isArray(cartItems[brandName])) {
      return quantity > MAX_QUANTITY_IN_CART
    }

    if (!chosenClassification?.id) {
      return quantity > MAX_QUANTITY_IN_CART
    }

    const foundItem = cartItems[brandName].find(
      (cartItem) => cartItem.productClassification?.id === chosenClassification.id,
    )

    return (foundItem?.quantity ?? 0) + quantity > MAX_QUANTITY_IN_CART
  }, [MAX_QUANTITY_IN_CART, cartItems, chosenClassification?.id, product?.brand?.name, quantity])

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
    if (!user) {
      navigate(configs.routes.signIn)
      return
    }
    if (isProcessing) return
    setIsProcessing(true)
    setQuantity(quantity)
    setInputValue(quantity.toString())
    try {
      if (hasCustomType) {
        if (chosenClassification) {
          await createCartItemFn({
            groupBuying,
            classification: chosenClassification?.title,
            productClassification: chosenClassification?.id,
            quantity: quantity,
          })
        }
      } else {
        await createCartItemFn({
          groupBuying,
          classification: (product?.productClassifications ?? [])[0]?.title ?? 'default',
          productClassification: (product?.productClassifications ?? [])[0]?.id,
          quantity: quantity,
        })
      }
      queryClient.invalidateQueries({
        queryKey: [getMyCartApi.queryKey],
      })
    } catch (error) {
      handleServerError({ error })
    } finally {
      setIsProcessing(false)
    }
  }, [
    isProcessing,
    quantity,
    hasCustomType,
    chosenClassification,
    createCartItemFn,
    product?.productClassifications,
    handleServerError,
    groupBuying,
    queryClient,
    navigate,
    user,
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

      if (
        parsedValue > 0 &&
        parsedValue <= MAX_QUANTITY_IN_CART &&
        maxAcceptQuantity &&
        parsedValue <= maxAcceptQuantity &&
        maxAcceptQuantity > 1
      ) {
        setInputValue(value)
        setQuantity(parsedValue)
      } else if (parsedValue > maxAcceptQuantity && cartQuantity > 0) {
        errorToast({
          message: t('cart.invalidQuantityMessage', {
            count: chosenClassification?.quantity,
            itemQuantity: cartQuantity,
          }),
          isShowDescription: false,
        })
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

  const total = calculateTotalPrice(chosenClassification?.price ?? 0, quantity, discount, discountType)
  // const handleBlur = () => {
  //   const newQuantity = parseInt(inputValue, 10)
  //   setQuantity(newQuantity)
  // }
  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter') {
  //     const newQuantity = parseInt(inputValue, 10)
  //     setQuantity(newQuantity)
  //   }
  // }
  const handleBlur = () => {
    if (inputValue === '' || !/^\d+$/.test(inputValue)) {
      setInputValue('1')
      setQuantity(1)
      return
    }

    const newQuantity = parseInt(inputValue, 10)

    if (newQuantity <= 0 || isNaN(newQuantity)) {
      setInputValue('1')
      setQuantity(1)
    } else if (newQuantity > MAX_QUANTITY_IN_CART) {
      setInputValue(MAX_QUANTITY_IN_CART.toString())
      setQuantity(MAX_QUANTITY_IN_CART)
    } else if (newQuantity > maxAcceptQuantity) {
      setInputValue(maxAcceptQuantity.toString())
      setQuantity(maxAcceptQuantity)
    } else {
      setInputValue(newQuantity.toString())
      setQuantity(newQuantity)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (inputValue === '' || !/^\d+$/.test(inputValue)) {
        setInputValue('1')
        setQuantity(1)
        return
      }

      const newQuantity = parseInt(inputValue, 10)

      if (newQuantity <= 0 || isNaN(newQuantity)) {
        setInputValue('1')
        setQuantity(1)
      } else if (newQuantity > MAX_QUANTITY_IN_CART) {
        setInputValue(MAX_QUANTITY_IN_CART.toString())
        setQuantity(MAX_QUANTITY_IN_CART)
      } else if (newQuantity > maxAcceptQuantity) {
        setInputValue(maxAcceptQuantity.toString())
        setQuantity(maxAcceptQuantity)
      } else {
        setInputValue(newQuantity.toString())
        setQuantity(newQuantity)
      }
    }
  }

  const handleCheckout = () => {
    if (hasCustomType) {
      if (chosenClassification) {
        setSelectedCartItem(createCartFromProduct(product, quantity, chosenClassification))
        navigate(configs.routes.checkout)
      }
    } else {
      setSelectedCartItem(createCartFromProduct(product, quantity, (product?.productClassifications ?? [])[0]))
      navigate(configs.routes.checkout)
    }
  }

  const chosenPrice = chosenClassification ? chosenClassification?.price : 0
  const productDiscounts = isInGroupBuying ? [] : (product?.productDiscounts ?? [])
  const discountedPrice =
    productDiscounts?.length > 0 && productDiscounts[0]?.status === ProductDiscountEnum.ACTIVE
      ? calculateDiscountPrice(chosenPrice, productDiscounts?.[0]?.discount, DiscountTypeEnum.PERCENTAGE)
      : chosenClassification
        ? (chosenClassification?.price ?? 0)
        : 0

  return (
    <div className="flex flex-col gap-3">
      <div>
        {chosenClassification ? (
          <span className={`text-lg font-semibold`}>{t('productCard.currentPrice', { price: discountedPrice })}</span>
        ) : null}
      </div>

      {chosenClassification && hasCustomType ? (
        <div>
          <Button
            key={chosenClassification?.id}
            variant="outline"
            className={`w-fit h-fit justify-start px-2 py-2 text-sm`}
          >
            <div className="w-10 h-10 rounded-md">
              <ImageWithFallback
                fallback={fallBackImage}
                alt="option"
                src={chosenClassification?.images?.filter((img) => img.status === StatusEnum.ACTIVE)?.[0]?.fileUrl}
                className="w-full h-full object-contain rounded-md"
              />
            </div>
            {[
              chosenClassification?.color && `${chosenClassification.color}`,
              chosenClassification?.size && `${chosenClassification.size}`,
              chosenClassification?.other && `${chosenClassification.other}`,
            ]
              .filter(Boolean)
              .join(', ')}
          </Button>
        </div>
      ) : null}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">{t('productDetail.quantity')}</label>
          <IncreaseDecreaseButton
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
            isIncreaseDisabled={quantity >= MAX_QUANTITY_IN_CART || quantity >= maxAcceptQuantity}
            isDecreaseDisabled={quantity <= 1}
            inputValue={inputValue}
            handleInputChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            isProcessing={isProcessing}
            size="small"
          />
        </div>

        {product?.status === ProductEnum.BANNED ? (
          <span className="text-red-500 text-sm">{t('cart.brannedAllMessage')}</span>
        ) : product?.status === ProductEnum.UN_PUBLISHED ? (
          <span className="text-red-500 text-sm">{t('cart.unPublishAllMessage')}</span>
        ) : product?.status === ProductEnum.OUT_OF_STOCK && event !== OrderEnum.PRE_ORDER ? (
          <span className="text-red-500 text-sm">{t('cart.soldOutAllMessage')}</span>
        ) : !inStock &&
          !chosenClassification &&
          (product?.productClassifications ?? [])?.length === 0 &&
          event !== OrderEnum.PRE_ORDER &&
          event !== OrderEnum.FLASH_SALE ? (
          <span className="text-red-500 text-sm">{t('cart.soldOutAllMessage')}</span>
        ) : !chosenClassification && hasCustomType ? (
          <span className="text-yellow-500 text-sm">{t('cart.chooseClassification')}</span>
        ) : chosenClassification && chosenClassification?.quantity <= 0 ? (
          <span className="text-red-500 text-sm">{t('cart.soldOutMessage')}</span>
        ) : chosenClassification && chosenClassification?.status !== StatusEnum.ACTIVE ? (
          <span className="text-gray-500 text-sm">{t('cart.hiddenMessage')}</span>
        ) : disabledAddToCartButton ? (
          <span className="text-red-500 text-sm">
            {t('cart.invalidQuantityMessage', { count: chosenClassification?.quantity, itemQuantity: cartQuantity })}
          </span>
        ) : null}

        {chosenClassification ? (
          <div>
            <div className="text-sm font-medium mb-1">{t('productDetail.total')}</div>
            <div className="text-2xl font-bold text-red-500">{t('productCard.price', { price: total })}</div>
          </div>
        ) : null}

        <div className="space-y-2">
          {!isInGroupBuying && (
            <Button
              disabled={
                (!(product.status === ProductEnum.OFFICIAL || product.status === ProductEnum.FLASH_SALE) &&
                  event !== OrderEnum.PRE_ORDER) ||
                (!inStock && event !== OrderEnum.PRE_ORDER) ||
                (!chosenClassification && hasCustomType) ||
                (chosenClassification &&
                  (chosenClassification?.quantity <= 0 || chosenClassification?.status !== StatusEnum.ACTIVE))
                  ? true
                  : false
              }
              className="w-full bg-primary hover:bg-primary/80 text-white"
              onClick={() => handleCheckout()}
            >
              {t('productDetail.buyNow')}
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full border-primary text-primary hover:text-primary hover:bg-primary/10"
            onClick={() => handleCreateCartItem()}
            disabled={
              (!(product.status === ProductEnum.OFFICIAL || product.status === ProductEnum.FLASH_SALE) &&
                event !== OrderEnum.PRE_ORDER) ||
              (!inStock && event !== OrderEnum.PRE_ORDER) ||
              disabledAddToCartButton ||
              (!chosenClassification && hasCustomType) ||
              (chosenClassification &&
                (chosenClassification?.quantity <= 0 || chosenClassification?.status !== StatusEnum.ACTIVE))
                ? true
                : false
            }
          >
            {t('productDetail.addToCart')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailAction
