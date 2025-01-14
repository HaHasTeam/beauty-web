import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { deleteCartItemApi, getCartByIdApi, getMyCartApi, updateCartItemApi } from '@/network/apis/cart'
import useCartStore from '@/store/cart'
import { ICartByBrand, ICartItem } from '@/types/cart'
import { IClassification } from '@/types/classification'
import { ClassificationTypeEnum, DiscountTypeEnum, ProductCartStatusEnum } from '@/types/enum'
import { DiscountType } from '@/types/product-discount'
import { calculateDiscountPrice, calculateTotalPrice } from '@/utils/price'
import {
  checkCurrentProductClassificationActive,
  checkCurrentProductClassificationHide,
  hasActiveClassification,
  hasClassificationWithQuantity,
} from '@/utils/product'

import AlertMessage from '../alert/AlertMessage'
import ClassificationPopover from '../classification/ClassificationPopover'
import DeleteConfirmationDialog from '../dialog/DeleteConfirmationDialog'
import IncreaseDecreaseButton from '../IncreaseDecreaseButton'
import { Checkbox } from '../ui/checkbox'
import ProductTag from './ProductTag'

interface ProductCardLandscapeProps {
  cartItem: ICartItem
  productImage: string
  cartItemId: string
  productId: string
  productName: string
  classifications: IClassification[]
  productClassification: IClassification | null
  eventType: string
  discountType?: DiscountType | null
  discount?: number | null
  price: number
  productQuantity: number
  productClassificationQuantity: number
  isSelected: boolean
  onChooseProduct: (cartItemId: string) => void
  setIsTriggerTotal: Dispatch<SetStateAction<boolean>>
}
const ProductCardLandscape = ({
  cartItem,
  productImage,
  cartItemId,
  productId,
  productName,
  classifications,
  discount,
  discountType,
  eventType,
  price,
  isSelected,
  onChooseProduct,
  productQuantity,
  productClassification,
  productClassificationQuantity,
  setIsTriggerTotal,
}: ProductCardLandscapeProps) => {
  const { t } = useTranslation()
  const [quantity, setQuantity] = useState(productQuantity)
  const [inputValue, setInputValue] = useState(productQuantity.toString() ?? '')
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { successToast, errorToast } = useToast()
  const { cartItems, setCartItems, selectedCartItem, setSelectedCartItem } = useCartStore()
  const handleServerError = useHandleServerError()
  const queryClient = useQueryClient()
  const PRODUCT_STOCK_COUNT = productClassification?.quantity ?? 0
  const MAX_QUANTITY_IN_CART = productClassificationQuantity
  const OUT_OF_STOCK = PRODUCT_STOCK_COUNT <= 0
  const HIDDEN = checkCurrentProductClassificationHide(productClassification, classifications)
  const IS_ACTIVE = checkCurrentProductClassificationActive(productClassification, classifications)

  // console.log(
  //   'info',
  //   classifications,
  //   productClassification,
  //   productClassificationQuantity,
  //   'hidden' + HIDDEN,
  //   'active' + IS_ACTIVE,
  //   'sold out' + OUT_OF_STOCK,
  //   MAX_QUANTITY_IN_CART,
  //   PRODUCT_STOCK_COUNT,
  // )

  const { mutateAsync: deleteCartItemFn } = useMutation({
    mutationKey: [deleteCartItemApi.mutationKey, cartItemId as string],
    mutationFn: deleteCartItemApi.fn,
    onSuccess: () => {
      successToast({
        message: t('delete.productCart.success'),
      })
      queryClient.invalidateQueries({
        queryKey: [getMyCartApi.queryKey],
      })
      queryClient.invalidateQueries({
        queryKey: [getCartByIdApi.queryKey, cartItemId as string],
      })
    },
  })

  const { mutateAsync: updateCartItemFn } = useMutation({
    mutationKey: [updateCartItemApi.mutationKey],
    mutationFn: updateCartItemApi.fn,
    onSuccess: () => {
      // queryClient.invalidateQueries({
      //   queryKey: [getMyCartApi.queryKey],
      // })
      // queryClient.invalidateQueries({
      //   queryKey: [getCartByIdApi.queryKey, cartItemId as string],
      // })
      // console.log(productQuantity, quantity, inputValue)

      setIsTriggerTotal((prev) => !prev)
    },
  })

  const handleQuantityUpdate = useCallback(
    async (newQuantity: number) => {
      if (isProcessing) return
      setIsProcessing(true)
      setQuantity(newQuantity)
      setInputValue(newQuantity.toString())
      try {
        await updateCartItemFn({ id: cartItem?.id ?? '', quantity: newQuantity })
        // Update Zustand store
        const updatedCartItems: ICartByBrand = { ...selectedCartItem }

        for (const brandId in updatedCartItems) {
          if (updatedCartItems[brandId]) {
            updatedCartItems[brandId] = updatedCartItems[brandId].map((item) => {
              if (item.id === cartItem?.id) {
                return { ...item, quantity: newQuantity }
              }
              return item
            })
          }
        }

        const newCartItems: ICartByBrand = { ...cartItems }
        for (const brandId in newCartItems) {
          if (newCartItems[brandId]) {
            newCartItems[brandId] = newCartItems[brandId].map((item) => {
              if (item.id === cartItem?.id) {
                return { ...item, quantity: newQuantity }
              }
              return item
            })
          }
        }
        setSelectedCartItem(updatedCartItems)
        setCartItems(newCartItems)
      } catch (error) {
        handleServerError({ error })
      } finally {
        setIsProcessing(false)
      }
    },
    [
      isProcessing,
      updateCartItemFn,
      cartItem?.id,
      selectedCartItem,
      cartItems,
      setSelectedCartItem,
      setCartItems,
      handleServerError,
    ],
  )
  console.log(selectedCartItem)
  const handleDeleteCartItem = async () => {
    try {
      await deleteCartItemFn(cartItemId)
    } catch (error) {
      handleServerError({ error })
    }
  }

  const decreaseQuantity = () => {
    if (quantity === 1) {
      setOpenConfirmDelete(true)
    }
    if (quantity > 1) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      setInputValue(newQuantity.toString())
      handleQuantityUpdate(newQuantity)
    }
  }

  const increaseQuantity = () => {
    if (quantity < MAX_QUANTITY_IN_CART) {
      const newQuantity = quantity + 1
      setQuantity(newQuantity)
      setInputValue(newQuantity.toString())
      handleQuantityUpdate(newQuantity)
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

  const handleBlur = () => {
    const newQuantity = parseInt(inputValue, 10) || productQuantity
    setQuantity(newQuantity)
    handleQuantityUpdate(newQuantity)
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newQuantity = parseInt(inputValue, 10) || productQuantity
      setQuantity(newQuantity)
      handleQuantityUpdate(newQuantity)
    }
  }

  const totalPrice = calculateTotalPrice(price, quantity, discount, discountType)
  const discountPrice = calculateDiscountPrice(price, discount, discountType)
  const HAS_ACTIVE_CLASSIFICATION = hasActiveClassification(classifications)
  const IN_STOCK_CLASSIFICATION = hasClassificationWithQuantity(classifications)
  const PREVENT_ACTION = !HAS_ACTIVE_CLASSIFICATION || !IN_STOCK_CLASSIFICATION

  // useEffect(() => {
  //   setQuantity(productQuantity ?? 1)
  //   setInputValue(productQuantity.toString() ?? '1')
  // }, [productQuantity])
  return (
    <div className={`w-full py-4 border-b border-gray-200`}>
      <div className={`w-full flex gap-2 items-center`}>
        <div className={`ư-fit flex gap-1 items-center  ${PREVENT_ACTION ? 'opacity-40' : ''}`}>
          {IS_ACTIVE ? (
            <Checkbox id={cartItemId} checked={isSelected} onClick={() => onChooseProduct(cartItemId)} />
          ) : HIDDEN ? (
            <ProductTag tag={ProductCartStatusEnum.HIDDEN} />
          ) : OUT_OF_STOCK ? (
            <ProductTag tag={ProductCartStatusEnum.SOLD_OUT} />
          ) : null}

          <Link to={configs.routes.products + '/' + productId}>
            <div className="lg:w-20 lg:h-20 md:w-14 md:h-14 h-8 w-8">
              <img src={productImage} alt={productName} className="object-cover w-full h-full" />
            </div>
          </Link>
        </div>

        <div
          className={`flex md:flex-row flex-col lg:w-[65%] md:w-[65%] sm:w-[34%] w-[34%] gap-2 px-2 ${PREVENT_ACTION ? 'opacity-40' : ''}`}
        >
          <div className="order-1 flex gap-1 items-center lg:w-[50%] md:w-[35%] w-full">
            <div className="ml-1 flex flex-col gap-1">
              <Link to={configs.routes.products + '/' + productId}>
                <span className="lg:text-sm text-xs line-clamp-2">{productName}</span>
              </Link>
              <div>{eventType && eventType !== '' && <ProductTag tag={eventType} size="small" />}</div>
              {HIDDEN ? (
                <AlertMessage
                  className="w-fit border-0 outline-none rounded-md p-1 px-2 bg-gray-200"
                  textSize="small"
                  color="black"
                  message={t('cart.hiddenMessage')}
                />
              ) : !IN_STOCK_CLASSIFICATION ? (
                <div>
                  <AlertMessage
                    className="w-fit border-0 outline-none rounded-md p-1 px-2 bg-red-50"
                    textSize="small"
                    color="danger"
                    text="danger"
                    message={t('cart.soldOutAllMessage')}
                  />
                </div>
              ) : OUT_OF_STOCK ? (
                <div>
                  <AlertMessage
                    className="w-fit border-0 outline-none rounded-md p-1 px-2 bg-red-50"
                    textSize="small"
                    color="danger"
                    text="danger"
                    message={t('cart.soldOutMessage')}
                  />
                </div>
              ) : null}
            </div>
          </div>
          <div className="order-3 md:order-2 flex items-center gap-2 lg:w-[30%] md:w-[40%] w-full">
            {productClassification?.type === ClassificationTypeEnum?.CUSTOM && (
              <ClassificationPopover
                classifications={classifications}
                productClassification={productClassification}
                cartItemId={cartItemId}
                cartItemQuantity={quantity}
                preventAction={PREVENT_ACTION}
              />
            )}
          </div>
          {discount &&
          discount > 0 &&
          (discountType === DiscountTypeEnum.AMOUNT || discountType === DiscountTypeEnum.PERCENTAGE) ? (
            <div className="order-2 md:order-3 w-full md:w-[25%] lg:w-[20%] flex-col">
              <div className="flex gap-1 items-center">
                <span className="text-red-500 lg:text-base md:text-sm sm:text-xs text-xs">
                  {t('productCard.currentPrice', { price: discountPrice })}
                </span>
                <span className="text-gray-400 lg:text-sm text-xs line-through">
                  {t('productCard.price', { price: price })}
                </span>
              </div>
              <div>
                <span className="text-red-500 lg:text-sm md:text-xs sm:text-xs text-xs">
                  {t('voucher.off.numberPercentage', { percentage: discount * 100 })}
                </span>
              </div>
            </div>
          ) : (
            <div className="order-2 md:order-3 w-full md:w-[25%] lg:w-[20%] flex gap-1 items-center">
              <span className="lg:text-base md:text-sm sm:text-xs text-xs">
                {t('productCard.price', { price: price })}
              </span>
            </div>
          )}
        </div>

        <div className={`w-[26%] md:w-[12%] sm:w-[20%] ${PREVENT_ACTION ? 'opacity-40' : ''}`}>
          {IS_ACTIVE && (
            <IncreaseDecreaseButton
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              isIncreaseDisabled={quantity >= MAX_QUANTITY_IN_CART}
              isDecreaseDisabled={false}
              inputValue={inputValue}
              handleInputChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              isProcessing={isProcessing}
              size="small"
            />
          )}

          {(PRODUCT_STOCK_COUNT < quantity || PRODUCT_STOCK_COUNT <= 0) && (
            <span className={`text-sm ${PRODUCT_STOCK_COUNT <= 0 ? 'text-red-500' : 'text-orange-500'}`}>
              {t('cart.productLeft', { count: PRODUCT_STOCK_COUNT })}
            </span>
          )}
        </div>
        <span
          className={`text-red-500 lg:text-base md:text-sm sm:text-xs text-xs w-[16%] md:w-[8%] sm:w-[12%] ${PREVENT_ACTION ? 'opacity-40' : ''}`}
        >
          {t('productCard.currentPrice', { price: totalPrice })}
        </span>

        <div className="w-[7%] sm:w-[5%]">
          <Trash2
            onClick={() => {
              setOpenConfirmDelete(true)
            }}
            className="text-red-500 hover:cursor-pointer hover:text-red-700"
          />
        </div>
      </div>
      <DeleteConfirmationDialog
        open={openConfirmDelete}
        onOpenChange={setOpenConfirmDelete}
        onConfirm={() => {
          // Handle delete confirmation
          handleDeleteCartItem()
          setOpenConfirmDelete(false)
        }}
        item="productCart"
      />
    </div>
  )
}

export default ProductCardLandscape
