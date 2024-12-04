import { useTranslation } from 'react-i18next'

export default function CheckoutHeader() {
  const { t } = useTranslation()

  return (
    <div className="w-full bg-secondary/30 rounded-sm">
      <div className="w-full flex px-4 py-3 space-y-2 items-center lg:text-base md:text-sm sm:text-xs text-xs">
        <div className="flex items-center gap-2 lg:w-[54%] md:w-[60%] sm:w-[80%] w-[70%]">
          <label htmlFor="select-all">{t('cart.Products')}</label>
        </div>
        <span className="hidden sm:block md:w-[17%] lg:w-[23%] text-right pr-1">{t('cart.price')}</span>
        <span className="w-[10%] md:w-[9%] sm:w-[8%]  text-right">{t('cart.quantity')}</span>
        <span className="w-[20%] md:w-[14%] sm:w-[12%] text-right">{t('cart.total')}</span>
      </div>
    </div>
  )
}
