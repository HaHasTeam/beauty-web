import './layout.css'

import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { useCart } from '@/hooks/useCarts'
import useCartStore from '@/store/cart'

import Footer from '../Footer'
import Header from '../Header'

const PrimaryLayout = ({ children }: { children?: React.ReactNode }) => {
  const { setCartItems } = useCartStore()
  const { myCart } = useCart()

  // Update Zustand store when myCart data changes
  useEffect(() => {
    if (myCart && myCart.data) {
      console.log('Cart fetched successfully:', myCart)
      setCartItems(myCart?.data) // Update Zustand store with fetched cart
    }
  }, [myCart, setCartItems])

  return (
    <div className="primary-layout bg-secondary/10">
      <Header />
      <main>{children || <Outlet />}</main>
      <Footer />
    </div>
  )
}

export default PrimaryLayout
