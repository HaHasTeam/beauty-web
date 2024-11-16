import { CircleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import ProductTag from './ProductTag'

interface PriceSectionProps {
  price: number
  currentPrice: number
  deal: number
}
const PriceSection = ({ price, currentPrice, deal }: PriceSectionProps) => {
  const { t } = useTranslation()
  return (
    <div className="flex gap-1">
      <div className="flex items-center gap-2">
        <span className="text-red-500 text-2xl font-medium">{currentPrice}đ</span>
        <ProductTag tag="DealPercent" text={deal * 100 + '%'} />
        <span className="text-gray-400 text-sm line-through">{price}đ</span>
      </div>
      <HoverCard>
        <HoverCardTrigger asChild>
          <CircleAlert className="text-gray-400 h-4 w-4" />
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="bg-red-50/50 p-4 rounded-lg max-w-md">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">{t('productDetail.priceDetail')}</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá gốc</span>
                  <span className="text-red-500">{price}đ</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Giảm giá sản phẩm</span>
                  <span className="text-red-500">-đ801.000</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Voucher của Shop</span>
                    <span className="text-red-500">-đ50.000</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    Mua từ đ399.000 để được giảm đ50.000. Số lượng Voucher có hạn
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900">Giá tạm tính (khi áp dụng các Voucher trên)</span>
                  <span className="text-red-500 font-medium">{currentPrice}đ</span>
                </div>
                <p className="text-gray-500 text-sm mt-2 italic">
                  *Vui lòng thêm Voucher khi đặt hàng ở bước thanh toán để được giá như trên
                </p>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

export default PriceSection
