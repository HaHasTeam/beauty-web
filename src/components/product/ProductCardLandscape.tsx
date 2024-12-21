import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { deleteCartItemApi, getCartByIdApi, getMyCartApi, updateCartItemApi } from '@/network/apis/cart'
import { ICartItem } from '@/types/cart'
import { IClassification } from '@/types/classification'

import ClassificationPopover from '../classification/ClassificationPopover'
import DeleteConfirmationDialog from '../dialog/DeleteConfirmationDialog'
import IncreaseDecreaseButton from '../IncreaseDecreaseButton'
import LoadingIcon from '../loading-icon'
import { Checkbox } from '../ui/checkbox'
import ProductTag from './ProductTag'

interface ProductCardLandscapeProps {
  cartItem: ICartItem
  productImage: string
  cartItemId: string
  productName: string
  classifications: IClassification[]
  eventType: string
  selectedClassification: string
  currentPrice: number
  price: number
  productQuantity: number
  isSelected: boolean
  onChooseProduct: (cartItemId: string) => void
}
const ProductCardLandscape = ({
  cartItem,
  productImage,
  cartItemId,
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
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const queryClient = useQueryClient()
  const [isProcessing, setIsProcessing] = useState(false)

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
      queryClient.invalidateQueries({
        queryKey: [getMyCartApi.queryKey],
      })
      queryClient.invalidateQueries({
        queryKey: [getCartByIdApi.queryKey, cartItemId as string],
      })
    },
  })

  const handleQuantityUpdate = useCallback(
    async (newQuantity: number) => {
      if (isProcessing) return
      setIsProcessing(true)

      try {
        await updateCartItemFn({ id: cartItem?.id ?? '', quantity: newQuantity })
        setQuantity(newQuantity)
        setInputValue(newQuantity.toString())
      } catch (error) {
        handleServerError({ error })
      } finally {
        setIsProcessing(false)
      }
    },
    [isProcessing, updateCartItemFn, cartItem?.id, handleServerError],
  )

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
      setInputValue(`${quantity - 1}`)
      setQuantity(quantity - 1)
      handleQuantityUpdate(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < 1000) {
      setInputValue(`${quantity + 1}`)
      setQuantity(quantity + 1)
      handleQuantityUpdate(quantity + 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow clearing the input
    if (value === '') {
      setInputValue('')
      // setQuantity(1)
      return
    }

    // Allow only valid positive integers
    if (/^\d+$/.test(value)) {
      const parsedValue = parseInt(value, 10)

      if (parsedValue > 0 && parsedValue <= 1000) {
        setInputValue(value)
        setQuantity(parsedValue)
      }
    }
  }

  const handleBlur = () => {
    handleQuantityUpdate(quantity)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleQuantityUpdate(quantity)
    }
  }

  const totalPrice = currentPrice && currentPrice > 0 ? currentPrice * quantity : price * quantity
  return (
    <div className="w-full py-4 border-b border-gray-200">
      <div className="w-full flex gap-2 items-center">
        <div className="flex gap-1 items-center lg:w-[10%] md:w-[10%] w-[14%]">
          <Checkbox id={cartItemId} checked={isSelected} onClick={() => onChooseProduct(cartItemId)} />
          <Link to={configs.routes.products + '/' + cartItemId}>
            <div className="lg:w-20 lg:h-20 md:w-14 md:h-14 h-8 w-8">
              <img src={productImage} alt={productName} className="object-cover w-full h-full" />
            </div>
          </Link>
        </div>

        <div className="flex md:flex-row flex-col lg:w-[65%] md:w-[65%] sm:w-[34%] w-[34%] gap-2">
          <div className="order-1 flex gap-1 items-center lg:w-[50%] md:w-[35%] w-full">
            <div className="flex flex-col gap-1">
              <Link to={configs.routes.products + '/' + cartItemId}>
                <h3 className="font-semibold lg:text-sm text-xs line-clamp-2">{productName}</h3>
              </Link>
              <div>{eventType && eventType !== '' && <ProductTag tag={eventType} size="small" />}</div>
            </div>
          </div>
          <div className="order-3 md:order-2 flex items-center gap-2 lg:w-[30%] md:w-[40%] w-full">
            <ClassificationPopover classifications={classifications} />
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
          {isProcessing ? (
            <LoadingIcon />
          ) : (
            <IncreaseDecreaseButton
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              isIncreaseDisabled={quantity >= 1000}
              isDecreaseDisabled={false}
              inputValue={inputValue}
              handleInputChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              size="small"
            />
          )}
        </div>
        <span className="text-red-500 lg:text-lg md:text-sm sm:text-xs text-xs font-medium w-[16%] md:w-[8%] sm:w-[12%] ">
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
      />
    </div>
  )
}

export default ProductCardLandscape
