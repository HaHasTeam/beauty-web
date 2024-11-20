import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CartFooter from '@/components/cart/CartFooter'
import CartHeader from '@/components/cart/CartHeader'
import CartItem from '@/components/cart/CartItem'
import { ICart } from '@/types/cart'

const Cart = () => {
  const { t } = useTranslation()
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const [chosenVoucher, setChosenVoucher] = useState('')

  const carts: ICart[] = [
    {
      id: '1',
      brandName: 'Romand',
      products: [
        {
          id: '1',
          image: 'https://i.pinimg.com/736x/c9/74/71/c97471cc7179e3164dfacba52cf957ea.jpg',
          name: 'Romand Lip Tint',
          classifications: [
            { id: '0', name: 'Rose', image: 'https://example.com/color1.jpg', selected: true },
            { id: '1', name: 'Black', image: 'https://example.com/color1.jpg', selected: false },
            { id: '2', name: 'White', image: 'https://example.com/color1.jpg', selected: false },
            { id: '3', name: 'Green', image: 'https://example.com/color1.jpg', selected: false },
            { id: '4', name: 'Blue', image: 'https://example.com/color1.jpg', selected: false },
          ],
          currentPrice: 10000,
          price: 12000,
          eventType: 'LiveStream',
          quantity: 2,
        },
        {
          id: '2',
          image: 'https://i.pinimg.com/736x/c9/74/71/c97471cc7179e3164dfacba52cf957ea.jpg',
          name: 'Romand Lip Gloss',
          classifications: [{ id: '2', name: 'Shine', image: 'https://example.com/shine2.jpg', selected: true }],
          currentPrice: 9500,
          price: 11000,
          eventType: 'LiveStream',
          quantity: 3,
        },
      ],
    },
    {
      id: '2',
      brandName: 'Another Brand',
      products: [
        {
          id: '3',
          image: 'https://i.pinimg.com/736x/c9/74/71/c97471cc7179e3164dfacba52cf957ea.jpg',
          name: 'Another Brand Lipstick',
          classifications: [{ id: '3', name: 'Matte', image: 'https://example.com/matte3.jpg', selected: true }],
          currentPrice: 8000,
          price: 10000,
          eventType: 'Sale',
          quantity: 1,
        },
        {
          id: '4',
          image: 'https://i.pinimg.com/736x/c9/74/71/c97471cc7179e3164dfacba52cf957ea.jpg',
          name: 'Another Brand Lip Balm',
          classifications: [
            { id: '4', name: 'Hydrating', image: 'https://example.com/hydrating4.jpg', selected: true },
          ],
          currentPrice: 5000,
          price: 6000,
          eventType: 'Sale',
          quantity: 5,
        },
      ],
    },
  ]

  const allProductIds = carts.flatMap((cart) => cart.products.map((product) => product.id))
  const isAllSelected = allProductIds.every((id) => selectedProducts.includes(id))
  // Handler for "Select All" checkbox
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedProducts([]) // Deselect all
    } else {
      setSelectedProducts(allProductIds) // Select all
    }
  }

  // Update the state when brand-level selection changes
  const handleSelectBrand = (productIds: string[], isSelected: boolean) => {
    setSelectedProducts((prev) => {
      if (isSelected) {
        // Add all products of the brand
        return [...prev, ...productIds.filter((id) => !prev.includes(id))]
      } else {
        // Remove all products of the brand
        return prev.filter((id) => !productIds.includes(id))
      }
    })
  }

  useEffect(() => {
    if (selectedProducts.length === 0) {
      setChosenVoucher('')
    }
  }, [selectedProducts])
  return (
    <div className="relative w-full mx-auto py-5 ">
      <div className="w-full lg:px-12 sm:px-2 px-1 space-y-3 ">
        <h2 className="uppercase font-bold text-xl">{t('cart.title')}</h2>
        <CartHeader onCheckAll={handleSelectAll} isAllSelected={isAllSelected} />
        {carts.map((cart) => (
          <CartItem
            key={cart.id}
            brandName={cart.brandName}
            brandId={cart.id}
            cartItemId={cart.id}
            products={cart.products}
            selectedProducts={selectedProducts}
            onSelectBrand={handleSelectBrand}
          />
        ))}
        <CartFooter
          cartItemCountAll={allProductIds.length}
          cartItemCount={selectedProducts.length}
          onCheckAll={handleSelectAll}
          isAllSelected={isAllSelected}
          totalPrice={10000}
          savedPrice={20000}
          chosenVoucher={chosenVoucher}
          setChosenVoucher={setChosenVoucher}
          selectedProducts={selectedProducts}
        />
      </div>
    </div>
  )
}

export default Cart
