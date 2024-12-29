import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CartFooter from '@/components/cart/CartFooter'
import CartHeader from '@/components/cart/CartHeader'
import CartItem from '@/components/cart/CartItem'
import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import configs from '@/config'
import useHandleServerError from '@/hooks/useHandleServerError'
import { getMyCartApi } from '@/network/apis/cart'
import { getBestShopVouchersApi } from '@/network/apis/voucher'
import { ICartByBrand } from '@/types/cart'
import { DiscountTypeEnum } from '@/types/enum'
import { IBrandBestVoucher, TVoucher } from '@/types/voucher'
import { createCheckoutItems } from '@/utils/cart'
import { calculateCartTotals } from '@/utils/price'

const Cart = () => {
  const { t } = useTranslation()
  const [selectedCartItems, setSelectedCartItems] = useState<string[]>([])
  const [allCartItemIds, setAllCartItemIds] = useState<string[]>([])
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false)
  const [cartByBrand, setCartByBrand] = useState<ICartByBrand | undefined>(undefined)
  const [bestBrandVouchers, setBestBrandVouchers] = useState<IBrandBestVoucher[]>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [totalOriginalPrice, setTotalOriginalPrice] = useState<number>(0)
  const [totalDirectProductsDiscount, setTotalDirectProductsDiscount] = useState<number>(0)
  const [isTriggerTotal, setIsTriggerTotal] = useState<boolean>(false)
  const [chosenVouchersByBrand, setChosenVouchersByBrand] = useState<{ [brandId: string]: TVoucher | null }>({})

  const handleServerError = useHandleServerError()
  const voucherMap = bestBrandVouchers.reduce<{ [key: string]: IBrandBestVoucher }>((acc, voucher) => {
    acc[voucher.brandId] = voucher
    return acc
  }, {})

  // Calculate total product discount

  // Calculate total voucher discount
  const totalVoucherDiscount = useMemo(() => {
    return Object.values(chosenVouchersByBrand).reduce((total, voucher) => {
      if (!voucher) return total
      const { discountType, discountValue } = voucher
      const voucherDiscount =
        discountType === DiscountTypeEnum.PERCENTAGE ? (totalPrice * discountValue) / 100 : discountValue
      return total + voucherDiscount
    }, 0)
  }, [chosenVouchersByBrand, totalPrice])

  const { data: useMyCartData, isFetching } = useQuery({
    queryKey: [getMyCartApi.queryKey],
    queryFn: getMyCartApi.fn,
  })

  const { mutateAsync: callBestBrandVouchersFn } = useMutation({
    mutationKey: [getBestShopVouchersApi.mutationKey],
    mutationFn: getBestShopVouchersApi.fn,
    onSuccess: (data) => {
      console.log(data)
      setBestBrandVouchers(data?.data)
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
  const handleVoucherSelection = (brandName: string, voucher: TVoucher | null) => {
    setChosenVouchersByBrand((prev) => ({
      ...prev,
      [brandName]: voucher,
    }))
  }

  useEffect(() => {
    if (useMyCartData && useMyCartData?.data) {
      setCartByBrand(useMyCartData?.data)

      // handle set selected checkbox cart items
      const tmpAllCartItemIds = Object.values(useMyCartData?.data).flatMap((cartBrand) =>
        cartBrand.map((cartItem) => cartItem.id),
      )
      setAllCartItemIds(tmpAllCartItemIds)
      setIsAllSelected(tmpAllCartItemIds.every((id) => selectedCartItems.includes(id)))

      // handle show best voucher for each brand
      async function handleShowBestBrandVoucher() {
        try {
          if (useMyCartData && useMyCartData?.data) {
            const checkoutItems = createCheckoutItems(useMyCartData?.data)
            await callBestBrandVouchersFn({
              checkoutItems: checkoutItems,
            })
          }
        } catch (error) {
          handleServerError({ error })
        }
      }

      handleShowBestBrandVoucher()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCartItems, useMyCartData])

  useEffect(() => {
    setTotalPrice(calculateCartTotals(selectedCartItems, cartByBrand).totalPrice)
    setTotalOriginalPrice(calculateCartTotals(selectedCartItems, cartByBrand).totalProductCost)
    setTotalDirectProductsDiscount(calculateCartTotals(selectedCartItems, cartByBrand).totalProductDiscount)
  }, [cartByBrand, selectedCartItems, isTriggerTotal])

  console.log(chosenVouchersByBrand)
  return (
    <>
      {isFetching && <LoadingContentLayer />}
      {cartByBrand && Object.keys(cartByBrand)?.length > 0 ? (
        <div className="relative w-full mx-auto py-5">
          <div className="w-full xl:px-28 lg:px-12 sm:px-2 px-1 space-y-3 ">
            <h2 className="uppercase font-bold text-xl">{t('cart.title')}</h2>
            <CartHeader onCheckAll={handleSelectAll} isAllSelected={isAllSelected} />
            {cartByBrand &&
              Object.keys(cartByBrand).map((brandName, index) => {
                const brand =
                  cartByBrand[brandName]?.[0]?.productClassification?.productDiscount?.product?.brand ??
                  cartByBrand[brandName]?.[0]?.productClassification?.preOrderProduct?.product?.brand ??
                  cartByBrand[brandName]?.[0]?.productClassification?.product?.brand
                const brandId = brand?.id ?? ''
                const bestVoucherForBrand = voucherMap[brandId] || null
                console.log(brandId)
                return (
                  <CartItem
                    key={`${brandName}_${index}`}
                    brandName={brandName}
                    cartBrandItem={cartByBrand[brandName]}
                    selectedCartItems={selectedCartItems}
                    onSelectBrand={handleSelectBrand}
                    bestVoucherForBrand={bestVoucherForBrand}
                    setIsTriggerTotal={setIsTriggerTotal}
                    onVoucherSelect={handleVoucherSelection}
                  />
                )
              })}

            <CartFooter
              cartItemCountAll={allCartItemIds?.length}
              cartItemCount={selectedCartItems?.length}
              setSelectedCartItems={setSelectedCartItems}
              onCheckAll={handleSelectAll}
              isAllSelected={isAllSelected}
              totalPrice={totalPrice}
              totalOriginalPrice={totalOriginalPrice}
              selectedCartItems={selectedCartItems}
              totalProductDiscount={totalDirectProductsDiscount}
              totalVoucherDiscount={totalVoucherDiscount}
            />
          </div>
        </div>
      ) : (
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
