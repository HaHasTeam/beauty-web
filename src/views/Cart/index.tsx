import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CartFooter from '@/components/cart/CartFooter'
import CartHeader from '@/components/cart/CartHeader'
import CartItem from '@/components/cart/CartItem'
import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import configs from '@/config'
import { getMyCartApi } from '@/network/apis/cart'
import { ICartByBrand } from '@/types/cart'
import { getTotalPrice } from '@/utils/price'

const Cart = () => {
  const { t } = useTranslation()
  const [selectedCartItems, setSelectedCartItems] = useState<string[]>([])
  const [allCartItemIds, setAllCartItemIds] = useState<string[]>([])
  const [chosenVoucher, setChosenVoucher] = useState('')
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false)
  const [cartByBrand, setCartByBrand] = useState<ICartByBrand | undefined>(undefined)
  const totalPrice = getTotalPrice(selectedCartItems, cartByBrand)

  const { data: useMyCartData, isFetching } = useQuery({
    queryKey: [getMyCartApi.queryKey],
    queryFn: getMyCartApi.fn,
  })

  // Handler for "Select All" checkbox
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedCartItems([]) // Deselect all
    } else {
      setSelectedCartItems(allCartItemIds) // Select all
    }
  }

  // Update the state when brand-level selection changes
  const handleSelectBrand = (cartItemIds: string[], isSelected: boolean) => {
    setSelectedCartItems((prev) => {
      if (isSelected) {
        // Add all cartItems of the brand
        return [...prev, ...cartItemIds.filter((id) => !prev.includes(id))]
      } else {
        // Remove all cartItems of the brand
        return prev.filter((id) => !cartItemIds.includes(id))
      }
    })
  }

  useEffect(() => {
    if (selectedCartItems.length === 0) {
      setChosenVoucher('')
    }
  }, [selectedCartItems])

  useEffect(() => {
    if (useMyCartData && useMyCartData?.data) {
      setCartByBrand(useMyCartData?.data)

      const tmpAllCartItemIds = Object.values(useMyCartData?.data).flatMap((cartBrand) =>
        cartBrand.map((cartItem) => cartItem.id),
      )
      setAllCartItemIds(tmpAllCartItemIds)
      setIsAllSelected(tmpAllCartItemIds.every((id) => selectedCartItems.includes(id)))
    }
  }, [selectedCartItems, useMyCartData])

  return isFetching ? (
    <LoadingContentLayer />
  ) : cartByBrand && Object.keys(cartByBrand)?.length > 0 ? (
    <div className="relative w-full mx-auto py-5 ">
      <div className="w-full xl:px-28 lg:px-12 sm:px-2 px-1 space-y-3 ">
        <h2 className="uppercase font-bold text-xl">{t('cart.title')}</h2>
        <CartHeader onCheckAll={handleSelectAll} isAllSelected={isAllSelected} />
        {cartByBrand &&
          Object.keys(cartByBrand).map((brandName, index) => (
            <CartItem
              key={`${brandName}_${index}`}
              brandName={brandName}
              cartBrandItem={cartByBrand[brandName]}
              selectedCartItems={selectedCartItems}
              onSelectBrand={handleSelectBrand}
            />
          ))}

        <CartFooter
          cartItemCountAll={allCartItemIds?.length}
          cartItemCount={selectedCartItems?.length}
          onCheckAll={handleSelectAll}
          isAllSelected={isAllSelected}
          totalPrice={totalPrice}
          savedPrice={20000}
          chosenVoucher={chosenVoucher}
          setChosenVoucher={setChosenVoucher}
          selectedCartItems={selectedCartItems}
        />
      </div>
    </div>
  ) : (
    <Empty
      title={t('empty.cart.title')}
      description={t('empty.cart.description')}
      link={configs.routes.home}
      linkText={t('empty.cart.button')}
    />
  )
}

export default Cart
