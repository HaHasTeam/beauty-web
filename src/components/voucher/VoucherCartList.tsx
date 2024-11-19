import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { RadioGroup } from '../ui/radio-group'
import { ScrollArea } from '../ui/scroll-area'
import VoucherCartItem from './VoucherCartItem'

interface VoucherCartListProps {
  triggerText: string
  brandName: string
}
const VoucherCartList = ({ triggerText, brandName }: VoucherCartListProps) => {
  const { t } = useTranslation()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="text-blue-700 hover:cursor-pointer">{triggerText}</span>
      </PopoverTrigger>
      <PopoverContent className="w-[500px]">
        <div className="w-full p-2">
          <h2 className="text-xl font-medium mb-4">{brandName} Voucher</h2>

          {/* Voucher Input */}
          <div className="flex gap-2 mb-6 bg-secondary/40 p-2 rounded-lg items-center">
            <label
              htmlFor="voucherInput"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t('voucher.title')}
            </label>
            <Input id="voucherInput" placeholder={t('voucher.input')} className="flex-1 bg-white" />
            <Button variant="outline" className="w-24">
              {t('voucher.apply')}
            </Button>
          </div>
          <ScrollArea className="h-52">
            <div className="py-2 space-y-2">
              <RadioGroup>
                {[
                  { id: '0', discount: '21k', minimum: '239k', saved: false },
                  { id: '1', discount: '20k', minimum: '900k', saved: true },
                  { id: '2', discount: '16k', minimum: '450k', saved: true },
                ].map((voucher) => (
                  <VoucherCartItem
                    key={voucher.id}
                    discount={'15000đ'}
                    minimum={15000}
                    saved={voucher.saved}
                    expiredDate={'2024-11-18 14:47:13'}
                    tag={'Sản phẩm nhất định'}
                    brandLogo="https://i.pinimg.com/736x/44/5b/54/445b54cf93d6399ea99944c5cb904402.jpg"
                    voucherId={voucher.id}
                  />
                ))}
              </RadioGroup>
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default VoucherCartList
