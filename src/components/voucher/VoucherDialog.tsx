import { useQuery } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { getPlatformVouchersApi } from '@/network/apis/voucher'
import { DiscountTypeEnum, ProjectInformationEnum, VoucherApplyTypeEnum } from '@/types/enum'
import { TVoucher } from '@/types/voucher'

import Empty from '../empty/Empty'
import VoucherHelpPopOver from '../help/VoucherHelpDialog'
import LoadingIcon from '../loading-icon'
import { ScrollArea } from '../ui/scroll-area'
import VoucherInformationPopup from './VoucherInformationPopUp'

interface VoucherDialogProps {
  triggerComponent: React.ReactElement<unknown>
  onConfirmVoucher: (voucher: TVoucher | null) => void
  selectedCartItems?: string[]
}
export default function VoucherDialog({ triggerComponent, onConfirmVoucher, selectedCartItems }: VoucherDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState<string>('')

  const { data: platformVouchersData, isFetching } = useQuery({
    queryKey: [getPlatformVouchersApi.queryKey],
    queryFn: getPlatformVouchersApi.fn,
  })
  const handleConfirm = () => {
    if (selectedVoucher) {
      onConfirmVoucher(platformVouchersData?.data?.find((voucher) => voucher?.id === selectedVoucher) ?? null)
    }
    setOpen(false) // Close the dialog
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      <DialogContent className="max-w-3xl md:max-w-xl xs:max-w-lg">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{t('voucher.chooseVoucher', { projectName: ProjectInformationEnum.name })}</DialogTitle>
            <VoucherHelpPopOver />
          </div>
          <DialogDescription className="text-start"> {t('voucher.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Voucher Input */}
          <div className="flex gap-2 bg-muted/50 p-2 md:p-4 rounded-lg items-center">
            <label className="text-sm font-medium mb-1.5 block"> {t('voucher.title')}</label>
            <Input placeholder={t('voucher.title')} className=" border border-gray-300 focus:border-primary/50" />
            <Button className="self-end uppercase"> {t('voucher.apply')}</Button>
          </div>

          {/* Voucher List */}
          {isFetching ? (
            <div className="h-36 flex justify-center items-center">
              <LoadingIcon color="primaryBackground" />
            </div>
          ) : platformVouchersData && platformVouchersData?.data && platformVouchersData?.data?.length > 0 ? (
            <ScrollArea className="h-72">
              <div className="px-3 py-2">
                <RadioGroup value={selectedVoucher} onValueChange={setSelectedVoucher}>
                  <div className="space-y-4">
                    {platformVouchersData?.data?.map((voucher) => (
                      <div key={voucher.id} className="relative">
                        <div className="flex gap-4 p-2 md:p-4 border rounded-lg">
                          {/* Left Section */}
                          <div
                            className={`w-32 bg-primary p-4 rounded-lg flex flex-col items-center justify-center text-center`}
                          >
                            <div className="mt-2 text-sm font-medium uppercase text-primary-foreground">
                              {voucher.name.toUpperCase()}
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-lg font-medium">
                                  <span className="w-fit">
                                    {voucher?.discountType === DiscountTypeEnum.PERCENTAGE
                                      ? t('voucher.off.percentage', { percentage: voucher?.discountValue * 100 }) + '. '
                                      : t('voucher.off.amount', { amount: voucher?.discountValue }) + '. '}
                                  </span>
                                </div>
                                {voucher?.maxDiscount && (
                                  <div className="text-sm text-muted-foreground">
                                    {t('voucher.off.maxDiscount', { amount: voucher?.maxDiscount }) + '. '}
                                  </div>
                                )}
                                <VoucherInformationPopup voucher={voucher} className="flex items-start" />
                                {voucher?.minOrderValue && (
                                  <div className="text-base">
                                    {t('voucher.off.minOrder', { amount: voucher?.minOrderValue })}
                                  </div>
                                )}

                                {voucher?.applyType === VoucherApplyTypeEnum.SPECIFIC && (
                                  <span className="inline-block border border-red-500 text-red-500 text-xs px-2 py-0.5 rounded mt-1">
                                    {t('voucher.off.specific')}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-red-500">×usesageCount</span>
                                <RadioGroupItem value={voucher.id} id={voucher.id} />
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                              Đã dùng xx%,
                              <div className="mt-1 text-xs text-muted-foreground">
                                {t('date.exp')}: {t('date.toLocaleDateTimeString', { val: new Date(voucher?.endTime) })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Warning Message */}
                        {selectedCartItems?.length === 0 && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-red-500">
                            <AlertCircle className="w-4 h-4" />
                            {t('voucher.chooseProductAppAlert')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <Empty
                title={t('empty.platformVoucher.title')}
                description={t('empty.platformVoucher.description', { platformName: ProjectInformationEnum.name })}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex justify-end gap-2 w-full">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('dialog.cancel')}
            </Button>
            <Button onClick={handleConfirm} disabled={selectedCartItems?.length === 0}>
              {t('dialog.ok')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
