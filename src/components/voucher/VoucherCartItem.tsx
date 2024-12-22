import { AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { DiscountTypeEnum, VoucherApplyTypeEnum, VoucherStatusEnum } from '@/types/enum'
import { TVoucher } from '@/types/voucher'

import { Button } from '../ui/button'
import { CardContent } from '../ui/card'
import { RadioGroupItem } from '../ui/radio-group'
import VoucherInformationPopup from './VoucherInformationPopUp'

interface VoucherCartItemProps {
  voucher: TVoucher
  brandLogo: string
  brandName: string
}
const VoucherCartItem = ({ voucher, brandLogo, brandName }: VoucherCartItemProps) => {
  const { t } = useTranslation()
  return (
    <div className="border border-gray-100 rounded-lg shadow-md">
      <CardContent className="p-2">
        <div className="flex gap-2 items-center">
          {/* Logo Section */}

          {brandLogo && brandLogo !== '' ? (
            <div className="w-14 h-14">
              <img src={brandLogo} alt="Brand logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <span className="text-lg font-bold uppercase">{brandName}</span>
            </div>
          )}

          {/* Content Section */}
          <div className="flex-1 items-center">
            <div className="flex justify-between items-start">
              <div className="w-full">
                <div className="flex gap-2">
                  <div className="text-lg font-medium flex">
                    {voucher?.discountType === DiscountTypeEnum.PERCENTAGE
                      ? t('voucher.off.percentage', { amount: voucher?.discountValue })
                      : t('voucher.off.amount', { amount: voucher?.discountValue })}
                    {voucher?.maxDiscount && (
                      <div className="text-lg">. {t('voucher.off.maxDiscount', { amount: voucher?.maxDiscount })}</div>
                    )}
                  </div>
                  <VoucherInformationPopup voucher={voucher} />
                </div>
                {voucher?.minOrderValue && (
                  <div className="text-base">{t('voucher.off.minOrder', { amount: voucher?.minOrderValue })}</div>
                )}

                {voucher?.applyType === VoucherApplyTypeEnum.SPECIFIC && (
                  <span className="inline-block border border-red-500 text-red-500 text-xs px-2 py-0.5 rounded mt-1">
                    {t('voucher.off.specific')}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {t('date.exp')}: {t('date.toLocaleDateTimeString', { val: new Date(voucher?.endTime) })}
            </div>
          </div>
          {voucher?.status !== VoucherStatusEnum.AVAILABLE || voucher?.status !== VoucherStatusEnum.UNAVAILABLE ? (
            <RadioGroupItem value={voucher?.id} id={voucher?.id} />
          ) : (
            <Button className="bg-red-500 hover:bg-red-600">Lưu</Button>
          )}
        </div>

        {/* Warning Message */}
      </CardContent>
      <div className="mt-1 flex items-center gap-2 text-sm text-red-500 bg-red-50 p-2 rounded">
        <AlertCircle className="w-4 h-4" />
        {t('voucher.chooseProductBrandAlert')}
      </div>
    </div>
  )
}

export default VoucherCartItem
