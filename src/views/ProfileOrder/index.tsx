import { useMutation } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import OrderItem from '@/components/order/OrderItem'
import { OrderRequestFilter } from '@/components/order/OrderRequestFilter'
import SearchOrders from '@/components/order/SearchOrders'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getMyOrdersApi, getMyRequestsApi } from '@/network/apis/order'
import { OrderRequestTypeEnum, RequestStatusEnum, ShippingStatusEnum } from '@/types/enum'
import { IOrderFilter, IOrderItem, IRequest, IRequestFilter } from '@/types/order'

export default function ProfileOrder() {
  const { t } = useTranslation()
  const [orders, setOrders] = useState<IOrderItem[]>([])
  const [requests, setRequests] = useState<IRequest[]>([])
  const [activeTab, setActiveTab] = useState<string>('all')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isTrigger, setIsTrigger] = useState<boolean>(false)

  const [requestTypes, setRequestTypes] = useState<OrderRequestTypeEnum[]>([])
  const [requestStatuses, setRequestStatuses] = useState<RequestStatusEnum[]>([])

  const simplifiedTriggers = useMemo(
    () => [
      { value: 'all', text: `${t('order.all')}` },
      {
        value: 'pending',
        text: `${t('requestStatus.pending')}`,
        statuses: [
          ShippingStatusEnum.JOIN_GROUP_BUYING,
          ShippingStatusEnum.TO_PAY,
          ShippingStatusEnum.WAIT_FOR_CONFIRMATION,
        ],
      },
      {
        value: 'processing',
        text: `${t('order.processing')}`,
        statuses: [ShippingStatusEnum.PREPARING_ORDER, ShippingStatusEnum.TO_SHIP],
      },
      { value: 'shipping', text: `${t('order.delivering')}`, statuses: [ShippingStatusEnum.SHIPPING] },
      { value: 'delivered', text: `${t('order.delivered')}`, statuses: [ShippingStatusEnum.DELIVERED] },
      { value: 'completed', text: `${t('order.completed')}`, statuses: [ShippingStatusEnum.COMPLETED] },
      {
        value: 'returns',
        text: `${t('order.returns')}`,
        statuses: [
          ShippingStatusEnum.RETURNING,
          ShippingStatusEnum.BRAND_RECEIVED,
          ShippingStatusEnum.RETURNED_FAIL,
          ShippingStatusEnum.REFUNDED,
        ],
      },
      { value: 'cancelled', text: `${t('order.cancelled')}`, statuses: [ShippingStatusEnum.CANCELLED] },
      { value: 'request', text: `${t('order.requestManagement')}` },
    ],
    [t],
  )
  const { mutateAsync: getMyOrderFn } = useMutation({
    mutationKey: [getMyOrdersApi.mutationKey],
    mutationFn: getMyOrdersApi.fn,
    onSuccess: (data) => {
      setOrders(data?.data)
      setIsLoading(false)
    },
  })
  const { mutateAsync: getMyRequestFn } = useMutation({
    mutationKey: [getMyRequestsApi.mutationKey],
    mutationFn: getMyRequestsApi.fn,
    onSuccess: (data) => {
      setRequests(data?.data)
      setIsLoading(false)
    },
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }
  const handleRequestFilterChange = (types: OrderRequestTypeEnum[], statuses: RequestStatusEnum[]) => {
    setRequestTypes(types)
    setRequestStatuses(statuses)
    // Trigger refetch with new filters
    setIsTrigger((prev) => !prev)
  }

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      if (activeTab === 'request') {
        const requestFilters: IRequestFilter = {
          types: requestTypes.length > 0 ? requestTypes : undefined,
          statusList: requestStatuses.length > 0 ? requestStatuses : undefined,
          search: searchQuery || undefined,
        }
        await getMyRequestFn(requestFilters)
      } else {
        let statusFilters

        const selectedTrigger = simplifiedTriggers.find((trigger) => trigger.value === activeTab)

        // If it's a group with multiple statuses, use them all
        if (selectedTrigger?.statuses) {
          statusFilters = selectedTrigger.statuses
        }
        // If it's "all", don't filter by status
        else if (activeTab === 'all') {
          statusFilters = undefined
        }
        // Otherwise, use the single status value
        else {
          statusFilters = [activeTab.toUpperCase()]
        }

        const filters: IOrderFilter = {
          statusList: statusFilters,
          search: searchQuery || undefined,
        }
        await getMyOrderFn(filters)
      }
    }

    fetchOrders()
  }, [
    activeTab,
    getMyOrderFn,
    searchQuery,
    isTrigger,
    simplifiedTriggers,
    getMyRequestFn,
    requestTypes,
    requestStatuses,
  ])

  // const renderOrders = () => {
  //   // if (!isLoading && orders && orders?.length === 0) {
  //   //   return (
  //   //     <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
  //   //       <Empty
  //   //         title={t('empty.order.title')}
  //   //         description={activeTab === 'all' ? t('empty.order.description') : t('empty.order.statusDescription')}
  //   //       />
  //   //     </div>
  //   //   )
  //   // }
  //   if ((activeTab === 'request' && requests?.length === 0) ||
  //       (activeTab !== 'request' && orders?.length === 0)) {
  //     return (
  //       <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
  //         <Empty
  //           title={t('empty.order.title')}
  //           description={activeTab === 'all' ? t('empty.order.description') : t('empty.order.statusDescription')}
  //         />
  //       </div>
  //     )
  //   }

  //   return (
  //     <div className="space-y-4">
  //       {activeTab === 'request'
  //         ? requests?.map((request) => (
  //             <div key={request?.id} className="bg-white border rounded-md">
  //               <OrderItem
  //                 brand={
  //                   request?.order?.orderDetails[0]?.productClassification?.preOrderProduct?.product?.brand ??
  //                   request?.order?.orderDetails[0]?.productClassification?.productDiscount?.product?.brand ??
  //                   request?.order?.orderDetails[0]?.productClassification?.product?.brand ??
  //                   null
  //                 }
  //                 orderItem={request?.order}
  //                 request={request}
  //                 setIsTrigger={setIsTrigger}
  //               />
  //             </div>
  //           ))
  //         : orders?.map((orderItem) => (
  //             <div key={orderItem?.id} className="bg-white border rounded-md">
  //               <OrderItem
  //                 brand={
  //                   orderItem?.orderDetails[0]?.productClassification?.preOrderProduct?.product?.brand ??
  //                   orderItem?.orderDetails[0]?.productClassification?.productDiscount?.product?.brand ??
  //                   orderItem?.orderDetails[0]?.productClassification?.product?.brand ??
  //                   null
  //                 }
  //                 orderItem={orderItem}
  //                 setIsTrigger={setIsTrigger}
  //               />
  //             </div>
  //           ))}
  //     </div>
  //   )
  // }
  //   return (
  //     <div className="space-y-4">
  //       { orders?.map((orderItem) => (
  //             <div key={orderItem?.id} className="bg-white border rounded-md">
  //               <OrderItem
  //                 brand={
  //                   orderItem?.orderDetails[0]?.productClassification?.preOrderProduct?.product?.brand ??
  //                   orderItem?.orderDetails[0]?.productClassification?.productDiscount?.product?.brand ??
  //                   orderItem?.orderDetails[0]?.productClassification?.product?.brand ??
  //                   null
  //                 }
  //                 orderItem={orderItem}
  //                 setIsTrigger={setIsTrigger}
  //               />
  //             </div>
  //           ))}
  //     </div>
  //   )
  // }
  const renderOrders = () => {
    if ((activeTab === 'request' && requests?.length === 0) || (activeTab !== 'request' && orders?.length === 0)) {
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
        {activeTab === 'request'
          ? requests?.map((request) => (
              <div key={request?.id} className="bg-white border rounded-md">
                <OrderItem
                  brand={
                    request?.order?.orderDetails[0]?.productClassification?.preOrderProduct?.product?.brand ??
                    request?.order?.orderDetails[0]?.productClassification?.productDiscount?.product?.brand ??
                    request?.order?.orderDetails[0]?.productClassification?.product?.brand ??
                    null
                  }
                  orderItem={request?.order}
                  setIsTrigger={setIsTrigger}
                />
              </div>
            ))
          : orders?.map((orderItem) => (
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
          {/* Dropdown for mobile */}
          <div className="block md:hidden w-full mb-4">
            <Select value={activeTab} onValueChange={(value) => setActiveTab(value)}>
              <SelectTrigger className="w-full border border-primary/40 text-primary hover:text-primary hover:bg-primary/10">
                <SelectValue>
                  {simplifiedTriggers.find((trigger) => trigger.value === activeTab)?.text || t('order.all')}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {simplifiedTriggers.map((trigger) => (
                  <SelectItem key={trigger.value} value={trigger.value}>
                    {trigger.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabs for desktop */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="w-full hidden md:block">
            <TabsList className="sticky top-0 z-10 h-14 w-full justify-start overflow-x-auto p-0 bg-white">
              {/* <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="w-full">
            <TabsList className="sticky top-0 z-10 h-14 w-full justify-start overflow-x-auto p-0 bg-white"> */}
              {simplifiedTriggers?.map((trigger) => (
                <TabsTrigger
                  key={trigger.value}
                  className={`h-14 w-full my-auto rounded-none data-[state=active]:text-primary hover:text-secondary-foreground/80 data-[state=active]:border-b-2 data-[state=active]:border-primary `}
                  value={trigger.value}
                >
                  {trigger.text}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="space-y-2 mt-2">
            <div className="flex gap-2 items-center">
              {activeTab === 'request' ? (
                <div className="w-full flex justify-end items-center">
                  <OrderRequestFilter onFilterChange={handleRequestFilterChange} />
                </div>
              ) : (
                <SearchOrders onSearch={handleSearch} />
              )}
            </div>
            {renderOrders()}
          </div>
        </div>
      </div>
    </>
  )
}
