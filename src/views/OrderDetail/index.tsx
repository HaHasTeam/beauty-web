import { useQuery } from '@tanstack/react-query'
import { MessageSquareText, Truck } from 'lucide-react'
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
            <div className="flex flex-col gap-7 w-full">
              {/* order status tracking */}
              <OrderStatusTracking currentStatus={useOrderData?.data?.status} />

              {/* order customer information, shipment */}
              <div className="flex flex-col md:flex-row gap-4 justify-between w-full items-stretch">
                <div className="w-full md:w-1/2 flex">
                  <OrderGeneral
                    title={t('orderDetail.shippingAddress')}
                    icon={<Truck />}
                    content={
                      <div className="flex flex-col gap-1 text-sm md:text-base">
                        <span>
                          {t('orderDetail.address')}: {useOrderData?.data?.shippingAddress}
                        </span>
                        <span>
                          {t('orderDetail.phone')}: {useOrderData?.data?.phone}
                        </span>
                        <span>
                          {t('orderDetail.notes')}: {useOrderData?.data?.notes ?? t('orderDetail.no')}
                        </span>
                      </div>
                    }
                  />
                </div>
                <div className="w-full md:w-1/2 flex">
                  <OrderGeneral
                    title={t('orderDetail.message')}
                    icon={<MessageSquareText />}
                    content={
                      <span className="text-sm md:text-base">
                        {t('orderDetail.message')}:{' '}
                        {useOrderData?.data?.message && useOrderData?.data?.message !== ''
                          ? useOrderData?.data?.message
                          : t('orderDetail.no')}
                      </span>
                    }
                  />
                </div>
              </div>
              {/* order items */}
              <OrderDetailItems orderDetails={useOrderData?.data?.orderDetails} />
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
