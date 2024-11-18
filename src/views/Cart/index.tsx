import { useTranslation } from 'react-i18next'

import CartItem from '@/components/cart/CartItem'

const Cart = () => {
  const { t } = useTranslation()

  const carts = [{ id: '1' }, { id: '2' }]

  return (
    <div className="w-full mx-auto px-4 py-5 ">
      <div className="w-full lg:px-20 md:px-10 sm:px-8 px-3 space-y-3 ">
        <h2 className="uppercase font-bold text-xl">{t('cart.title')}</h2>
        {carts.map((cart) => (
          <CartItem key={cart.id} brandName={'Romand'} brandId={''} cartItemId={''} />
        ))}
      </div>
    </div>
  )
}

export default Cart
