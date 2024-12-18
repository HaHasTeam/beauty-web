import { MessageCircle, Store, Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import { IProductCart } from '@/types/product'

import ProductCardLandscape from '../product/ProductCardLandscape'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import VoucherCartList from '../voucher/VoucherCartList'

interface CartItemProps {
  brandName: string
  brandId: string
  cartItemId: string
  selectedProducts: string[]
  products: IProductCart[]
  onSelectBrand: (productIds: string[], isSelected: boolean) => void
}
const CartItem = ({ brandName, brandId, cartItemId, products, selectedProducts, onSelectBrand }: CartItemProps) => {
  const { t } = useTranslation()
  const productIds = products.map((product) => product.id)
  const isBrandSelected = products.every((product) => selectedProducts?.includes(product.id))

  // Handler for brand-level checkbox
  const handleBrandSelect = () => {
    onSelectBrand(productIds, !isBrandSelected)
  }

  // Handler for individual product selection
  const handleSelectProduct = (productId: string, isSelected: boolean) => {
    onSelectBrand([productId], isSelected)
  }
  return (
    <div className="w-full bg-white p-4 rounded-lg space-y-2 shadow-sm">
      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-4">
        {/* group product of brand checkbox */}
        <Checkbox id={cartItemId} checked={isBrandSelected} onClick={handleBrandSelect} />
        <Store className="w-5 h-5 text-red-500" />
        <Link to={configs.routes.brands + `/${brandId}`}>
          <span className="font-medium">{brandName}</span>
        </Link>
        <Button className="p-2 bg-primary hover:bg-primary/80" variant="default">
          <MessageCircle className="w-4 h-4" />
          {t('brand.chatNow')}
        </Button>
      </div>

      {/* Product Cards */}
      {products?.map((product) => (
        <ProductCardLandscape
          key={product?.id}
          productImage={product?.image}
          productName={product?.name}
          classifications={product?.classifications}
          currentPrice={product?.currentPrice}
          price={product?.price}
          productId={product?.id}
          eventType={product?.eventType}
          isSelected={selectedProducts?.includes(product?.id)}
          onChooseProduct={() => handleSelectProduct(product?.id, !selectedProducts?.includes(product?.id))}
          productQuantity={product?.quantity}
        />
      ))}

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
