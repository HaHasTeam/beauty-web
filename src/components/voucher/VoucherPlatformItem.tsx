import { AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { DiscountTypeEnum, VoucherApplyTypeEnum } from '@/types/enum'
import { TVoucher } from '@/types/voucher'

import StatusTag from '../status-tag/StatusTag'
import { RadioGroupItem } from '../ui/radio-group'
import VoucherInformationPopup from './VoucherInformationPopUp'

interface VoucherPlatformItemProps {
  voucher: TVoucher
  selectedCartItems?: string[]
}
const VoucherPlatformItem = ({ voucher, selectedCartItems }: VoucherPlatformItemProps) => {
  const { t } = useTranslation()
  return (
    <div key={voucher.id} className="relative">
      <div className="flex gap-4 p-2 md:p-4 border rounded-lg min-h-44">
        {/* Left Section */}
        <div className={`w-32 bg-primary p-4 rounded-lg flex flex-col items-center justify-center text-center`}>
          <div className="mt-2 text-sm font-medium uppercase text-primary-foreground">{voucher.name.toUpperCase()}</div>
        </div>

        {/* Content Section */}
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex text-lg font-medium gap-2">
                <span className="w-fit">
                  {voucher?.discountType === DiscountTypeEnum.PERCENTAGE
                    ? t('voucher.off.percentage', { percentage: voucher?.discountValue * 100 })
                    : t('voucher.off.amount', { amount: voucher?.discountValue })}
                </span>

                <VoucherInformationPopup voucher={voucher} applyFor="platform" className="flex items-start" />
              </div>
              {voucher?.maxDiscount && (
                <div className="w-fit text-base">{t('voucher.off.maxDiscount', { amount: voucher?.maxDiscount })}</div>
              )}
              {voucher?.minOrderValue && (
                <div className="w-fit text-base">{t('voucher.off.minOrder', { amount: voucher?.minOrderValue })}</div>
              )}

              {voucher?.applyType === VoucherApplyTypeEnum.SPECIFIC && (
                <span className="inline-block border border-red-500 text-red-500 text-xs px-2 py-0.5 rounded mt-1">
                  {t('voucher.off.specific')}
                </span>
              )}
            </div>
            <div className="absolute -top-3 -right-1">
              <StatusTag tag="numberCount" text="x100" />
            </div>
          </div>
          <div className="flex gap-1 mt-2 text-sm text-muted-foreground">
            Đã dùng x%,
            <div className="mt-1 text-xs text-muted-foreground">
              {t('date.exp')}: {t('date.toLocaleDateTimeString', { val: new Date(voucher?.endTime) })}
            </div>
          </div>
        </div>

        {/* Radio Item */}
        <div className="flex items-center gap-2">
          <RadioGroupItem value={voucher.id} id={voucher.id} />
        </div>
      </div>

      {/* Warning Message */}
      {selectedCartItems?.length === 0 && (
        <div className="mt-1 flex items-center gap-2 text-sm text-red-500 bg-red-50 p-2 rounded">
          <AlertCircle className="w-4 h-4" />
          {t('voucher.chooseProductAppAlert')}
        </div>
      )}
    </div>
  )
}

export default VoucherPlatformItem
