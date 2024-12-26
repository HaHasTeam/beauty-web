import { AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { ScrollArea } from '@/components/ui/scroll-area'
import { DiscountTypeEnum, VoucherApplyTypeEnum } from '@/types/enum'
import { TVoucher } from '@/types/voucher'

import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

interface VoucherInformationPopupProps {
  voucher: TVoucher
  className?: string
}
export default function VoucherInformationPopup({ voucher, className }: VoucherInformationPopupProps) {
  const { t } = useTranslation()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`bg-transparent hover:bg-transparent text-muted-foreground p-0 m-0 hover:text-gray-300 ${className}`}
        >
          <AlertCircle className="w-4 h-4 text-gray-600" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 bg-white">
        <ScrollArea className="max-h-[80vh]">
          <h3 className="font-semibold text-center text-lg">{t('voucher.informationTitle')}</h3>
          <div className="space-y-2">
            <div>
              <span className="font-medium">{t('voucher.discount')}</span>
              <p>
                {voucher?.discountType === DiscountTypeEnum.PERCENTAGE
                  ? t('voucher.off.percentage', { amount: voucher?.discountValue })
                  : t('voucher.off.amount', { amount: voucher?.discountValue })}
                {voucher?.maxDiscount && (
                  <span>. {t('voucher.off.maxDiscount', { amount: voucher?.maxDiscount })}. </span>
                )}
                {voucher?.minOrderValue && (
                  <span>{t('voucher.off.minOrder', { amount: voucher?.minOrderValue })}.</span>
                )}
              </p>
            </div>
            <div>
              <span className="font-medium">{t('date.expiredDate')}</span>
              <p>
                {t('date.toLocaleDateTimeString', { val: new Date(voucher?.startTime) })} -{' '}
                {t('date.toLocaleDateTimeString', { val: new Date(voucher?.endTime) })}
              </p>
            </div>
            <div>
              <span className="font-medium">{t('voucher.nameTitle')}</span>
              <p>{voucher?.name}</p>
            </div>
            <div>
              <span className="font-medium">{t('voucher.descriptionTitle')}</span>
              <p>{voucher?.description}</p>
            </div>
            <div>
              <span className="font-medium">{t('voucher.applicableProducts')}</span>
              <p>
                {voucher?.applyType === VoucherApplyTypeEnum.SPECIFIC
                  ? t('voucher.off.specificDescription')
                  : t('voucher.off.allDescription')}
              </p>
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
