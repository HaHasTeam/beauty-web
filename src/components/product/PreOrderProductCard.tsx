'use client'

import { ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import productImage from '@/assets/images/product_sample_img.png'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import configs from '@/config'
import { IPreOrder } from '@/types/pre-order'
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
            <span>Dự kiến ra mắt:</span>
            <span className="font-semibold">
              {releaseDay.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <div className="text-lg font-semibold">
              {formatDate(preOrderProduct.startTime, 'en-GB', {
                month: 'numeric',
              })}
            </div>
          </>
        )
      case 'ongoing':
        return (
          <>
            <span>Ngày kết thúc:</span>
            <span className="font-semibold">
              {new Date(preOrderProduct.endTime).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <div className="text-lg font-semibold">
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

  // const renderStatusInfo = () => {
  //   switch (preOrderProduct.status) {
  //     case PreOrderProductEnum.ACTIVE:
  //       return renderDateInfo()
  //     case PreOrderProductEnum.SOLD_OUT:
  //       return <span className="text-lg font-semibold text-red-500">Hết hàng</span>
  //     case PreOrderProductEnum.WAITING:
  //       return <span className="text-lg font-semibold text-yellow-500">Sắp diễn ra</span>
  //     case PreOrderProductEnum.INACTIVE:
  //       return <span className="text-lg font-semibold text-gray-500">Không khả dụng</span>
  //     case PreOrderProductEnum.CANCELLED:
  //       return <span className="text-lg font-semibold text-red-500">Đã hủy</span>
  //   }
  // }

  const renderButton = () => {
    console.log('timeStatus', timeStatus)

    if (timeStatus === 'upcoming') {
      return (
        <>
          <Countdown targetDate={releaseDay.toISOString()} language="vi" />
          <Button className="w-full text-lg">
            <ChevronRight className="w-5 h-5 mr-2 text-base" />
            Tìm Hiểu thêm
          </Button>
        </>
      )
    } else if (timeStatus === 'ongoing') {
      return <Button className="w-full text-lg bg-amber-500 hover:bg-amber-600">Đặt Trước</Button>
    }
    return null

    // switch (preOrderProduct.status) {
    //   case PreOrderProductEnum.ACTIVE:
    //     if (timeStatus === 'upcoming') {
    //       return (
    //         <>
    //           <Countdown targetDate={releaseDay.toISOString()} language="vi" />
    //           <Button className="w-full text-lg">
    //             <ChevronRight className="w-5 h-5 mr-2 text-base" />
    //             Tìm Hiểu thêm
    //           </Button>
    //         </>
    //       )
    //     } else if (timeStatus === 'ongoing') {
    //       return <Button className="w-full text-lg bg-amber-500 hover:bg-amber-600">Đặt Trước</Button>
    //     }
    //     return null
    //   case PreOrderProductEnum.SOLD_OUT:
    //   case PreOrderProductEnum.INACTIVE:
    //   case PreOrderProductEnum.CANCELLED:
    //     return (
    //       <Button className="w-full text-lg" disabled>
    //         Không khả dụng
    //       </Button>
    //     )
    //   case PreOrderProductEnum.WAITING:
    //     return (
    //       <>
    //         <Countdown targetDate={releaseDay.toISOString()} language="vi" />
    //         <Button className="w-full text-lg bg-yellow-500 hover:bg-yellow-600">Tìm Hiểu Thêm</Button>
    //       </>
    //     )
    // }
  }

  return (
    <Card
      className="mx-auto relative overflow-hidden h-full"
      onClick={() => {
        console.log('onCLick', preOrderProduct.product.id)
        navigate(`${configs.routes.products}/${preOrderProduct.product.id}`)
      }}
    >
      <div className="absolute top-3 left-3 z-10">
        <ProductTag tag={timeStatus == 'ongoing' ? 'ACTIVE' : 'WAITING'} />
      </div>
      <CardContent className="p-0 relative grid grid-cols-2 h-full">
        <ImageWithFallback
          src={preOrderProduct.productClassifications[0]?.images[0]?.fileUrl}
          fallback={productImage}
          className="object-cover w-full h-full rounded-tl-xl rounded-bl-xl aspect-"
        />

        <div className="space-y-6 p-4 flex  justify-between flex-col">
          <h2 className="text-lg font-bold line-clamp-2">{preOrderProduct.product.name}</h2>

          <div className="text-center">
            <div className="flex items-center gap-2 flex-col justify-center text-muted-foreground">
              {renderDateInfo()}
            </div>
          </div>

          {renderButton()}
        </div>
      </CardContent>
    </Card>
  )
}
