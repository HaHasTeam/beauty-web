import { useQuery } from '@tanstack/react-query'
import { Truck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import OrderDetailItems from '@/components/order-detail/OrderDetailItems'
import OrderGeneral from '@/components/order-detail/OrderGeneral'
import OrderStatusTracking from '@/components/order-detail/OrderStatusTracking'
import configs from '@/config'
import { getOrderByIdApi } from '@/network/apis/order'

const OrderDetail = () => {
  const { orderId } = useParams()
  const { t } = useTranslation()
  const { data: useOrderData, isFetching } = useQuery({
    queryKey: [getOrderByIdApi.queryKey, orderId ?? ('' as string)],
    queryFn: getOrderByIdApi.fn,
  })

  return (
    <div>
      {isFetching && <LoadingContentLayer />}
      <div className="w-full lg:px-5 md:px-4 sm:px-3 px-3 space-y-3 my-5">
        <span className="text-lg text-muted-foreground font-medium">{t('orderDetail.title')}</span>
        {!isFetching && useOrderData && useOrderData?.data && (
          <>
            <div className="flex flex-col gap-2 w-full">
              {/* order status tracking */}
              <OrderStatusTracking currentStatus={useOrderData?.data?.status} />

              {/* order customer information, shipment */}
              <OrderGeneral
                title={t('orderDetail.shipingAddress')}
                icon={<Truck />}
                content={
                  <div className="flex flex-col gap-1">
                    <span>
                      {t('orderDetail.address')}: {useOrderData?.data?.shippingAddress}
                    </span>
                    <span>
                      {t('orderDetail.phone')}: {useOrderData?.data?.phone}
                    </span>
                    <span>
                      {t('orderDetail.note')}: {useOrderData?.data?.notes ?? t('orderDetail.no')}
                    </span>
                  </div>
                }
              />
              {/* order items */}
              <OrderDetailItems />
            </div>
          </>
        )}
        {!isFetching && (!useOrderData || !useOrderData?.data) && (
          <Empty
            title={t('empty.orderDetail.title')}
            description={t('empty.orderDetail.description')}
            link={configs.routes.profileOrder}
            linkText={t('empty.orderDetail.button')}
          />
        )}
      </div>
    </div>
  )
}

export default OrderDetail
