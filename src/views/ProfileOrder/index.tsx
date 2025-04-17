import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import OrderItem from '@/components/order/OrderItem'
import OrderParentItem from '@/components/order/OrderParentItem'
import { OrderRequestFilter } from '@/components/order/OrderRequestFilter'
import SearchOrders from '@/components/order/SearchOrders'
import APIPagination from '@/components/pagination/Pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { filterOrdersParentApi, filterRequestApi } from '@/network/apis/order'
import { OrderRequestTypeEnum, RequestStatusEnum, ShippingStatusEnum } from '@/types/enum'

export default function ProfileOrder() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<string>('all')
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isTrigger, setIsTrigger] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

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

  const { data: filterOrdersData, isFetching: isLoading } = useQuery({
    queryKey: [
      filterOrdersParentApi.queryKey,
      {
        page: currentPage,
        limit: 10,
        order: 'DESC',
        statuses: simplifiedTriggers.find((trigger) => trigger.value === activeTab)?.statuses
          ? simplifiedTriggers.find((trigger) => trigger.value === activeTab)?.statuses
          : activeTab === 'all'
            ? undefined
            : (activeTab.toUpperCase() as ShippingStatusEnum),
        search: searchQuery || undefined,
      },
    ],
    queryFn: filterOrdersParentApi.fn,
  })
  const { data: filterRequestsData, isFetching: isLoadingRequest } = useQuery({
    queryKey: [
      filterRequestApi.queryKey,
      {
        page: currentPage,
        limit: 10,
        order: 'DESC',
        statuses: requestStatuses.length > 0 ? requestStatuses : [],
        types: requestTypes.length > 0 ? requestTypes : [],
      },
    ],
    queryFn: filterRequestApi.fn,
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }
  const handleRequestFilterChange = async (types: OrderRequestTypeEnum[], statuses: RequestStatusEnum[]) => {
    setRequestTypes(types)
    setRequestStatuses(statuses)
    // Trigger refetch with new filters
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [filterOrdersParentApi.queryKey] }),
      queryClient.invalidateQueries({ queryKey: [filterRequestApi.queryKey] }),
    ])
  }
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: [filterOrdersParentApi.queryKey] })
    queryClient.invalidateQueries({ queryKey: [filterRequestApi.queryKey] })
  }, [isTrigger, queryClient])

  const renderOrders = () => {
    if (
      (activeTab === 'request' && !isLoadingRequest && filterRequestsData?.data?.total === 0) ||
      (activeTab !== 'request' && !isLoading && filterOrdersData?.data?.total === 0)
    ) {
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
          ? filterRequestsData?.data?.items?.map((request) => (
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
          : filterOrdersData?.data?.items?.map((order) => (
              <div key={order?.id}>
                {order?.status === ShippingStatusEnum.TO_PAY ? (
                  <OrderParentItem setIsTrigger={setIsTrigger} order={order} />
                ) : (
                  <div className="space-y-4">
                    {order.children?.map((orderItem) => (
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
                )}
              </div>
            ))}
      </div>
    )
  }
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Refetch data with the new page
    queryClient.invalidateQueries({
      queryKey: [activeTab === 'request' ? filterRequestApi.queryKey : filterOrdersParentApi.queryKey],
    })
  }
  useEffect(() => {
    if (activeTab === 'request' && filterRequestsData?.data) {
      setTotalPages(filterRequestsData.data.totalPages) // Assuming 10 items per page
    } else if (filterOrdersData?.data) {
      setTotalPages(filterOrdersData.data.totalPages) // Assuming 10 items per page
    }
  }, [filterOrdersData, filterRequestsData, activeTab])
  return (
    <>
      {isLoading && <LoadingContentLayer />}

      <div className="w-full flex justify-center">
        <div className="w-full p-4 max-w-sm sm:max-w-[838px] md:max-w-[1060px] lg:max-w-[1820px] xl:max-w-[2180px] 2xl:max-w-[2830px]">
          {/* Dropdown for mobile */}
          <div className="block md:hidden w-full mb-4">
            <Select
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value)
                setCurrentPage(1)
              }}
            >
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
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value)
              setCurrentPage(1)
            }}
            className="w-full hidden md:block"
          >
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
            {((activeTab !== 'request' && filterOrdersData?.data.items && filterOrdersData?.data.items.length > 0) ||
              (activeTab === 'request' &&
                filterRequestsData?.data.items &&
                filterRequestsData?.data.items.length > 0)) && (
              <div className="mb-2">
                <APIPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
