import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import OrderItem from '@/components/order/OrderItem'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getMyOrdersApi } from '@/network/apis/order'
import { ShippingStatusEnum } from '@/types/enum'
import { IOrderFilter, IOrderItem } from '@/types/order'

export default function ProfileOrder() {
  const { t } = useTranslation()
  const [orders, setOrders] = useState<IOrderItem[]>([])
  const [activeTab, setActiveTab] = useState<string>('all')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const triggers = [
    { value: 'all', text: `${t('order.all')}` },
    { value: ShippingStatusEnum?.TO_PAY, text: `${t('order.pending')}` },
    { value: ShippingStatusEnum?.TO_SHIP, text: `${t('order.shipping')}` },
    { value: ShippingStatusEnum?.TO_RECEIVED, text: `${t('order.delivering')}` },
    { value: ShippingStatusEnum?.COMPLETED, text: `${t('order.completed')}` },
    { value: ShippingStatusEnum?.CANCELLED, text: `${t('order.cancelled')}` },
    { value: ShippingStatusEnum?.RETURN_REFUND, text: `${t('order.return')}` },
  ]
  const { mutateAsync: getMyOrderFn } = useMutation({
    mutationKey: [getMyOrdersApi.mutationKey],
    mutationFn: getMyOrdersApi.fn,
    onSuccess: (data) => {
      // successToast({
      //   message: t('order.success'),
      // })
      // handleReset()
      setOrders(data?.data)
      setIsLoading(false)
    },
  })
  console.log(orders)
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      const filters: IOrderFilter = activeTab !== 'all' ? { status: activeTab.toUpperCase() } : {}
      await getMyOrderFn(filters)
    }
    fetchOrders()
  }, [activeTab, getMyOrderFn])
  const renderOrders = () => {
    if (orders && orders?.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <Empty
            title={t('empty.order.title')}
            description={activeTab === 'all' ? t('empty.order.description') : t('empty.order.statusDescription')}
          />
        </div>
      )
    }
    return (
      <div className="space-y-4">
        {orders?.map((orderItem) => (
          <div key={orderItem?.id} className="p-4 border rounded-lg">
            <OrderItem
              brand={orderItem?.orderDetails[0]?.productClassification?.product?.brand ?? null}
              orderItem={orderItem}
            />
          </div>
        ))}
      </div>
    )
  }
  return isLoading ? (
    <LoadingContentLayer />
  ) : (
    // orders && orders?.length > 0 ? (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="w-full">
        <TabsList className="sticky top-0 z-10 h-14 w-full justify-start overflow-x-auto p-0 bg-white">
          {triggers?.map((trigger) => (
            <TabsTrigger
              key={trigger.value}
              className={`h-14 my-auto rounded-none  data-[state=active]:text-primary hover:text-secondary-foreground/80 data-[state=active]:border-b-2 data-[state=active]:border-primary `}
              value={trigger.value}
            >
              {trigger.text}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab}>{renderOrders()}</TabsContent>
      </Tabs>
    </div>
  )
  // ) : (
  //   <div className="my-auto">
  //     <Empty
  //       title={t('empty.order.title')}
  //       description={t('empty.order.description')}
  //       link={configs?.routes?.home}
  //       linkText={t('empty.order.button')}
  //     />
  //   </div>
  // )
}
