import { Ticket, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
  selectedProducts: string[]
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
  selectedProducts,
}: CartFooterProps) {
  const { t } = useTranslation()

  return (
    <div className="w-full sticky bottom-0 left-0 right-0 border-t bg-secondary rounded-tl-sm rounded-tr-sm">
      <div className="w-full px-4 py-3 space-y-2">
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
            selectedProducts={selectedProducts}
          />
        </div>
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-6">
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
          <div className="flex items-center gap-6">
            {/* Total Section */}
            <div className="flex items-center gap-4">
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
              <Button variant="destructive" className="px-8">
                {t('cart.checkout')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
