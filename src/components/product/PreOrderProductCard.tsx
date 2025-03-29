'use client'

import { ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import productImage from '@/assets/images/product_sample_img.png'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import configs from '@/config'
import type { IPreOrder } from '@/types/pre-order'
import { formatDate } from '@/utils'

import { Countdown } from '../countDown/CountDown'
import ImageWithFallback from '../ImageFallback'
import ProductTag from './ProductTag'

interface ProductCardProps {
  preOrderProduct: IPreOrder
}

export default function PreOrderProductCard({ preOrderProduct }: ProductCardProps) {
  const [timeStatus, setTimeStatus] = useState<'upcoming' | 'ongoing' | 'ended'>('upcoming')
  const [releaseDay, setReleaseDay] = useState(new Date())
  const navigate = useNavigate()
  useEffect(() => {
    const checkTimeStatus = () => {
      const now = new Date()
      const release = new Date(preOrderProduct.startTime)
      const end = new Date(preOrderProduct.endTime)
      setReleaseDay(release)

      if (now < release) {
        setTimeStatus('upcoming')
      } else if (now >= release && now < end) {
        setTimeStatus('ongoing')
      } else {
        setTimeStatus('ended')
      }
    }

    checkTimeStatus()
  }, [preOrderProduct.startTime, preOrderProduct.endTime])

  const renderDateInfo = () => {
    switch (timeStatus) {
      case 'upcoming':
        return (
          <>
            <span className="text-sm">Dự kiến ra mắt:</span>
            <span className="font-semibold text-sm">
              {releaseDay.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <div className="text-base font-semibold">
              {formatDate(preOrderProduct.startTime, 'en-GB', {
                month: 'numeric',
              })}
            </div>
          </>
        )
      case 'ongoing':
        return (
          <>
            <span className="text-sm">Ngày kết thúc:</span>
            <span className="font-semibold text-sm">
              {new Date(preOrderProduct.endTime).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <div className="text-base font-semibold">
              {formatDate(preOrderProduct.endTime, 'en-GB', {
                month: 'numeric',
              })}
            </div>
          </>
        )
      case 'ended':
        return null
    }
  }

  const renderButton = () => {
    if (timeStatus === 'upcoming') {
      return (
        <div className="flex flex-col gap-2">
          <div className="w-full">
            <Countdown targetDate={releaseDay.toISOString()} language="vi" />
          </div>
          <Button className="w-full text-base">
            <ChevronRight className="w-4 h-4 mr-1" />
            Tìm Hiểu thêm
          </Button>
        </div>
      )
    } else if (timeStatus === 'ongoing') {
      return <Button className="w-full text-base bg-amber-500 hover:bg-amber-600">Đặt Trước</Button>
    }
    return null
  }

  return (
    <Card
      className="mx-auto relative overflow-hidden h-full cursor-pointer"
      onClick={() => {
        console.log('onCLick', preOrderProduct.product.id)
        navigate(`${configs.routes.products}/${preOrderProduct.product.id}`)
      }}
    >
      <div className="absolute top-3 left-3 z-10">
        <ProductTag tag={timeStatus == 'ongoing' ? 'ACTIVE' : 'WAITING'} />
      </div>
      <CardContent className="p-0 relative h-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
          <ImageWithFallback
            src={preOrderProduct.productClassifications[0]?.images[0]?.fileUrl || '/placeholder.svg'}
            fallback={productImage}
            className="object-cover w-full h-full sm:rounded-tl-xl sm:rounded-bl-xl rounded-t-xl sm:rounded-tr-none aspect-square sm:aspect-auto"
          />

          <div className="p-3 sm:p-4 flex flex-col justify-between h-full">
            <h2 className="text-base sm:text-lg font-bold line-clamp-2 mb-2">{preOrderProduct.product.name}</h2>

            <div className="text-center mb-2">
              <div className="flex items-center gap-1 flex-col justify-center text-muted-foreground">
                {renderDateInfo()}
              </div>
            </div>

            <div className="mt-auto">{renderButton()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
