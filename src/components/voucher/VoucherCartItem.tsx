import { AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'

interface VoucherCartItemProps {
  discount: string
  minimum?: number
  saved: boolean
  expiredDate: string
  tag: string | null
  brandLogo: string
}
const VoucherCartItem = ({ discount, minimum, saved, expiredDate, tag, brandLogo }: VoucherCartItemProps) => {
  const { t } = useTranslation()
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-2">
        <div className="flex gap-2 items-center">
          {/* Logo Section */}
          <div className="w-14 h-14">
            <img src={brandLogo} alt="Brand logo" className="w-full h-full object-contain" />
          </div>
          {/* Content Section */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-lg font-medium">Giảm {discount}</div>
                {minimum && <div className="text-sm text-muted-foreground"> Đơn Tối Thiểu {minimum}đ </div>}
                <span className="inline-block border border-red-500 text-red-500 text-xs px-2 py-0.5 rounded mt-1">
                  {tag}
                </span>
              </div>
              {saved && <Button className="bg-red-500 hover:bg-red-600">Lưu</Button>}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {t('date.expiredDate')} {t('date.toLocaleDateString', { val: expiredDate })}
              <Button variant="link" className="text-blue-500 p-0 h-auto text-sm ml-2">
                {t('voucher.condition')}
              </Button>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="mt-3 flex items-center gap-2 text-sm text-red-500 bg-red-50 p-2 rounded">
          <AlertCircle className="w-4 h-4" />
          Vui lòng chọn sản phẩm từ Shop để áp dụng Voucher này
        </div>
      </CardContent>
    </Card>
  )
}

export default VoucherCartItem
