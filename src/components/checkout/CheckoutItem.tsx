import { MessageCircle, Store, Tag } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import { IBrand } from '@/types/brand'
import { ICartItem } from '@/types/cart'
import { DiscountTypeEnum, OrderEnum } from '@/types/enum'
import { IBrandBestVoucher, ICheckoutItem, TVoucher } from '@/types/voucher'
import { getTotalBrandProductsPrice } from '@/utils/price'

import ProductCheckoutLandscape from '../product/ProductCheckoutLandscape'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import VoucherCartList from '../voucher/VoucherCartList'

interface CheckoutItemProps {
  brandName: string
  cartBrandItem: ICartItem[]
  onVoucherSelect: (brandId: string, voucher: TVoucher | null) => void
  chosenBrandVoucher: TVoucher | null
  bestVoucherForBrand: IBrandBestVoucher
  brand?: IBrand
}
const CheckoutItem = ({
  brandName,
  cartBrandItem,
  onVoucherSelect,
  bestVoucherForBrand,
  chosenBrandVoucher,
  brand,
}: CheckoutItemProps) => {
  const { t } = useTranslation()

  const totalBrandPrice = useMemo(() => {
    return getTotalBrandProductsPrice(cartBrandItem)
  }, [cartBrandItem])
  const checkoutItems: ICheckoutItem[] = cartBrandItem
    ?.map((cartItem) => ({
      classificationId: cartItem.productClassification?.id ?? '',
      quantity: cartItem.quantity ?? 0,
    }))
    ?.filter((item) => item.classificationId !== null)
  const handleVoucherChange = (voucher: TVoucher | null) => {
    onVoucherSelect(brand?.id ?? '', voucher)
  }

  return (
    <div className="w-full bg-white sm:p-4 p-2 rounded-lg space-y-2 shadow-sm">
      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-4">
        {/* group product of brand checkbox */}
        <Store className="w-5 h-5 text-red-500" />
        <Link to={configs.routes.brands + `/${brand?.id ?? ''}`}>
          <span className="font-medium">{brandName}</span>
        </Link>
        <Button className="p-2 bg-primary hover:bg-primary/80" variant="default">
          <MessageCircle className="w-4 h-4" />
          {t('brand.chatNow')}
        </Button>
      </div>

      {/* Product Cards */}
      {cartBrandItem?.map((cartItem) => {
        const product =
          cartItem?.productClassification?.preOrderProduct?.product ??
          cartItem?.productClassification?.productDiscount?.product ??
          cartItem?.productClassification?.product
        const productClassification = cartItem?.productClassification ?? null
        const productImage = cartItem?.productClassification?.images?.[0]?.fileUrl ?? ''
        const productName = product?.name ?? ''
        const productId = product?.id ?? ''
        const selectedClassification = cartItem?.classification ?? ''
        const productPrice = cartItem?.productClassification?.price ?? 0
        const productQuantity = cartItem?.quantity ?? 0
        const eventType = cartItem?.productClassification?.preOrderProduct
          ? OrderEnum.PRE_ORDER
          : cartItem?.productClassification?.productDiscount || (product?.productDiscounts ?? [])[0]?.discount
            ? OrderEnum.FLASH_SALE
            : ''
        const discount =
          eventType === OrderEnum.FLASH_SALE
            ? cartItem?.productClassification?.productDiscount?.discount
            : ((product?.productDiscounts ?? [])[0]?.discount ?? null)

        const discountType =
          eventType === OrderEnum.FLASH_SALE || (product?.productDiscounts ?? [])[0]?.discount
            ? DiscountTypeEnum.PERCENTAGE
            : null

        return (
          <ProductCheckoutLandscape
            key={cartItem?.id}
            productImage={productImage}
            productName={productName}
            selectedClassification={selectedClassification}
            discount={discount}
            discountType={discountType}
            price={productPrice}
            productId={productId}
            eventType={eventType}
            productQuantity={productQuantity}
            productClassification={productClassification}
          />
        )
      })}

      {/* Message and brand voucher */}
      <div className="w-full flex md:justify-between justify-start md:flex-row flex-col gap-3 border-b border-gray-200 py-3">
        <div className="order-2 md:order-1 flex items-center gap-3 text-sm w-full">
          <Label>{t('input.message')}</Label>
          <Input className="border border-secondary w-full" placeholder={t('input.message')} />
        </div>
        {/* Voucher */}
        <div className="order-1 md:order-2 flex items-center gap-3 text-sm w-full justify-end">
          <Tag className="w-4 h-4 text-red-500" />
          <span>
            {chosenBrandVoucher
              ? chosenBrandVoucher?.discountType === DiscountTypeEnum.AMOUNT && chosenBrandVoucher?.discountValue
                ? t('voucher.discountAmount', { amount: chosenBrandVoucher?.discountValue })
                : t('voucher.discountPercentage', { percentage: chosenBrandVoucher?.discountValue * 100 })
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
            brandLogo={brand?.logo ?? ''}
            brandId={brand?.id ?? ''}
            hasBrandProductSelected={true}
            checkoutItems={checkoutItems}
            selectedCheckoutItems={checkoutItems}
            handleVoucherChange={handleVoucherChange}
            bestVoucherForBrand={bestVoucherForBrand}
          />
        </div>
      </div>
      <div className="w-full flex gap-2 justify-end items-center">
        <span className="lg:text-lg md:text-sm sm:text-xs text-xs text-gray-600">
          {t('cart.total')} ({cartBrandItem?.length} {t('cart.products')}):
        </span>
        <span className="text-red-500 lg:text-lg md:text-sm sm:text-xs text-xs font-medium text-end">
          {t('productCard.currentPrice', { price: totalBrandPrice })}
        </span>
      </div>
    </div>
  )
}

export default CheckoutItem
