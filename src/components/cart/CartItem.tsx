import { MessageCircle, Store, Tag } from 'lucide-react'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import { IBrand } from '@/types/brand'
import { ICartItem } from '@/types/cart'
import { IClassification } from '@/types/classification'
import { ClassificationTypeEnum, DiscountTypeEnum, OrderEnum, ProductDiscountEnum, StatusEnum } from '@/types/enum'
import { PreOrderProductEnum } from '@/types/pre-order'
import { IBrandBestVoucher, ICheckoutItem, TVoucher } from '@/types/voucher'
import { calculateBrandVoucherDiscount } from '@/utils/price'

import ProductCardLandscape from '../product/ProductCardLandscape'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import VoucherCartList from '../voucher/VoucherCartList'

interface CartItemProps {
  brandName: string
  cartBrandItem: ICartItem[]
  selectedCartItems: string[]
  onSelectBrand: (productIds: string[], isSelected: boolean) => void
  bestVoucherForBrand: IBrandBestVoucher
  onVoucherSelect: (brandId: string, voucher: TVoucher | null) => void
  brand?: IBrand
  checkoutItems: ICheckoutItem[]
  selectedCheckoutItems: ICheckoutItem[]
  isTriggerTotal: boolean
  setIsTriggerTotal: Dispatch<SetStateAction<boolean>>
  isInGroupBuying?: boolean
}
const CartItem = ({
  isInGroupBuying = false,
  brandName,
  cartBrandItem,
  selectedCartItems,
  onSelectBrand,
  bestVoucherForBrand,
  onVoucherSelect,
  brand,
  checkoutItems,
  selectedCheckoutItems,
  setIsTriggerTotal,
  isTriggerTotal,
}: CartItemProps) => {
  const { t } = useTranslation()
  const [chosenVoucher, setChosenVoucher] = useState<TVoucher | null>(null)

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
  const handleVoucherChange = (voucher: TVoucher | null) => {
    setChosenVoucher(voucher)
    onVoucherSelect(brand?.id ?? '', voucher)
  }
  const voucherDiscount = useMemo(
    () => calculateBrandVoucherDiscount(cartBrandItem, selectedCartItems, chosenVoucher),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cartBrandItem, selectedCartItems, chosenVoucher, isTriggerTotal],
  )
  useEffect(() => {
    if (selectedCartItems.length === 0) {
      setChosenVoucher(null)
    }
  }, [selectedCartItems])

  return (
    <div className="w-full bg-white p-4 rounded-lg space-y-2 shadow-sm">
      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-4">
        {/* group product of brand checkbox */}
        <Checkbox id={brand?.id} checked={isBrandSelected} onClick={handleBrandSelect} />
        <Store className="w-5 h-5 text-red-500" />
        <Link to={configs.routes.brands + `/${brand?.id}`}>
          <span className="font-medium">{brandName}</span>
        </Link>
        <Button className="p-2 bg-primary hover:bg-primary/80" variant="default">
          <MessageCircle className="w-4 h-4" />
          {t('brand.chatNow')}
        </Button>
      </div>

      {/* Product Cards */}
      {cartBrandItem?.map((cartItem: ICartItem) => {
        const product =
          cartItem?.productClassification?.preOrderProduct?.product ??
          cartItem?.productClassification?.productDiscount?.product ??
          cartItem?.productClassification?.product

        const productClassification = cartItem?.productClassification ?? null
        const allProductClassifications: IClassification[] =
          (product?.productDiscounts ?? [])[0]?.productClassifications ??
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

        const eventType = isInGroupBuying
          ? ''
          : cartItem?.productClassification?.preOrderProduct &&
              cartItem?.productClassification?.preOrderProduct?.status === PreOrderProductEnum.ACTIVE
            ? OrderEnum.PRE_ORDER
            : (cartItem?.productClassification?.productDiscount &&
                  cartItem?.productClassification?.productDiscount?.status === ProductDiscountEnum.ACTIVE) ||
                ((product?.productDiscounts ?? [])[0]?.status === ProductDiscountEnum.ACTIVE &&
                  (product?.productDiscounts ?? [])[0]?.discount)
              ? OrderEnum.FLASH_SALE
              : ''
        const discount = isInGroupBuying
          ? null
          : eventType === OrderEnum.FLASH_SALE
            ? cartItem?.productClassification?.productDiscount?.discount
            : ((product?.productDiscounts ?? [])[0]?.discount ?? null)

        const discountType = isInGroupBuying
          ? null
          : eventType === OrderEnum.FLASH_SALE || (product?.productDiscounts ?? [])[0]?.discount
            ? DiscountTypeEnum.PERCENTAGE
            : null

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
            triggerText={t('cart.viewMoreVoucher')}
            brandName={brand?.name ?? ''}
            brandId={brand?.id ?? ''}
            brandLogo={brand?.logo ?? ''}
            hasBrandProductSelected={hasBrandProductSelected}
            handleVoucherChange={handleVoucherChange}
            checkoutItems={checkoutItems}
            selectedCheckoutItems={selectedCheckoutItems}
            bestVoucherForBrand={bestVoucherForBrand}
            chosenBrandVoucher={chosenVoucher}
          />
        </div>
      )}
    </div>
  )
}

export default CartItem
