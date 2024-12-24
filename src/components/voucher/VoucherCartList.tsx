import { useQuery } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getBrandVouchersApi } from '@/network/apis/voucher'
import { TVoucher } from '@/types/voucher'

import Empty from '../empty/Empty'
import { RadioGroup } from '../ui/radio-group'
import { ScrollArea } from '../ui/scroll-area'
import VoucherCartItem from './VoucherCartItem'

interface VoucherCartListProps {
  triggerText: string
  brandName: string
  brandId: string
  brandLogo: string
  hasBrandProductSelected: boolean
  setChosenVoucher: Dispatch<SetStateAction<TVoucher | null>>
}
const VoucherCartList = ({
  triggerText,
  brandName,
  brandId,
  brandLogo,
  hasBrandProductSelected,
  setChosenVoucher,
}: VoucherCartListProps) => {
  const { t } = useTranslation()
  const [brandVouchers, setBrandVouchers] = useState<TVoucher[] | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [selectedVoucher, setSelectedVoucher] = useState<string>('')

  const { data: useBrandVouchersData } = useQuery({
    queryKey: [getBrandVouchersApi.queryKey, brandId],
    queryFn: getBrandVouchersApi.fn,
  })

  const handleConfirm = () => {
    setChosenVoucher(brandVouchers?.find((voucher) => voucher?.id === selectedVoucher) ?? null)
    setOpen(false)
  }

  useEffect(() => {
    if (useBrandVouchersData && useBrandVouchersData?.data) {
      setBrandVouchers(useBrandVouchersData?.data)
    }
  }, [useBrandVouchersData])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span className="text-blue-700 hover:cursor-pointer">{triggerText}</span>
      </PopoverTrigger>
      <PopoverContent className="md:w-[500px] w-[320px] bg-white">
        <div className="w-full md:p-2 p-0">
          <h2 className="text-xl font-medium mb-4">
            {brandName} {t('voucher.title')}
          </h2>

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

          {brandVouchers && brandVouchers?.length > 0 ? (
            // <ScrollArea className="h-52 px-2">
            <div className="space-y-2">
              <ScrollArea className="h-56">
                <RadioGroup value={selectedVoucher} onValueChange={setSelectedVoucher}>
                  {brandVouchers?.map((voucher) => (
                    <VoucherCartItem
                      key={voucher.id}
                      voucher={voucher}
                      brandLogo={brandLogo}
                      brandName={brandName}
                      hasBrandProductSelected={hasBrandProductSelected}
                      selectedVoucher={selectedVoucher}
                    />
                  ))}
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
