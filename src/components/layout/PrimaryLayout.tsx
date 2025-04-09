import './layout.css'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import routes from '@/config/routes'
import { useCart } from '@/hooks/useCarts'
import useCurrentPath from '@/hooks/useCurrentPath'
import { getBrandByIdApi } from '@/network/apis/brand'
import { createFCMTokenApi, getFCMTokenApi } from '@/network/apis/firebase'
import { getGroupBuyingByIdApi, getOrderByGroupBuyingIdApi } from '@/network/apis/group-buying'
import useCartStore from '@/store/cart'
import { useStore } from '@/store/store'
import { ICartByBrand } from '@/types/cart'
import getBrowserAndOS from '@/utils'
import { getRegistrationToken, onMessageListener } from '@/utils/firebase/cloud'

import Footer from '../Footer'
import Header from '../Header'

const PrimaryLayout = ({ children }: { children?: React.ReactNode }) => {
  const { setCartItems, setGroupBuying, setGroupBuyingOrder } = useCartStore()
  const { myCart } = useCart()
  const { authData } = useStore(
    useShallow((state) => ({
      authData: state.authData,
    })),
  )

  const { isCurrentPath: isMatchGroupBuyPath } = useCurrentPath(routes.groupBuyDetail)
  const { isCurrentPath: isMatchCartPath } = useCurrentPath(routes.cart)
  const { isCurrentPath: isMatchProductDetailPath } = useCurrentPath(routes.productDetail)
  const groupId = useParams().groupId
  const { data: tokenFCM, isLoading: isLoadingToken } = useQuery({
    queryKey: [getFCMTokenApi.queryKey],
    queryFn: getFCMTokenApi.fn,
    enabled: !!authData?.accessToken,
  })
  const { mutateAsync: registerUserDevice } = useMutation({
    mutationFn: createFCMTokenApi.fn,
    mutationKey: [createFCMTokenApi.mutationKey],
  })
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

  useEffect(() => {
    // Handle group buy cart items
    if (isMatchGroupBuyPath && brand?.data && groupId) {
      setGroupBuyingOrder(groupBuyingOrder?.data)

      const cartItems = myCart?.data?.[brand.data.name] || []
      console.log('cartItems', cartItems)
      setGroupBuying(groupBuying?.data)

      // Filter cart items for this specific group buy
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
      return setCartItems(cardItemsData)
    }

    // Handle normal cart items (when not in group buy or checkout)
    if (isMatchCartPath && !isMatchGroupBuyPath && !isMatchProductDetailPath && myCart && myCart.data) {
      const myFilteredCart: ICartByBrand = {}
      for (const key in myCart.data) {
        if (myCart.data[key].length) {
          // Filter out group buy items
          const cartItems = myCart.data[key].filter((items) => {
            if (items.groupBuying) {
              return false
            }
            return true
          })

          if (cartItems.length) {
            myFilteredCart[key] = cartItems
          }
        }
      }
      console.log('myFilteredCart', myFilteredCart)

      setCartItems(myFilteredCart)
    }

    // Clear group buy data when in cart page or product detail page
    if (isMatchCartPath || isMatchProductDetailPath) {
      setGroupBuying(undefined)
      setGroupBuyingOrder(undefined)
    }
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
    isMatchProductDetailPath,
  ])

  // Handle FCM token registration
  useEffect(() => {
    if (authData?.accessToken && !isLoadingToken) {
      ;(async () => {
        const deviceToken = await getRegistrationToken()

        if (deviceToken) {
          // Always store the token in localStorage for normal use
          localStorage.setItem('fcm_token', deviceToken)

          // Check if the current device token matches the one in the database
          const tokenExistsInDB = tokenFCM && tokenFCM.data === deviceToken

          // Register only if token is new or different from the one in database
          if (!tokenExistsInDB) {
            const { browser, os } = getBrowserAndOS()
            console.log('Registering new FCM token')
            registerUserDevice({ token: deviceToken, browser, os })
          } else {
            console.log('FCM token already registered, using existing token')
          }
        }
      })()
    }
  }, [authData, authData?.accessToken, registerUserDevice, tokenFCM, isLoadingToken])

  // Set up notification listener
  useEffect(() => {
    if (authData?.accessToken) {
      onMessageListener()
        .then((payload) => {
          console.log('Message received. ', payload)
          // Handle the notification here (e.g., update notification count, show toast)
        })
        .catch((err) => console.log('failed: ', err))
    }
  }, [authData?.accessToken])
  return (
    <div className="primary-layout bg-secondary/10">
      <Header />
      <main>{children || <Outlet />}</main>
      <Footer />
    </div>
  )
}

export default PrimaryLayout
