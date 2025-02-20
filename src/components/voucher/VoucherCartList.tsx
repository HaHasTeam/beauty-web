import { useMutation } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useHandleServerError from '@/hooks/useHandleServerError'
import { getCheckoutListBrandVouchersApi } from '@/network/apis/voucher'
import { VoucherUsedStatusEnum } from '@/types/enum'
import { IBrandBestVoucher, ICheckoutItem, TVoucher } from '@/types/voucher'

import Empty from '../empty/Empty'
import LoadingIcon from '../loading-icon'
import { RadioGroup } from '../ui/radio-group'
import { ScrollArea } from '../ui/scroll-area'
import VoucherCartItem from './VoucherCartItem'

interface VoucherCartListProps {
  triggerText: string
  brandName: string
  brandId: string
  brandLogo: string
  hasBrandProductSelected: boolean
  checkoutItems: ICheckoutItem[]
  selectedCheckoutItems: ICheckoutItem[]
  handleVoucherChange: (voucher: TVoucher | null) => void
  bestVoucherForBrand: IBrandBestVoucher
  chosenBrandVoucher: TVoucher | null
}
const VoucherCartList = ({
  triggerText,
  brandName,
  brandId,
  brandLogo,
  hasBrandProductSelected,
  handleVoucherChange,
  checkoutItems,
  bestVoucherForBrand,
  selectedCheckoutItems,
  chosenBrandVoucher,
}: VoucherCartListProps) => {
  const { t } = useTranslation()
  const handleServerError = useHandleServerError()
  const [open, setOpen] = useState<boolean>(false)
  const [selectedVoucher, setSelectedVoucher] = useState<string>(chosenBrandVoucher?.id ?? '')
  const [unclaimedVouchers, setUnclaimedVouchers] = useState<TVoucher[]>([])
  const [availableVouchers, setAvailableVouchers] = useState<TVoucher[]>([])
  const [unAvailableVouchers, setUnAvailableVouchers] = useState<TVoucher[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // const { data: useBrandVoucher } = useQuery({
  //   queryKey: [getBrandVouchersApi.queryKey, brandId as string],
  //   queryFn: getBrandVouchersApi.fn,
  // })

  const { mutateAsync: callBrandVouchersFn } = useMutation({
    mutationKey: [getCheckoutListBrandVouchersApi.mutationKey],
    mutationFn: getCheckoutListBrandVouchersApi.fn,
    onSuccess: (data) => {
      console.log(data)
      setUnclaimedVouchers(data?.data?.unclaimedVouchers)
      setAvailableVouchers(data?.data?.availableVouchers)
      setUnAvailableVouchers(data?.data?.unAvailableVouchers)
      setIsLoading(false)
    },
  })

  const handleConfirm = () => {
    handleVoucherChange(availableVouchers?.find((voucher) => voucher?.id === selectedVoucher) ?? null)
    setOpen(false)
  }

  async function handleCallBrandVouchers() {
    try {
      if (checkoutItems && checkoutItems?.length > 0) {
        setIsLoading(true)
        await callBrandVouchersFn({
          checkoutItems:
            selectedCheckoutItems && selectedCheckoutItems?.length > 0 ? selectedCheckoutItems : checkoutItems,
          brandItems:
            selectedCheckoutItems && selectedCheckoutItems?.length > 0 ? selectedCheckoutItems : checkoutItems,
          brandId: brandId,
        })
      }
    } catch (error) {
      handleServerError({ error })
      setIsLoading(false)
    }
  }

  // useEffect(() => {
  //   if (useBrandVoucher && useBrandVoucher?.data?.length > 0) {
  //     console.log(useBrandVoucher?.data)
  //     setBrandVouchers(useBrandVoucher?.data)
  //   }
  // }, [useBrandVoucher])

  useEffect(() => {
    if (!hasBrandProductSelected) {
      setSelectedVoucher('')
    }
  }, [hasBrandProductSelected])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span
          className="text-blue-700 hover:cursor-pointer"
          onClick={() => {
            handleCallBrandVouchers()
          }}
        >
          {triggerText}
        </span>
      </PopoverTrigger>
      <PopoverContent className="md:w-[550px] w-[320px] bg-white">
        <div className="w-full md:p-2 p-0">
          <h2 className="text-xl font-medium mb-4">
            {brandName} {t('voucher.title')}
          </h2>
          {!hasBrandProductSelected && (
            <div className="mb-1 flex items-center gap-2 text-sm text-red-500 bg-red-100 p-2 rounded">
              <AlertCircle className="w-4 h-4" />
              {t('voucher.chooseProductBrandAlert')}
            </div>
          )}
          {/* Voucher Input */}
          <div className="md:flex-row flex-col flex gap-2 mb-6 bg-secondary/40 p-2 rounded-lg md:items-center items-start">
            <label
              htmlFor="voucherInput"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t('voucher.title')}
            </label>
            <div className="flex gap-2 w-full">
              <Input id="voucherInput" placeholder={t('voucher.input')} className="bg-white" />
              <Button variant="outline" className="w-24">
                {t('voucher.apply')}
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="h-36 flex justify-center items-center">
              <LoadingIcon color="primaryBackground" />
            </div>
          ) : (availableVouchers && availableVouchers?.length > 0) ||
            (unAvailableVouchers && unAvailableVouchers?.length > 0) ||
            (unclaimedVouchers && unclaimedVouchers?.length > 0) ? (
            // <ScrollArea className="h-52 px-2">
            <div className="space-y-2">
              <ScrollArea className="h-56">
                <RadioGroup value={selectedVoucher} onValueChange={setSelectedVoucher}>
                  <div className="my-2 space-y-3">
                    {availableVouchers?.map((voucher) => (
                      <VoucherCartItem
                        key={voucher.id}
                        voucher={voucher}
                        brandLogo={brandLogo}
                        brandName={brandName}
                        hasBrandProductSelected={hasBrandProductSelected}
                        selectedVoucher={selectedVoucher}
                        status={VoucherUsedStatusEnum?.AVAILABLE}
                        onCollectSuccess={handleCallBrandVouchers}
                        bestVoucherForBrand={bestVoucherForBrand}
                      />
                    ))}
                    {unAvailableVouchers?.map((voucher) => (
                      <VoucherCartItem
                        key={voucher.id}
                        voucher={voucher}
                        brandLogo={brandLogo}
                        brandName={brandName}
                        hasBrandProductSelected={hasBrandProductSelected}
                        selectedVoucher={selectedVoucher}
                        status={VoucherUsedStatusEnum?.UNAVAILABLE}
                        onCollectSuccess={handleCallBrandVouchers}
                        bestVoucherForBrand={bestVoucherForBrand}
                      />
                    ))}
                    {unclaimedVouchers?.map((voucher) => (
                      <VoucherCartItem
                        key={voucher.id}
                        voucher={voucher}
                        brandLogo={brandLogo}
                        brandName={brandName}
                        hasBrandProductSelected={hasBrandProductSelected}
                        selectedVoucher={selectedVoucher}
                        status={VoucherUsedStatusEnum?.UNCLAIMED}
                        onCollectSuccess={handleCallBrandVouchers}
                        bestVoucherForBrand={bestVoucherForBrand}
                      />
                    ))}
                  </div>
                </RadioGroup>
              </ScrollArea>
              <div className="flex justify-end gap-2 w-full shadow-inner pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  {t('dialog.cancel')}
                </Button>
                <Button onClick={handleConfirm} disabled={!hasBrandProductSelected}>
                  {t('dialog.ok')}
                </Button>
              </div>
            </div>
          ) : (
            // </ScrollArea>
            <div className="flex flex-col justify-center items-center">
              <Empty title={t('empty.brandVoucher.title')} description={t('empty.brandVoucher.description')} />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default VoucherCartList
