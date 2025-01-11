import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import CustomBreadcrumb from '@/components/breadcrumb/CustomBreadcrumb'
import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
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
        <CustomBreadcrumb dynamicSegments={[{ segment: useOrderData?.data?.id ?? t('orderDetail.title') }]} />
        {!isFetching && useOrderData && useOrderData?.data && (
          <>
            <div className="flex gap-2 w-full"></div>
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
