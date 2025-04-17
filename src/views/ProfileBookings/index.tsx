// import { useMutation } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import BookingItem from '@/components/booking/BookingItem'
import SearchBookings from '@/components/booking/SearchBookings'
import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getAllureMyBookingsApi } from '@/network/apis/booking'
import { IBookingFilter } from '@/types/booking'
import { BookingStatusEnum } from '@/types/enum'

export default function ProfileBookings() {
  const { t } = useTranslation()
  
  // Use useQueryState for maintaining state in URL
  const [activeTab, setActiveTab] = useQueryState('tab', { defaultValue: 'all' })
  const [searchQuery, setSearchQuery] = useQueryState('search', { defaultValue: '' })

  const simplifiedTriggers = useMemo(
    () => [
      { value: 'all', text: `${t('booking.all')}` },
      {
        value: 'pending',
        text: `${t('bookingStatus.pending')}`,
        statuses: [BookingStatusEnum.TO_PAY, BookingStatusEnum.WAIT_FOR_CONFIRMATION],
      },
      {
        value: 'confirmed',
        text: `${t('booking.confirmed')}`,
        statuses: [BookingStatusEnum.BOOKING_CONFIRMED],
      },
      {
        value: BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED,
        text: `${t('bookingStatus.formSubmitted', 'Form Submitted')}`,
        statuses: [BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED],
      },
      {
        value: BookingStatusEnum.SENDED_RESULT_SHEET,
        text: `${t('bookingStatus.resultSent', 'Result Sent')}`,
        statuses: [BookingStatusEnum.SENDED_RESULT_SHEET],
      },
      {
        value: 'completed',
        text: `${t('booking.completed')}`,
        statuses: [BookingStatusEnum.COMPLETED],
      },
      { value: 'cancelled', text: `${t('booking.cancelled')}`, statuses: [BookingStatusEnum.CANCELLED] },
      { value: 'refunded', text: `${t('booking.refunded')}`, statuses: [BookingStatusEnum.REFUNDED] },
    ],
    [t],
  )

  // Prepare filter for API request
  const prepareFilter = (): IBookingFilter => {
    let statusesStr: string | undefined;
    const selectedTrigger = simplifiedTriggers.find((trigger) => trigger.value === activeTab);
    
    if (selectedTrigger?.statuses) {
      statusesStr = selectedTrigger.statuses.join(',');
    } else if (activeTab !== 'all') {
      statusesStr = activeTab;
    }
    
    return {
      statuses: statusesStr,
      search: searchQuery || undefined
    };
  };

  // Use React Query to fetch data
  const { data:myBookings, isLoading,refetch } = useQuery({
    queryKey: [getAllureMyBookingsApi.queryKey, { ...prepareFilter() }],
    queryFn: getAllureMyBookingsApi.fn
  });

  const bookings = myBookings?.data || [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  }

  const handleTriggerRefresh = () => {
    refetch()
  };

  const renderBookings = () => {
    if (bookings?.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <Empty
            title={t('empty.booking.title')}
            description={activeTab === 'all' ? t('empty.booking.description') : t('empty.booking.statusDescription')}
          />
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {bookings?.map((booking) => (
          <div key={booking?.id} className="bg-white border rounded-md">
            <BookingItem booking={booking} setIsTrigger={handleTriggerRefresh} />
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
                  {simplifiedTriggers.find((trigger) => trigger.value === activeTab)?.text || t('booking.all')}
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
              <SearchBookings onSearch={handleSearch} />
            </div>
            {renderBookings()}
          </div>
        </div>
      </div>
    </>
  )
}
