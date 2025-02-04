import { Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { ShippingStatusEnum } from '@/types/enum'
import { IStatusTracking } from '@/types/status-tracking'

import { StatusTrackingIcon, StatusTrackingText } from '../status-tracking-order/StatusTrackingOrder'

interface OrderStatusTrackingProps {
  statusTrackingData: IStatusTracking[]
}
const OrderStatusTracking = ({ statusTrackingData }: OrderStatusTrackingProps) => {
  const { t } = useTranslation()

  const defaultTimeline = [
    {
      status: 'ORDER_CREATED',
      createdAt: statusTrackingData[0]?.createdAt,
      text: t('order.created'),
      icon: <Package className="w-5 h-5" />,
    },
  ]

  const databaseTimeline = statusTrackingData.map((tracking) => ({
    status: tracking.status,
    createdAt: tracking.createdAt,
    text: StatusTrackingText(tracking.status),
    icon: StatusTrackingIcon(tracking.status),
  }))

  const defaultNextTimeline =
    statusTrackingData[statusTrackingData.length - 1]?.status === ShippingStatusEnum.TO_PAY
      ? [
          {
            status: ShippingStatusEnum.WAIT_FOR_CONFIRMATION,
            text: StatusTrackingText(ShippingStatusEnum.WAIT_FOR_CONFIRMATION),
            icon: StatusTrackingIcon(ShippingStatusEnum.WAIT_FOR_CONFIRMATION),
            createdAt: '',
          },
          {
            status: ShippingStatusEnum.TO_SHIP,
            text: StatusTrackingText(ShippingStatusEnum.TO_SHIP),
            icon: StatusTrackingIcon(ShippingStatusEnum.TO_SHIP),
            createdAt: '',
          },
          {
            status: ShippingStatusEnum.TO_RECEIVED,
            text: StatusTrackingText(ShippingStatusEnum.TO_RECEIVED),
            icon: StatusTrackingIcon(ShippingStatusEnum.TO_RECEIVED),
            createdAt: '',
          },
          {
            status: ShippingStatusEnum.COMPLETED,
            text: StatusTrackingText(ShippingStatusEnum.COMPLETED),
            icon: StatusTrackingIcon(ShippingStatusEnum.COMPLETED),
            createdAt: '',
          },
        ]
      : statusTrackingData[statusTrackingData.length - 1]?.status === ShippingStatusEnum.WAIT_FOR_CONFIRMATION
        ? [
            {
              status: ShippingStatusEnum.TO_SHIP,
              text: StatusTrackingText(ShippingStatusEnum.TO_SHIP),
              icon: StatusTrackingIcon(ShippingStatusEnum.TO_SHIP),
              createdAt: '',
            },
            {
              status: ShippingStatusEnum.TO_RECEIVED,
              text: StatusTrackingText(ShippingStatusEnum.TO_RECEIVED),
              icon: StatusTrackingIcon(ShippingStatusEnum.TO_RECEIVED),
              createdAt: '',
            },
            {
              status: ShippingStatusEnum.COMPLETED,
              text: StatusTrackingText(ShippingStatusEnum.COMPLETED),
              icon: StatusTrackingIcon(ShippingStatusEnum.COMPLETED),
              createdAt: '',
            },
          ]
        : statusTrackingData[statusTrackingData.length - 1]?.status === ShippingStatusEnum.TO_SHIP
          ? [
              {
                status: ShippingStatusEnum.TO_RECEIVED,
                text: StatusTrackingText(ShippingStatusEnum.TO_RECEIVED),
                icon: StatusTrackingIcon(ShippingStatusEnum.TO_RECEIVED),
                createdAt: '',
              },
              {
                status: ShippingStatusEnum.COMPLETED,
                text: StatusTrackingText(ShippingStatusEnum.COMPLETED),
                icon: StatusTrackingIcon(ShippingStatusEnum.COMPLETED),
                createdAt: '',
              },
            ]
          : statusTrackingData[statusTrackingData.length - 1]?.status === ShippingStatusEnum.TO_RECEIVED
            ? [
                {
                  status: ShippingStatusEnum.COMPLETED,
                  text: StatusTrackingText(ShippingStatusEnum.COMPLETED),
                  icon: StatusTrackingIcon(ShippingStatusEnum.COMPLETED),
                  createdAt: '',
                },
              ]
            : []

  const timeline = [...defaultTimeline, ...databaseTimeline, ...defaultNextTimeline]
  const currentStatus = statusTrackingData[statusTrackingData.length - 1]?.status
  const currentIndex = timeline.findIndex((step) => step.status === currentStatus)
  return (
    <div className="w-full relative">
      <div className={`absolute top-5 left-[7%] right-[7%] h-0.5 bg-muted`} />
      <div className="w-full relative z-10 flex justify-between">
        {timeline.map((step, index) => {
          const isCurrent = index === currentIndex
          const isCompleted = index < currentIndex

          return (
            <div
              key={index}
              className="timeline-item flex flex-col items-center gap-2 relative"
              style={{ flex: '1 0 0%' }}
            >
              <div
                className={`timeline-icon w-10 h-10 rounded-full flex items-center justify-center relative
              ${
                step.status === ShippingStatusEnum.CANCELLED
                  ? 'bg-red-500 text-white'
                  : step.status === ShippingStatusEnum.CANCELLED
                    ? 'bg-gray-600 text-white'
                    : isCurrent || isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-muted text-muted-foreground'
              }
            `}
              >
                {step.icon}
              </div>

              <p
                className={`text-sm text-center font-medium ${
                  step.status === ShippingStatusEnum.CANCELLED
                    ? 'text-red-500'
                    : step.status === ShippingStatusEnum.CANCELLED
                      ? 'text-gray-600'
                      : isCurrent || isCompleted
                        ? 'text-emerald-500'
                        : 'text-muted-foreground'
                }`}
              >
                {step.text}
              </p>
              {/* {step?.createdAt && (
                <p
                  className={`text-xs text-center ${
                    isCurrent || isCompleted ? 'text-emerald-500' : 'text-muted-foreground'
                  }`}
                >
                  {t('date.toLocaleDateTimeString', { val: new Date(step?.createdAt) })}
                </p>
              )} */}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OrderStatusTracking
