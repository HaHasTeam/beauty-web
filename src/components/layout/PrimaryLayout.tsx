import './layout.css'

import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'

import routes from '@/config/routes'
import { useCart } from '@/hooks/useCarts'
import useCurrentPath from '@/hooks/useCurrentPath'
import { getBrandByIdApi } from '@/network/apis/brand'
import { getGroupBuyingByIdApi, getOrderByGroupBuyingIdApi } from '@/network/apis/group-buying'
import useCartStore from '@/store/cart'
import { ICartByBrand } from '@/types/cart'

import Footer from '../Footer'
import Header from '../Header'

const PrimaryLayout = ({ children }: { children?: React.ReactNode }) => {
  const { setCartItems, setGroupBuying, setGroupBuyingOrder } = useCartStore()
  const { myCart } = useCart()

  const { isCurrentPath: isMatchGroupBuyPath } = useCurrentPath(routes.groupBuyDetail)
  const { isCurrentPath: isMatchCartPath } = useCurrentPath(routes.cart)
  const groupId = useParams().groupId
  console.log('groupId', groupId)

  const brandId = useParams().brandId
  const { data: brand } = useQuery({
    queryKey: [getBrandByIdApi.queryKey, brandId as string],
    queryFn: getBrandByIdApi.fn,
    enabled: isMatchGroupBuyPath && !!brandId,
  })

  const { data: groupBuying } = useQuery({
    queryKey: [getGroupBuyingByIdApi.queryKey, groupId as string],
    queryFn: getGroupBuyingByIdApi.fn,
    enabled: isMatchGroupBuyPath && !!groupId,
  })

  const { data: groupBuyingOrder } = useQuery({
    queryKey: [getOrderByGroupBuyingIdApi.queryKey, groupId as string],
    queryFn: getOrderByGroupBuyingIdApi.fn,
    enabled: isMatchGroupBuyPath && !!groupId,
  })

  console.log(groupBuyingOrder, 'groupBuyingOrder')

  // Update Zustand store when myCart data changes
  useEffect(() => {
    if (isMatchGroupBuyPath && brand?.data && groupId) {
      console.log('groupBuyingOrder', groupBuyingOrder)

      setGroupBuyingOrder(groupBuyingOrder?.data)
      const cartItems = myCart?.data?.[brand.data.name] || []
      setGroupBuying(groupBuying?.data)
      const filteredCartItems = cartItems.filter((item) => {
        if (item.groupBuying) {
          return item.groupBuying.id === groupId
        }
        return false
      })

      let cardItemsData: ICartByBrand = {}
      if (filteredCartItems.length) {
        cardItemsData = {
          [brand.data.name]: filteredCartItems,
        }
      }
      return setCartItems(cardItemsData) // Clear cart when user is in group buy page
    }

    if (myCart && myCart.data) {
      const myFilteredCart: ICartByBrand = {}
      for (const key in myCart.data) {
        if (!myCart.data[key].length) {
          break
        } else {
          const cartItems = myCart.data[key].filter((items) => !items.groupBuying)
          if (cartItems.length) {
            myFilteredCart[key] = cartItems
          }
        }
      }
      setCartItems(myFilteredCart) // Update Zustand store with fetched cart
    }
    if (isMatchCartPath) {
      setGroupBuying(undefined)
      setGroupBuyingOrder(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    myCart,
    setCartItems,
    isMatchGroupBuyPath,
    groupId,
    brand?.data,
    groupBuying?.data.id,
    groupBuying?.data,
    setGroupBuying,
    isMatchCartPath,
    groupBuyingOrder?.data,
    setGroupBuyingOrder,
  ])

  return (
    <div className="primary-layout bg-secondary/10">
      <Header />
      <main>{children || <Outlet />}</main>
      <Footer />
    </div>
  )
}

export default PrimaryLayout
