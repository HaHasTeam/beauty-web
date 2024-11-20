import { useTranslation } from 'react-i18next'

const Checkout = () => {
  const { t } = useTranslation()
  return (
    <div className="relative w-full mx-auto px-4 py-5 ">
      <div className="w-full lg:px-20 md:px-10 sm:px-8 px-3 space-y-3 ">
        <h2 className="uppercase font-bold text-xl">{t('cart.checkout')}</h2>
      </div>
    </div>
  )
}

export default Checkout
