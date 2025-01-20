import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Checkbox } from '@/components/ui/checkbox'

interface CartHeaderProps {
  onCheckAll?: () => void
  isAllSelected?: boolean
  isShowCheckbox?: boolean
  totalCartItems: number
}
export default function CartHeader({
  onCheckAll,
  isAllSelected,
  isShowCheckbox = true,
  totalCartItems,
}: CartHeaderProps) {
  const { t } = useTranslation()

  return (
    <div className="w-full bg-secondary/30 rounded-sm">
      <div className="w-full flex px-4 py-3 items-center lg:text-base md:text-sm sm:text-xs text-xs">
        {/* Product Label */}
        <div className="flex items-center gap-2 justify-between lg:w-[75%] md:w-[75%] sm:w-[60%] w-[60%]">
          <div className="flex items-center gap-2 lg:w-[65%] md:w-[65%] sm:w-full w-full">
            {isShowCheckbox && <Checkbox checked={isAllSelected} onClick={onCheckAll} id="select-all" />}
            <label htmlFor="select-all" className="w-fit">
              {t('cart.Products')} ({totalCartItems} {t('cart.products')})
            </label>
          </div>

          {/* Product Price */}
          <div className="hidden md:block md:w-[25%] lg:w-[20%] text-center">{t('cart.price')}</div>
        </div>

        {/* Product Quantity */}
        <div className="w-[26%] md:w-[12%] sm:w-[23%] flex justify-center items-center">{t('cart.quantity')}</div>

        {/* Total Price */}
        <div className="w-[16%] md:w-[8%] sm:w-[12%] flex justify-center items-center">{t('cart.total')}</div>

        {/* Trash Icon */}
        <div className="w-[7%] sm:w-[5%] flex justify-center items-center">
          <Trash2 />
        </div>
      </div>
    </div>
  )
}
