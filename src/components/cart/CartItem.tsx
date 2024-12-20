import { MessageCircle, Store, Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import { ICartItem } from '@/types/cart'
import { IClassification } from '@/types/classification'
import { OrderEnum } from '@/types/enum'

import ProductCardLandscape from '../product/ProductCardLandscape'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import VoucherCartList from '../voucher/VoucherCartList'

interface CartItemProps {
  brandName: string
  cartBrandItem: ICartItem[]
  selectedCartItems: string[]
  onSelectBrand: (productIds: string[], isSelected: boolean) => void
}
const CartItem = ({ brandName, cartBrandItem, selectedCartItems, onSelectBrand }: CartItemProps) => {
  const { t } = useTranslation()
  const brand = cartBrandItem[0]?.productClassification?.product?.brand
  const cartItemIds = cartBrandItem?.map((cartItem) => cartItem.id)
  const isBrandSelected = cartBrandItem.every((productClassification) =>
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
      {cartBrandItem?.map((cartItem) => {
        const productImage = cartItem?.productClassification?.images?.[0]?.fileUrl ?? ''
        const productName = cartItem?.productClassification?.product?.name
        const allClassificationsOfProduct: IClassification[] = []
        const productPrice = cartItem?.productClassification?.price
        const productQuantity = cartItem?.quantity
        const selectedClassification = cartItem?.classification
        const eventType = cartItem?.productClassification?.preOrderProduct
          ? OrderEnum.PRE_ORDER
          : cartItem?.productClassification?.productDiscount
            ? OrderEnum.FLASH_SALE
            : ''

        return (
          <ProductCardLandscape
            key={cartItem?.id}
            productImage={productImage}
            productName={productName}
            classifications={allClassificationsOfProduct}
            selectedClassification={selectedClassification}
            currentPrice={productPrice}
            price={productPrice}
            cartItemId={cartItem?.id}
            eventType={eventType}
            isSelected={selectedCartItems?.includes(cartItem?.id)}
            onChooseProduct={() => handleSelectCartItem(cartItem?.id, !selectedCartItems?.includes(cartItem?.id))}
            productQuantity={productQuantity}
          />
        )
      })}

      {/* Voucher */}
      <div className="flex items-center gap-3 text-sm">
        <Tag className="w-4 h-4 text-red-500" />
        <span>Voucher giảm đến ₫21k</span>
        <VoucherCartList triggerText={t('cart.viewMoreVoucher')} brandName="Romand" />
      </div>
    </div>
  )
}

export default CartItem
