'use client'

import { useMutation } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CartFooter from '@/components/cart/CartFooter'
import CartHeader from '@/components/cart/CartHeader'
import CartItem from '@/components/cart/CartItem'
import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import configs from '@/config'
import { useCart } from '@/hooks/useCarts'
import { cn } from '@/lib/utils'
// import { getMyCartApi } from '@/network/apis/cart'
import { getBestPlatformVouchersApi, getBestShopVouchersApi } from '@/network/apis/voucher'
import useCartStore from '@/store/cart'
import type { ICartByBrand } from '@/types/cart'
import type { IBrandBestVoucher, ICheckoutItem, IPlatformBestVoucher, TVoucher } from '@/types/voucher'
import { createCheckoutItem, createCheckoutItems } from '@/utils/cart'
import {
  calculateCartTotals,
  calculatePlatformVoucherDiscount,
  calculateTotalBrandVoucherDiscount,
} from '@/utils/price'

type CartProps = {
  isInGroupBuy?: boolean
  isInPeriod?: boolean
}

const Cart = ({ isInGroupBuy = false, isInPeriod = false }: CartProps) => {
  const { t } = useTranslation()
  const [selectedCartItems, setSelectedCartItems] = useState<string[]>([])
  const [allCartItemIds, setAllCartItemIds] = useState<string[]>([])
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false)
  const { cartItems } = useCartStore()
  const { isMyCartFetching } = useCart()

  // const [cartByBrand, setCartByBrand] = useState<ICartByBrand | undefined>(undefined)

  const [bestBrandVouchers, setBestBrandVouchers] = useState<IBrandBestVoucher[]>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [isTriggerTotal, setIsTriggerTotal] = useState<boolean>(false)
  const [totalOriginalPrice, setTotalOriginalPrice] = useState<number>(0)
  const [totalDirectProductsDiscount, setTotalDirectProductsDiscount] = useState<number>(0)
  const [chosenVouchersByBrand, setChosenVouchersByBrand] = useState<{ [brandId: string]: TVoucher | null }>({})
  const [platformChosenVoucher, setPlatformChosenVoucher] = useState<TVoucher | null>(null)
  const { setChosenPlatformVoucher, setSelectedCartItem, resetSelectedCartItem } = useCartStore()
  const [bestPlatformVoucher, setBestPlatformVoucher] = useState<IPlatformBestVoucher | null>(null)
  const [totalLivestreamDiscount, setTotalLivestreamDiscount] = useState<number>(0)

  const voucherMap = bestBrandVouchers?.reduce<{ [key: string]: IBrandBestVoucher }>((acc, voucher) => {
    acc[voucher?.brandId] = voucher
    return acc
  }, {})

  // Calculate total voucher discount
  const totalVoucherDiscount = useMemo(() => {
    return calculateTotalBrandVoucherDiscount(cartItems, selectedCartItems, chosenVouchersByBrand)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, chosenVouchersByBrand, selectedCartItems, isTriggerTotal])
  // Calculate platform voucher discount
  const platformVoucherDiscount = useMemo(() => {
    return calculatePlatformVoucherDiscount(cartItems, selectedCartItems, platformChosenVoucher, chosenVouchersByBrand)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, selectedCartItems, isTriggerTotal, platformChosenVoucher, totalVoucherDiscount, chosenVouchersByBrand])

  // Total saved price (product discounts + brand vouchers + platform voucher + livestream discount)
  const savedPrice =
    totalDirectProductsDiscount + totalVoucherDiscount + platformVoucherDiscount + totalLivestreamDiscount

  console.log('totalLivestreamDiscount', totalLivestreamDiscount)
  console.log('platformVoucherDiscount', platformVoucherDiscount)
  console.log('totalVoucherDiscount', totalVoucherDiscount)
  console.log('totalDirectProductsDiscount', totalDirectProductsDiscount)

  const totalFinalPrice = totalPrice - totalVoucherDiscount - platformVoucherDiscount - totalLivestreamDiscount

  // const { data: useMyCartData, isFetching } = useQuery({
  //   queryKey: [getMyCartApi.queryKey],
  //   queryFn: getMyCartApi.fn,
  // })

  const { mutateAsync: callBestBrandVouchersFn } = useMutation({
    mutationKey: [getBestShopVouchersApi.mutationKey],
    mutationFn: getBestShopVouchersApi.fn,
    onSuccess: (data) => {
      setBestBrandVouchers(data?.data)
    },
  })
  const { mutateAsync: callBestPlatformVouchersFn } = useMutation({
    mutationKey: [getBestPlatformVouchersApi.mutationKey],
    mutationFn: getBestPlatformVouchersApi.fn,
    onSuccess: (data) => {
      setBestPlatformVoucher(data?.data)
    },
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
  const handleVoucherSelection = (brandId: string, voucher: TVoucher | null) => {
    setChosenVouchersByBrand((prev) => ({
      ...prev,
      [brandId]: voucher,
    }))
    // setChosenBrandVouchers({ ...chosenVouchersByBrand, [brandId]: voucher })
  }

  useEffect(() => {
    if (cartItems) {
      // setCartByBrand(useMyCartData?.data)

      const selectedCartItemsMap = Object.keys(cartItems).reduce((acc, brandName) => {
        const brandCartItems = cartItems[brandName]
        const selectedItems = brandCartItems.filter((cartItem) => selectedCartItems.includes(cartItem.id))

        if (selectedItems.length > 0) {
          acc[brandName] = selectedItems
        }

        return acc
      }, {} as ICartByBrand)

      setSelectedCartItem(selectedCartItemsMap)

      // handle set selected checkbox cart items
      const tmpAllCartItemIds = Object.values(cartItems).flatMap((cartBrand) =>
        cartBrand.map((cartItem) => cartItem.id),
      )
      setAllCartItemIds(tmpAllCartItemIds)
      setIsAllSelected(tmpAllCartItemIds.every((id) => selectedCartItems.includes(id)))

      const validSelectedCartItems = selectedCartItems.filter((id) => tmpAllCartItemIds.includes(id))
      if (validSelectedCartItems.length !== selectedCartItems.length) {
        setSelectedCartItems(validSelectedCartItems)
      }

      // handle show best voucher for each brand
      async function handleShowBestBrandVoucher() {
        try {
          if (cartItems) {
            const checkoutItems = createCheckoutItems(cartItems, selectedCartItems)
            await callBestBrandVouchersFn({
              checkoutItems: checkoutItems,
            })
          }
        } catch (error) {
          console.error(error)
        }
      }
      async function handleShowBestPlatformVoucher() {
        try {
          let checkoutItems: ICheckoutItem[] = []
          if (cartItems) {
            checkoutItems = Object.entries(cartItems)
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .flatMap(([_brandName, cartItems]) => createCheckoutItem(cartItems, selectedCartItems))
          }

          await callBestPlatformVouchersFn({
            checkoutItems: checkoutItems,
          })
        } catch (error) {
          console.error(error)
        }
      }

      handleShowBestBrandVoucher()
      handleShowBestPlatformVoucher()
    }
  }, [callBestBrandVouchersFn, callBestPlatformVouchersFn, cartItems, selectedCartItems, setSelectedCartItem])

  useEffect(() => {
    if (selectedCartItems?.length > 0) {
      const cartTotals = calculateCartTotals(selectedCartItems, cartItems)
      setTotalPrice(cartTotals.totalPrice)
      setTotalOriginalPrice(cartTotals.totalProductCost)
      setTotalDirectProductsDiscount(cartTotals.totalProductDiscount)
      setTotalLivestreamDiscount(cartTotals.totalLivestreamDiscount)
    } else {
      setTotalPrice(0)
      setTotalOriginalPrice(0)
      setTotalDirectProductsDiscount(0)
      setTotalLivestreamDiscount(0)
      setChosenVouchersByBrand({})

      setPlatformChosenVoucher(null)
      setChosenPlatformVoucher(null)
      resetSelectedCartItem()
    }
  }, [cartItems, resetSelectedCartItem, selectedCartItems, setChosenPlatformVoucher, isTriggerTotal])
  useEffect(() => {
    setChosenPlatformVoucher(platformChosenVoucher)
  }, [platformChosenVoucher, setChosenPlatformVoucher])

  useEffect(() => {
    if (totalVoucherDiscount === 0) {
      setChosenVouchersByBrand({})
    }
    if (platformVoucherDiscount === 0) {
      setPlatformChosenVoucher(null)
    }
  }, [platformVoucherDiscount, totalVoucherDiscount, isTriggerTotal, selectedCartItems])

  return (
    <>
      {isMyCartFetching && <LoadingContentLayer />}
      {!isMyCartFetching && cartItems && Object.keys(cartItems)?.length > 0 && (
        <div className="relative w-full mx-auto py-5">
          <div className={cn('w-full space-y-3 ', isInGroupBuy ? '' : ' xl:px-28 lg:px-12 sm:px-2 px-1')}>
            <h2 className="uppercase font-bold text-xl">{t('cart.title')}</h2>
            <CartHeader
              onCheckAll={handleSelectAll}
              isAllSelected={isAllSelected}
              totalCartItems={allCartItemIds?.length}
            />
            {cartItems &&
              Object.keys(cartItems).map((brandName, index) => {
                const brand =
                  cartItems[brandName]?.[0]?.productClassification?.productDiscount?.product?.brand ??
                  cartItems[brandName]?.[0]?.productClassification?.preOrderProduct?.product?.brand ??
                  cartItems[brandName]?.[0]?.productClassification?.product?.brand
                const brandId = brand?.id ?? ''
                const bestVoucherForBrand = voucherMap[brandId] || null
                const cartBrandItem = cartItems[brandName]
                const checkoutItems: ICheckoutItem[] = cartBrandItem
                  ?.map((cartItem) => ({
                    classificationId: cartItem.productClassification?.id ?? '',
                    quantity: cartItem.quantity ?? 0,
                  }))
                  ?.filter((item) => item.classificationId !== null)

                const selectedCheckoutItems: ICheckoutItem[] = cartBrandItem
                  ?.filter((cart) => selectedCartItems?.includes(cart?.id))
                  ?.map((cartItem) => ({
                    classificationId: cartItem.productClassification?.id ?? '',
                    quantity: cartItem.quantity ?? 0,
                  }))
                  ?.filter((item) => item.classificationId !== null)
                return (
                  <CartItem
                    isInGroupBuying={isInGroupBuy}
                    key={`${brandName}_${index}`}
                    brandName={brandName}
                    cartBrandItem={cartBrandItem}
                    selectedCartItems={selectedCartItems}
                    onSelectBrand={handleSelectBrand}
                    bestVoucherForBrand={bestVoucherForBrand}
                    onVoucherSelect={handleVoucherSelection}
                    brand={brand}
                    checkoutItems={checkoutItems}
                    selectedCheckoutItems={selectedCheckoutItems}
                    setIsTriggerTotal={setIsTriggerTotal}
                    isTriggerTotal={isTriggerTotal}
                  />
                )
              })}

            <CartFooter
              isInPeriod={isInPeriod}
              isInGroupBuying={isInGroupBuy}
              cartItemCountAll={allCartItemIds?.length}
              cartItemCount={selectedCartItems?.length}
              setSelectedCartItems={setSelectedCartItems}
              onCheckAll={handleSelectAll}
              isAllSelected={isAllSelected}
              totalOriginalPrice={totalOriginalPrice}
              selectedCartItems={selectedCartItems}
              totalProductDiscount={totalDirectProductsDiscount}
              totalVoucherDiscount={totalVoucherDiscount}
              totalLivestreamDiscount={totalLivestreamDiscount}
              savedPrice={savedPrice}
              totalFinalPrice={totalFinalPrice}
              platformChosenVoucher={platformChosenVoucher}
              setPlatformChosenVoucher={setPlatformChosenVoucher}
              platformVoucherDiscount={platformVoucherDiscount}
              cartByBrand={cartItems}
              bestPlatformVoucher={bestPlatformVoucher}
            />
          </div>
        </div>
      )}
      {!isMyCartFetching && (!cartItems || Object.keys(cartItems)?.length === 0) && (
        <div className="my-10 w-full h-full flex flex-col justify-center">
          <Empty
            title={t('empty.cart.title')}
            description={t('empty.cart.description')}
            link={configs.routes.home}
            linkText={t('empty.cart.button')}
          />
        </div>
      )}
    </>
  )
}

export default Cart
