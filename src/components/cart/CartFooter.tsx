import { Ticket, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import configs from '@/config'
import { ProjectInformationEnum } from '@/types/enum'

import VoucherDialog from '../voucher/VoucherDialog'

interface CartFooterProps {
  cartItemCountAll: number
  cartItemCount: number
  onCheckAll: () => void
  isAllSelected: boolean
  totalPrice: number
  savedPrice: number
  chosenVoucher: string
  selectedCartItems: string[]
  setChosenVoucher: (value: string) => void
}
export default function CartFooter({
  cartItemCountAll,
  cartItemCount,
  onCheckAll,
  isAllSelected,
  totalPrice,
  savedPrice,
  chosenVoucher,
  setChosenVoucher,
  selectedCartItems,
}: CartFooterProps) {
  const { t } = useTranslation()

  return (
    <div className="w-full sticky bottom-0 left-0 right-0 border-t bg-secondary rounded-tl-sm rounded-tr-sm">
      <div className="w-full px-4 py-3 space-y-2 lg:text-base md:text-sm sm:text-xs text-xs">
        {/* Voucher Section */}
        <div className="flex items-center gap-4 justify-end border-b border-primary/20 py-1">
          <div className="flex items-center gap-2">
            <Ticket className="text-red-500" />
            <span>
              {ProjectInformationEnum.name} {t('cart.voucher')}
            </span>
          </div>
          <VoucherDialog
            triggerComponent={
              <Button variant="link" className="text-blue-500 h-auto p-0 hover:no-underline">
                {chosenVoucher ? chosenVoucher : t('cart.selectVoucher')}
              </Button>
            }
            onConfirmVoucher={setChosenVoucher}
            selectedCartItems={selectedCartItems}
          />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between space-y-2">
          {/* Left Section */}
          <div className="w-full md:w-1/3 justify-start flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox checked={isAllSelected} onClick={onCheckAll} id="select-all" />
              <label htmlFor="select-all" className="text-sm">
                {t('cart.selectAll')} ({cartItemCountAll})
              </label>
            </div>
            <Button variant="destructive" className="">
              <Trash2 className="w-4 h-4 mr-1" />
              <span>{t('cart.deleteAll')}</span>
            </Button>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-2/3 flex items-center gap-6">
            {/* Total Section */}
            <div className="w-full justify-end flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {t('cart.total')} ({cartItemCount} {t('cart.products')} ):
                  </span>
                  <span className="text-xl font-medium text-red-500">
                    {t('productCard.price', { price: totalPrice })}
                  </span>
                </div>
                <div className="text-sm text-end">
                  {t('cart.saved')}:
                  <span className="text-sm text-red-500"> {t('productCard.price', { price: savedPrice })}</span>
                </div>
              </div>
              <Link
                to={configs.routes.checkout}
                className="text-destructive-foreground px-8 py-2 rounded-lg bg-destructive hover:bg-destructive/80"
              >
                {t('cart.buy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
