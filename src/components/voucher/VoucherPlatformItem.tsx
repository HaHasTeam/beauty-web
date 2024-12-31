import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import { collectVoucherApi } from '@/network/apis/voucher'
import { DiscountTypeEnum, VoucherApplyTypeEnum, VoucherUsedStatusEnum } from '@/types/enum'
import { IPlatformBestVoucher, TVoucher } from '@/types/voucher'

import Button from '../button'
import StatusTag from '../status-tag/StatusTag'
import { RadioGroupItem } from '../ui/radio-group'
import VoucherInformationPopup from './VoucherInformationPopUp'
import VoucherWarning from './VoucherWarning'

interface VoucherPlatformItemProps {
  voucher: TVoucher
  selectedCartItems?: string[]
  selectedVoucher: string
  onCollectSuccess?: () => void
  status?: VoucherUsedStatusEnum.AVAILABLE | VoucherUsedStatusEnum.UNAVAILABLE | VoucherUsedStatusEnum.UNCLAIMED
  bestVoucherForPlatform: IPlatformBestVoucher | null
}
const VoucherPlatformItem = ({
  voucher,
  selectedCartItems,
  bestVoucherForPlatform,
  selectedVoucher,
  onCollectSuccess,
  status,
}: VoucherPlatformItemProps) => {
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
      <div className={cn('relative', status === VoucherUsedStatusEnum.UNAVAILABLE ? 'opacity-50 cursor-default' : '')}>
        {bestVoucherForPlatform?.bestVoucher?.id === voucher?.id && (
          <div className="absolute -left-1 -top-3">
            <StatusTag tag="BestVoucher" />
          </div>
        )}
        <div className="flex gap-4 p-2 md:p-4 border rounded-lg min-h-44">
          {/* Left Section */}
          <div className={`w-32 bg-primary p-4 rounded-lg flex flex-col items-center justify-center text-center`}>
            <div className="mt-2 text-sm font-medium uppercase text-primary-foreground">
              {voucher.name.toUpperCase()}
            </div>
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
                  <div className="w-fit text-base">
                    {t('voucher.off.maxDiscount', { amount: voucher?.maxDiscount })}
                  </div>
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
          {status === VoucherUsedStatusEnum?.UNCLAIMED ? (
            <Button
              className="bg-primary hover:bg-primary/80 my-auto"
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
                className="my-auto"
                value={voucher?.id}
                id={voucher?.id}
                checked={voucher?.id === selectedVoucher}
                disabled={selectedCartItems?.length === 0 || status === VoucherUsedStatusEnum?.UNAVAILABLE}
              />
            )
          )}
          {/* <div className="flex items-center gap-2">
          <RadioGroupItem value={voucher.id} id={voucher.id} />
        </div> */}
        </div>
      </div>
      {status === VoucherUsedStatusEnum?.UNAVAILABLE && (
        <VoucherWarning reason={voucher?.reason} minOrderValue={voucher?.minOrderValue} />
      )}
    </div>
  )
}

export default VoucherPlatformItem
