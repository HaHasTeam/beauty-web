import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import OrderItem from '@/components/order/OrderItem'
import SearchOrders from '@/components/order/SearchOrders'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getMyOrdersApi } from '@/network/apis/order'
import { ShippingStatusEnum } from '@/types/enum'
import { IOrderFilter, IOrderItem } from '@/types/order'

export default function ProfileOrder() {
  const { t } = useTranslation()
  const [orders, setOrders] = useState<IOrderItem[]>([])
  const [activeTab, setActiveTab] = useState<string>('all')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isTrigger, setIsTrigger] = useState<boolean>(false)

  const triggers = [
    { value: 'all', text: `${t('order.all')}` },
    { value: ShippingStatusEnum?.TO_PAY, text: `${t('order.pending')}` },
    { value: ShippingStatusEnum?.WAIT_FOR_CONFIRMATION, text: `${t('order.waitConfirm')}` },
    { value: ShippingStatusEnum?.TO_SHIP, text: `${t('order.shipping')}` },
    { value: ShippingStatusEnum?.SHIPPING, text: `${t('order.delivering')}` },
    { value: ShippingStatusEnum?.COMPLETED, text: `${t('order.completed')}` },
    { value: ShippingStatusEnum?.CANCELLED, text: `${t('order.cancelled')}` },
    { value: ShippingStatusEnum?.REFUNDED, text: `${t('order.return')}` },
  ]
  const { mutateAsync: getMyOrderFn } = useMutation({
    mutationKey: [getMyOrdersApi.mutationKey],
    mutationFn: getMyOrdersApi.fn,
    onSuccess: (data) => {
      setOrders(data?.data)
      setIsLoading(false)
    },
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      const filters: IOrderFilter = {
        status: activeTab !== 'all' ? activeTab.toUpperCase() : undefined,
        search: searchQuery || undefined,
      }
      await getMyOrderFn(filters)
    }
    fetchOrders()
  }, [activeTab, getMyOrderFn, searchQuery, isTrigger])

  const renderOrders = () => {
    if (!isLoading && orders && orders?.length === 0) {
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
          <div key={orderItem?.id} className="bg-white border rounded-md">
            <OrderItem
              brand={
                orderItem?.orderDetails[0]?.productClassification?.preOrderProduct?.product?.brand ??
                orderItem?.orderDetails[0]?.productClassification?.productDiscount?.product?.brand ??
                orderItem?.orderDetails[0]?.productClassification?.product?.brand ??
                null
              }
              orderItem={orderItem}
              setIsTrigger={setIsTrigger}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      {isLoading && <LoadingContentLayer />}

      <div className="w-full flex justify-center">
        <div className="w-full p-4 max-w-sm sm:max-w-[838px] md:max-w-[1060px] lg:max-w-[1820px] xl:max-w-[2180px] 2xl:max-w-[2830px]">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="w-full">
            <TabsList className="sticky top-0 z-10 h-14 w-full justify-start overflow-x-auto p-0 bg-white">
              {triggers?.map((trigger) => (
                <TabsTrigger
                  key={trigger.value}
                  className={`h-14 w-full my-auto rounded-none data-[state=active]:text-primary hover:text-secondary-foreground/80 data-[state=active]:border-b-2 data-[state=active]:border-primary `}
                  value={trigger.value}
                >
                  {trigger.text}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="space-y-2">
                <SearchOrders onSearch={handleSearch} />
                {renderOrders()}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
