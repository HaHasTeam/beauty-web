'use client'

import { MessageCircle, Tag } from 'lucide-react'
import { type Dispatch, type SetStateAction, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import useCartStore from '@/store/cart'
import type { IBrand } from '@/types/brand'
import type { ICartItem } from '@/types/cart'
import type { IClassification } from '@/types/classification'
import { ClassificationTypeEnum, DiscountTypeEnum, OrderEnum, ProductDiscountEnum, StatusEnum } from '@/types/enum'
import { PreOrderProductEnum } from '@/types/pre-order'
import type { IBrandBestVoucher, ICheckoutItem, TVoucher } from '@/types/voucher'
import { calculateBrandVoucherDiscount } from '@/utils/price'

import ProductCardLandscape from '../product/ProductCardLandscape'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import VoucherCartList from '../voucher/VoucherCartList'

interface CartItemProps {
  brandName: string
  cartBrandItem: ICartItem[]
  selectedCartItems: string[]
  onSelectBrand: (productIds: string[], isSelected: boolean) => void
  bestVoucherForBrand: IBrandBestVoucher
  brand?: IBrand
  checkoutItems: ICheckoutItem[]
  selectedCheckoutItems: ICheckoutItem[]
  isTriggerTotal: boolean
  setIsTriggerTotal: Dispatch<SetStateAction<boolean>>
  isInGroupBuying?: boolean
  onVoucherSelect: (brandId: string, voucher: TVoucher | null) => void
}
const CartItem = ({
  isInGroupBuying = false,
  brandName,
  cartBrandItem,
  selectedCartItems,
  onSelectBrand,
  bestVoucherForBrand,
  brand,
  checkoutItems,
  selectedCheckoutItems,
  setIsTriggerTotal,
  isTriggerTotal,
  onVoucherSelect,
}: CartItemProps) => {
  const { t } = useTranslation()
  const { chosenBrandVouchers, setChosenBrandVouchers } = useCartStore()
  const chosenVoucher = (brand && chosenBrandVouchers[brand.id]) || null

  const cartItemIds = cartBrandItem?.map((cartItem) => cartItem.id)
  const isBrandSelected = cartBrandItem.every((productClassification) =>
    selectedCartItems?.includes(productClassification.id),
  )
  const hasBrandProductSelected = cartBrandItem.some((productClassification) =>
    selectedCartItems?.includes(productClassification.id),
  )

  // Handler for brand-level checkbox
  const handleBrandSelect = () => {
    onSelectBrand(cartItemIds, !isBrandSelected)
  }

  // Handler for individual product selection
  const handleSelectCartItem = (cartItemId: string, isSelected: boolean) => {
    onSelectBrand([cartItemId], isSelected)
  }
  const voucherDiscount = useMemo(
    () => calculateBrandVoucherDiscount(cartBrandItem, selectedCartItems, chosenVoucher),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cartBrandItem, selectedCartItems, chosenVoucher, isTriggerTotal],
  )

  const handleVoucherChange = (voucher: TVoucher | null) => {
    const newVouchers = { ...chosenBrandVouchers }
    if (brand) {
      newVouchers[brand.id] = voucher
      setChosenBrandVouchers({ ...chosenBrandVouchers, [brand.id]: voucher })
      onVoucherSelect(brand.id, voucher)
    }
  }
  useEffect(() => {
    if (selectedCartItems.length === 0 || voucherDiscount === 0) {
      const newVouchers = { ...chosenBrandVouchers }
      if (brand) {
        newVouchers[brand.id] = null
        setChosenBrandVouchers(newVouchers)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCartItems, voucherDiscount])
  return (
    <div className="w-full bg-white p-4 rounded-lg space-y-2 shadow-sm">
      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-4">
        {/* group product of brand checkbox */}
        <Checkbox id={brand?.id} checked={isBrandSelected} onClick={handleBrandSelect} />
        {/* <Store className="w-5 h-5 text-red-500" /> */}
        <Avatar className="w-10 h-10">
          <AvatarImage src={brand?.logo} alt={brand?.name} />
          <AvatarFallback>{brand?.name?.charAt(0).toUpperCase() ?? 'A'}</AvatarFallback>
        </Avatar>
        <Link to={configs.routes.brands + `/${brand?.id}`}>
          <span className="font-medium">{brandName}</span>
        </Link>
        <Button className="p-2 bg-primary hover:bg-primary/80" variant="default">
          <MessageCircle className="w-4 h-4" />
          {t('brand.chatNow')}
        </Button>

        {/* Display livestream indicator if any items in this brand are from a livestream */}
      </div>

      {/* Product Cards */}
      {cartBrandItem?.map((cartItem: ICartItem) => {
        const product =
          cartItem?.productClassification?.preOrderProduct?.product ??
          cartItem?.productClassification?.productDiscount?.product ??
          cartItem?.productClassification?.product

        const productClassification = cartItem?.productClassification ?? null
        const allProductClassifications: IClassification[] =
          productClassification?.preOrderProduct?.productClassifications ??
          productClassification?.productDiscount?.productClassifications ??
          productClassification?.product?.productClassifications ??
          []
        const productClassificationQuantity = cartItem?.productClassification?.quantity ?? 0
        // const productImage = cartItem?.productClassification?.images?.[0]?.fileUrl ?? ''
        const productImage =
          (cartItem?.productClassification?.type === ClassificationTypeEnum.DEFAULT
            ? product?.images?.filter((img) => img?.status === StatusEnum.ACTIVE)[0]?.fileUrl
            : cartItem?.productClassification?.images?.filter((img) => img?.status === StatusEnum.ACTIVE)[0]
                ?.fileUrl) ?? ''
        const productName = product?.name ?? ''
        const productId = product?.id ?? ''
        const productPrice = cartItem?.productClassification?.price ?? 0
        const productQuantity = cartItem?.quantity ?? 0
        // const selectedClassification = cartItem?.classification ?? ''

        // Check if this item is from a livestream
        const isLivestreamItem = cartItem.livestream || (cartItem.livestreamDiscount && cartItem.livestreamDiscount > 0)

        // Determine event type, adding LIVESTREAM as a new option
        let eventType = ''
        if (isInGroupBuying) {
          eventType = ''
        } else if (isLivestreamItem) {
          eventType = OrderEnum.LIVE_STREAM
        } else if (
          cartItem?.productClassification?.preOrderProduct &&
          cartItem?.productClassification?.preOrderProduct?.status === PreOrderProductEnum.ACTIVE
        ) {
          eventType = OrderEnum.PRE_ORDER
        } else if (
          cartItem?.productClassification?.productDiscount &&
          cartItem?.productClassification?.productDiscount?.status === ProductDiscountEnum.ACTIVE
        ) {
          eventType = OrderEnum.FLASH_SALE
        }

        const discount = isInGroupBuying
          ? null
          : eventType === OrderEnum.FLASH_SALE
            ? cartItem?.productClassification?.productDiscount?.discount
            : eventType == 'LIVESTREAM'
              ? cartItem.livestreamDiscount
              : null

        const discountType = isInGroupBuying
          ? null
          : eventType === OrderEnum.FLASH_SALE
            ? DiscountTypeEnum.PERCENTAGE
            : isLivestreamItem
              ? DiscountTypeEnum.PERCENTAGE
              : null
        const productStatus = product.status

        return (
          <ProductCardLandscape
            key={cartItem?.id}
            cartItem={cartItem}
            productImage={productImage}
            productId={productId}
            productName={productName}
            classifications={allProductClassifications}
            productClassification={productClassification}
            discount={discount}
            discountType={discountType}
            price={productPrice}
            cartItemId={cartItem?.id}
            eventType={eventType}
            isSelected={selectedCartItems?.includes(cartItem?.id)}
            onChooseProduct={() => handleSelectCartItem(cartItem?.id, !selectedCartItems?.includes(cartItem?.id))}
            productQuantity={productQuantity}
            productClassificationQuantity={productClassificationQuantity}
            setIsTriggerTotal={setIsTriggerTotal}
            productStatus={productStatus}
          />
        )
      })}

      {/* Voucher */}
      {!isInGroupBuying && (
        <div className="flex items-center gap-3 text-sm">
          <Tag className="w-4 h-4 text-red-500" />
          <span>
            {chosenVoucher && hasBrandProductSelected
              ? chosenVoucher?.discountType === DiscountTypeEnum.AMOUNT
                ? t('voucher.discountAmount', { amount: voucherDiscount })
                : t('voucher.discountAmount', { amount: voucherDiscount })
              : bestVoucherForBrand?.bestVoucher
                ? bestVoucherForBrand?.bestVoucher?.discountType === DiscountTypeEnum.AMOUNT &&
                  bestVoucherForBrand?.bestVoucher?.discountValue
                  ? t('voucher.bestDiscountAmountDisplay', { amount: bestVoucherForBrand?.bestVoucher?.discountValue })
                  : t('voucher.bestDiscountPercentageDisplay', {
                      percentage: bestVoucherForBrand?.bestVoucher?.discountValue * 100,
                    })
                : null}
          </span>
          <VoucherCartList
            triggerText={chosenVoucher ? t('cart.viewMoreVoucher') : t('voucher.chooseVoucher')}
            brandName={brand?.name ?? ''}
            brandId={brand?.id ?? ''}
            brandLogo={brand?.logo ?? ''}
            hasBrandProductSelected={hasBrandProductSelected}
            handleVoucherChange={handleVoucherChange}
            checkoutItems={checkoutItems}
            selectedCheckoutItems={selectedCheckoutItems}
            bestVoucherForBrand={bestVoucherForBrand}
            chosenBrandVoucher={chosenVoucher}
            voucherDiscount={voucherDiscount}
          />
        </div>
      )}
    </div>
  )
}

export default CartItem
