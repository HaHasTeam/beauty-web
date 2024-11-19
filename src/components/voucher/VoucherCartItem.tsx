import { AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '../ui/button'
import { CardContent } from '../ui/card'
import { RadioGroupItem } from '../ui/radio-group'

interface VoucherCartItemProps {
  discount: string
  minimum?: number
  saved: boolean
  expiredDate: string
  tag: string | null
  brandLogo: string
  voucherId: string
}
const VoucherCartItem = ({
  discount,
  minimum,
  saved,
  expiredDate,
  tag,
  brandLogo,
  voucherId,
}: VoucherCartItemProps) => {
  const { t } = useTranslation()
  return (
    <div className="border border-gray-100 rounded-lg shadow-md">
      <CardContent className="p-2">
        <div className="flex gap-2 items-center">
          {/* Logo Section */}
          <div className="w-14 h-14">
            <img src={brandLogo} alt="Brand logo" className="w-full h-full object-contain" />
          </div>
          {/* Content Section */}
          <div className="flex-1 items-center">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-lg font-medium">Giảm {discount}</div>
                {minimum && <div className="text-sm"> Đơn Tối Thiểu {minimum}đ </div>}
                <span className="inline-block border border-red-500 text-red-500 text-xs px-2 py-0.5 rounded mt-1">
                  {tag}
                </span>
              </div>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {t('date.expiredDate')}: {t('date.toLocaleDateString', { val: expiredDate })}
              <span className="text-blue-500 p-0 h-auto text-sm ml-2">{t('voucher.condition')}</span>
            </div>
          </div>
          {saved ? (
            <RadioGroupItem value={voucherId} id={voucherId} />
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
