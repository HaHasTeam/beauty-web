import { useMutation } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
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
import { RadioGroup } from '@/components/ui/radio-group'
import useHandleServerError from '@/hooks/useHandleServerError'
import { getCheckoutListPlatformVouchersApi } from '@/network/apis/voucher'
import { ICartByBrand } from '@/types/cart'
import { ProjectInformationEnum, VoucherUsedStatusEnum } from '@/types/enum'
import { ICheckoutItem, IPlatformBestVoucher, TVoucher } from '@/types/voucher'

import Empty from '../empty/Empty'
import VoucherHelpPopOver from '../help/VoucherHelpDialog'
import LoadingIcon from '../loading-icon'
import { ScrollArea } from '../ui/scroll-area'
import VoucherPlatformItem from './VoucherPlatformItem'

interface VoucherDialogProps {
  triggerComponent: React.ReactElement<unknown>
  onConfirmVoucher: (voucher: TVoucher | null) => void
  selectedCartItems?: string[]
  chosenPlatformVoucher: TVoucher | null
  cartByBrand: ICartByBrand
  bestPlatFormVoucher: IPlatformBestVoucher | null
}
export default function VoucherDialog({
  triggerComponent,
  onConfirmVoucher,
  selectedCartItems,
  chosenPlatformVoucher,
  cartByBrand,
  bestPlatFormVoucher,
}: VoucherDialogProps) {
  const { t } = useTranslation()
  const handleServerError = useHandleServerError()
  const [open, setOpen] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState<string>(chosenPlatformVoucher?.id ?? '')
  const [unclaimedVouchers, setUnclaimedVouchers] = useState<TVoucher[]>([])
  const [availableVouchers, setAvailableVouchers] = useState<TVoucher[]>([])
  const [unAvailableVouchers, setUnAvailableVouchers] = useState<TVoucher[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const checkoutItems: ICheckoutItem[] = Object.values(cartByBrand)
    .flat()
    .map((cartItem) => ({
      classificationId: cartItem.productClassification?.id ?? '',
      quantity: cartItem.quantity ?? 0,
    }))
    .filter((item) => item.classificationId !== '')

  const selectedCheckoutItems: ICheckoutItem[] = Object.values(cartByBrand)
    .flat()
    .filter((cartItem) => selectedCartItems?.includes(cartItem?.id)) // Filter selected cart items
    .map((cartItem) => ({
      classificationId: cartItem.productClassification?.id ?? '',
      quantity: cartItem.quantity ?? 0,
    }))
    .filter((item) => item.classificationId !== '')

  const { mutateAsync: callPlatformVouchersFn } = useMutation({
    mutationKey: [getCheckoutListPlatformVouchersApi.mutationKey],
    mutationFn: getCheckoutListPlatformVouchersApi.fn,
    onSuccess: (data) => {
      console.log(data)
      setUnclaimedVouchers(data?.data?.unclaimedVouchers)
      setAvailableVouchers(data?.data?.availableVouchers)
      setUnAvailableVouchers(data?.data?.unAvailableVouchers)
      setIsLoading(false)
    },
  })

  const handleConfirm = () => {
    if (selectedVoucher) {
      onConfirmVoucher(availableVouchers?.find((voucher) => voucher?.id === selectedVoucher) ?? null)
    }
    setOpen(false) // Close the dialog
  }
  async function handleCallPlatformVouchers() {
    try {
      if (checkoutItems && checkoutItems?.length > 0) {
        setIsLoading(true)
        await callPlatformVouchersFn({
          checkoutItems:
            selectedCheckoutItems && selectedCheckoutItems?.length > 0 ? selectedCheckoutItems : checkoutItems,
          brandItems:
            selectedCheckoutItems && selectedCheckoutItems?.length > 0 ? selectedCheckoutItems : checkoutItems,
        })
      }
    } catch (error) {
      handleServerError({ error })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!selectedCartItems || selectedCartItems?.length === 0) {
      setSelectedVoucher('')
    }
  }, [selectedCartItems])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => handleCallPlatformVouchers()}>
        {triggerComponent}
      </DialogTrigger>
      <DialogContent className="max-w-3xl md:max-w-xl xs:max-w-lg">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{t('voucher.chooseVoucher', { projectName: ProjectInformationEnum.name })}</DialogTitle>
            <VoucherHelpPopOver />
          </div>
          <DialogDescription className="text-start"> {t('voucher.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            {/* Warning Message */}
            {selectedCartItems?.length === 0 && (
              <div className="mb-1 flex items-center gap-2 text-sm text-red-500 bg-red-100 p-2 rounded">
                <AlertCircle className="w-4 h-4" />
                {t('voucher.chooseProductAppAlert')}
              </div>
            )}
            {/* Voucher Input */}
            <div className="flex gap-2 bg-muted/50 p-2 md:p-4 rounded-lg items-center">
              <label className="text-sm font-medium mb-1.5 block"> {t('voucher.title')}</label>
              <Input placeholder={t('voucher.title')} className=" border border-gray-300 focus:border-primary/50" />
              <Button className="self-end uppercase"> {t('voucher.apply')}</Button>
            </div>
          </div>

          {/* Voucher List */}

          {isLoading ? (
            <div className="h-36 flex justify-center items-center">
              <LoadingIcon color="primaryBackground" />
            </div>
          ) : (availableVouchers && availableVouchers?.length > 0) ||
            (unAvailableVouchers && unAvailableVouchers?.length > 0) ||
            (unclaimedVouchers && unclaimedVouchers?.length > 0) ? (
            <ScrollArea className="h-72">
              <div className="px-3 py-2 my-2">
                <RadioGroup value={selectedVoucher} onValueChange={setSelectedVoucher}>
                  <div className="space-y-4">
                    {availableVouchers?.map((voucher) => (
                      <VoucherPlatformItem
                        voucher={voucher}
                        selectedCartItems={selectedCartItems}
                        key={voucher?.id}
                        bestVoucherForPlatform={bestPlatFormVoucher}
                        selectedVoucher={chosenPlatformVoucher?.id ?? ''}
                        onCollectSuccess={handleCallPlatformVouchers}
                        status={VoucherUsedStatusEnum.AVAILABLE}
                      />
                    ))}
                    {unAvailableVouchers?.map((voucher) => (
                      <VoucherPlatformItem
                        voucher={voucher}
                        selectedCartItems={selectedCartItems}
                        key={voucher?.id}
                        bestVoucherForPlatform={bestPlatFormVoucher}
                        selectedVoucher={chosenPlatformVoucher?.id ?? ''}
                        onCollectSuccess={handleCallPlatformVouchers}
                        status={VoucherUsedStatusEnum.UNAVAILABLE}
                      />
                    ))}
                    {unclaimedVouchers?.map((voucher) => (
                      <VoucherPlatformItem
                        voucher={voucher}
                        selectedCartItems={selectedCartItems}
                        key={voucher?.id}
                        bestVoucherForPlatform={bestPlatFormVoucher}
                        selectedVoucher={chosenPlatformVoucher?.id ?? ''}
                        onCollectSuccess={handleCallPlatformVouchers}
                        status={VoucherUsedStatusEnum.UNCLAIMED}
                      />
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
