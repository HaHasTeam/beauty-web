import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import { collectVoucherApi } from '@/network/apis/voucher'
import { DiscountTypeEnum, VoucherApplyTypeEnum, VoucherUsedStatusEnum } from '@/types/enum'
import { IBrandBestVoucher, TVoucher } from '@/types/voucher'

import Button from '../button'
import StatusTag from '../status-tag/StatusTag'
import { CardContent } from '../ui/card'
import { RadioGroupItem } from '../ui/radio-group'
import VoucherInformationPopup from './VoucherInformationPopUp'
import VoucherWarning from './VoucherWarning'

interface VoucherCartItemProps {
  voucher: TVoucher
  brandLogo: string
  brandName: string
  hasBrandProductSelected: boolean
  selectedVoucher: string
  onCollectSuccess?: () => void
  status?: VoucherUsedStatusEnum.AVAILABLE | VoucherUsedStatusEnum.UNAVAILABLE | VoucherUsedStatusEnum.UNCLAIMED
  bestVoucherForBrand: IBrandBestVoucher
}
const VoucherCartItem = ({
  voucher,
  brandLogo,
  brandName,
  hasBrandProductSelected,
  selectedVoucher,
  status,
  onCollectSuccess,
  bestVoucherForBrand,
}: VoucherCartItemProps) => {
  const { t } = useTranslation()
  const [isCollecting, setIsCollecting] = useState(false)
  const handleServerError = useHandleServerError()
  const { successToast } = useToast()

  const { mutateAsync: collectVoucherFn } = useMutation({
    mutationKey: [collectVoucherApi.mutationKey],
    mutationFn: collectVoucherApi.fn,
    onSuccess: async (data) => {
      console.log(data)
      setIsCollecting(false)
      try {
        successToast({
          message: t('voucher.collectSuccess'),
        })
        if (onCollectSuccess) {
          onCollectSuccess() // Trigger the parent callback
        }
      } catch (error) {
        handleServerError({ error })
      }
    },
    onError: (error) => {
      setIsCollecting(false)
      handleServerError({ error })
    },
  })
  async function handleCollectVoucher() {
    try {
      setIsCollecting(true)
      await collectVoucherFn(voucher)
    } catch (error) {
      setIsCollecting(false)
      handleServerError({ error })
    }
  }
  return (
    <div className="space-y-1">
      <div className="border border-gray-200 rounded-lg shadow-md relative">
        {bestVoucherForBrand?.bestVoucher?.id === voucher?.id && (
          <div className="absolute left-0 -top-2">
            <StatusTag tag="BestVoucher" />
          </div>
        )}
        <CardContent
          className={cn(
            'px-2 py-4 relative',
            status === VoucherUsedStatusEnum.UNAVAILABLE ? 'opacity-50 cursor-default' : '',
          )}
        >
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
                    <p className="text-base font-medium flex items-start flex-wrap gap-1">
                      <span className="w-fit">
                        {voucher?.discountType === DiscountTypeEnum.PERCENTAGE
                          ? t('voucher.off.percentage', { percentage: voucher?.discountValue * 100 }) + '. '
                          : t('voucher.off.amount', { amount: voucher?.discountValue }) + '. '}
                      </span>
                      {voucher?.maxDiscount && (
                        <span className="w-fit">
                          {t('voucher.off.maxDiscount', { amount: voucher?.maxDiscount }) + '. '}
                        </span>
                      )}
                    </p>
                    <VoucherInformationPopup voucher={voucher} className="flex items-start" />
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

            {status === VoucherUsedStatusEnum?.UNCLAIMED ? (
              <Button
                className="bg-primary hover:bg-primary/80"
                onClick={() => {
                  handleCollectVoucher()
                }}
                loading={isCollecting}
              >
                {t('button.save')}
              </Button>
            ) : (
              (status === VoucherUsedStatusEnum?.UNAVAILABLE || status === VoucherUsedStatusEnum?.AVAILABLE) && (
                <RadioGroupItem
                  value={voucher?.id}
                  id={voucher?.id}
                  checked={voucher?.id === selectedVoucher}
                  disabled={!hasBrandProductSelected || status === VoucherUsedStatusEnum?.UNAVAILABLE}
                />
              )
            )}
          </div>

          {/* Warning Message */}
        </CardContent>
      </div>
      {status === VoucherUsedStatusEnum?.UNAVAILABLE && (
        <VoucherWarning reason={voucher?.reason} minOrderValue={voucher?.minOrderValue} />
      )}
    </div>
  )
}

export default VoucherCartItem
