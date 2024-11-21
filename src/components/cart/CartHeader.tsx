import { useTranslation } from 'react-i18next'

import { Checkbox } from '@/components/ui/checkbox'

interface CartHeaderProps {
  onCheckAll?: () => void
  isAllSelected?: boolean
  isShowCheckbox?: boolean
}
export default function CartHeader({ onCheckAll, isAllSelected, isShowCheckbox = true }: CartHeaderProps) {
  const { t } = useTranslation()

  return (
    <div className="w-full bg-secondary/30 rounded-sm">
      <div className="w-full flex px-4 py-3 space-y-2 items-center lg:text-base md:text-sm sm:text-xs text-xs">
        <div className="flex items-center gap-2 lg:w-[75%] md:w-[75%] sm:w-[44%] w-[48%]">
          {isShowCheckbox && <Checkbox checked={isAllSelected} onClick={onCheckAll} id="select-all" />}
          <label htmlFor="select-all">{t('cart.Products')}</label>
        </div>
        <span className="hidden md:block md:w-[14%] text-center">{t('cart.price')}</span>
        <span className="w-[26%] md:w-[12%] sm:w-[20%] text-center">{t('cart.quantity')}</span>
        <span className="w-[16%] md:w-[8%] sm:w-[12%] text-center">{t('cart.total')}</span>
        <span className="w-[7%] sm:w-[5%] text-center">{t('cart.action')}</span>
      </div>
    </div>
  )
}
