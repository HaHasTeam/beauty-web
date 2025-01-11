import { ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

import productImage from '@/assets/images/product_sample_img.png'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { IPreOrder } from '@/types/pre-order'
import { formatDate } from '@/utils'

import { Countdown } from '../countDown/CountDown'
import ImageWithFallback from '../ImageFallback'
import ProductTag from './ProductTag'

interface ProductCardProps {
  preOrderProduct: IPreOrder
}
export default function PreOrderProductCard({ preOrderProduct }: ProductCardProps) {
  const [isReleaseDay, setIsReleaseDay] = useState(false)
  const releaseDate = '2025-01-15T00:00:00'

  useEffect(() => {
    const checkReleaseDay = () => {
      const now = new Date()
      const release = new Date(preOrderProduct.startTime)
      console.log(
        'formatDate',
        formatDate(preOrderProduct.startTime, {
          month: 'numeric',
        }),
      )

      setIsReleaseDay(now >= release)
    }

    checkReleaseDay()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card className="max-w-2xl mx-auto relative overflow-hidden">
      <div className="absolute top-3 left-3 z-10">{preOrderProduct.status && <ProductTag tag={'PRE_ORDER'} />}</div>
      <CardContent className="p-0 relative">
        <div className="relative ">
          <ImageWithFallback
            src={preOrderProduct.productClassifications[0]?.images[0]?.fileUrl}
            fallback={productImage}
            className="object-cover w-full  rounded-tl-xl rounded-tr-xl aspect-square"
          />
        </div>

        <div className="space-y-6 p-4">
          <h2 className="text-lg font-bold line-clamp-2">Tai Nghe Không Dây MINISO G90 - Công Nghệ Mới</h2>

          <div className=" text-center">
            <div className="flex items-center gap-2 flex-col justify-center text-muted-foreground">
              <span>Dự kiến ra mắt:</span>
              <span className="font-semibold">0 GIỜ SÁNG</span>
            </div>
            <div className="text-lg font-semibold">15/01/2025</div>
          </div>

          {!isReleaseDay ? (
            <Countdown targetDate={releaseDate} language="vi" />
          ) : (
            <Button className="w-full h-12 text-lg bg-emerald-500 hover:bg-emerald-600">Pre-order Now</Button>
          )}

          {!isReleaseDay && (
            <Button className="w-full h-12 text-lg">
              <ChevronRight className="w-5 h-5 mr-2" />
              Tìm Hiểu thêm
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
