'use client'

import { type CalendarDate, getLocalTimeZone, getWeeksInMonth, parseDate, today } from '@internationalized/date'
import type { DateValue } from '@react-aria/calendar'
import { useLocale } from '@react-aria/i18n'
import { useQuery } from '@tanstack/react-query'
import * as React from 'react'

import { Calendar } from '@/components/calendar'
import { cn } from '@/lib/utils'
import { getSomeoneSlotApi } from '@/network/apis/booking'
import { TSlot as BookingTSlot } from '@/types/booking'

import { FormPanel } from './form-panel'
import { RightPanel } from './right-panel'

// Sử dụng lại định nghĩa TSlot từ types/booking.ts
export type TSlot = BookingTSlot

export interface BookingCalendarProps {
  onDateTimeSelect?: (dateTime: string, slotId?: string) => void
  onClose?: () => void
  selectedDateTime?: string
  consultantId?: string
  onFocusChange?: (date: Date) => void
}

export function BookingCalendar({ 
  onDateTimeSelect, 
  onClose, 
  selectedDateTime,
  consultantId,
  onFocusChange,
}: BookingCalendarProps) {
  const { locale } = useLocale()
  const localTimeZone = getLocalTimeZone()

  // Initialize state from selectedDateTime prop if available
  const [date, setDate] = React.useState<CalendarDate>(() => {
    if (selectedDateTime) {
      const dateObj = new Date(selectedDateTime)
      return parseDate(dateObj.toISOString().split('T')[0])
    }
    return today(localTimeZone)
  })

  const [focusedDate, setFocusedDate] = React.useState<CalendarDate | null>(date)

  // Extract time from selectedDateTime if available - using 24h format
  const [selectedTime, setSelectedTime] = React.useState<string | null>(() => {
    if (selectedDateTime) {
      const dateObj = new Date(selectedDateTime)
      const hours = dateObj.getHours()
      const minutes = dateObj.getMinutes()

      // Format with leading zeros for 24-hour time
      const formattedHours = hours < 10 ? `0${hours}` : `${hours}`
      const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`

      return `${formattedHours}:${formattedMinutes}`
    }
    return null
  })

  // Fetch available slots when date changes
  const { data: slotsData } = useQuery({
    queryKey: [getSomeoneSlotApi.queryKey, {
      id: consultantId,
      startDate: new Date(date.toString() || "").toUTCString(),
      endDate: new Date(date.toString() || "").toUTCString()
    }],
    queryFn: getSomeoneSlotApi.fn,
    enabled: !!consultantId && !!date
  })

  // Lọc ra các slot có sẵn (status là AVAILABLE hoặc isAvailable là true)
  const availableSlots = slotsData?.data?.filter((slot) => slot.isAvailable)  

  const weeksInMonth = getWeeksInMonth(focusedDate as DateValue, locale)

  const handleChangeDate = (date: DateValue) => {
    setDate(date as CalendarDate)
    // Gọi onFocusChange khi ngày thay đổi
    if (onFocusChange) {
      onFocusChange(date.toDate(localTimeZone))
    }
    // Không đóng dialog khi chỉ chọn ngày
  }

  const handleChangeAvailableTime = (time: string, slotId?: string) => {
    setSelectedTime(time)
    
    // Nếu đã có slotId được truyền từ component con
    if (slotId) {
      handleDateTimeSelection(date, time, slotId);
    } else {
      // Tìm slotId tương ứng với time được chọn
      const selectedSlotId = findSlotId(date, time);
      handleDateTimeSelection(date, time, selectedSlotId);
    }
  }
  
  // Hàm tìm slotId dựa trên date và time
  const findSlotId = (selectedDate: CalendarDate, time: string): string | undefined => {
    if (!availableSlots || availableSlots.length === 0) return undefined;
    
    // Tách giờ và phút từ time string
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return undefined;
    
    // Tạo date object từ CalendarDate và time
    const dateObj = selectedDate.toDate(localTimeZone);
    dateObj.setHours(hours, minutes, 0, 0);
    
    // Tìm slot phù hợp
    const matchingSlot = availableSlots.find(slot => {
      let slotHours, slotMinutes;
      
      // Kiểm tra nếu startTime là định dạng giờ:phút đơn giản (như "10:00")
      if (slot.startTime && slot.startTime.length <= 5 && slot.startTime.includes(':')) {
        [slotHours, slotMinutes] = slot.startTime.split(':').map(Number);
      } else {
        // Nếu là ISO string hoặc định dạng khác, parse thành Date
        const slotStart = new Date(slot.startTime);
        slotHours = slotStart.getHours();
        slotMinutes = slotStart.getMinutes();
      }
      
      return slotHours === hours && 
             slotMinutes === minutes &&
             slot.isAvailable === true;
    });
    
    return matchingSlot?.id;
  }

  // Tạo datetime string từ ngày và giờ đã chọn (định dạng 24h)
  const handleDateTimeSelection = (selectedDate: CalendarDate, time: string, slotId?: string) => {
    // Tách thời gian định dạng 24h (ví dụ: "14:30")
    const [hoursStr, minutesStr] = time.split(':')
    if (!hoursStr || !minutesStr) return

    const hours = Number.parseInt(hoursStr)
    const minutes = Number.parseInt(minutesStr)

    if (isNaN(hours) || isNaN(minutes)) return

    const currentDate = selectedDate.toDate(localTimeZone)
    currentDate.setHours(hours, minutes)

    // Trả về ISO string
    const dateTimeString = currentDate.toISOString()

    if (onDateTimeSelect) {
      onDateTimeSelect(dateTimeString, slotId)
      // Chỉ đóng khi có slotId (đã chọn thời gian)
      if (onClose && slotId) {
        onClose()
      }
    }
  }

  // Thêm CSS cho các phần mà Tailwind không thể xử lý
  React.useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      /* Calendar cell styles mà tailwind khó đạt được */
      .calendar-container .react-aria-Cell[aria-selected="true"] {
        background-color: var(--primary) !important;
        color: white !important;
        font-weight: 600 !important;
        border-radius: 9999px !important;
      }
      
      .calendar-container .react-aria-Cell[data-today="true"]::after {
        content: "";
        position: absolute;
        bottom: 3px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        background-color: var(--primary);
        border-radius: 50%;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const showForm = false

  return (
    <div className="w-full px-4 sm:px-8 py-6 bg-background rounded-2xl shadow-lg border border-border/10 transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-6">
        {!showForm ? (
          <>
            <div className="calendar-container p-3 rounded-xl shadow-sm border border-border/20 overflow-hidden">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2 before:content-[''] before:w-3 before:h-3 before:bg-primary before:rounded-full">
                Chọn ngày
              </h3>
              <Calendar
                minValue={today(localTimeZone)}
                defaultValue={today(localTimeZone)}
                value={date}
                onChange={handleChangeDate}
                onFocusChange={(focused) => {
                  setFocusedDate(focused);
                  if (focused && onFocusChange) {
                    onFocusChange(focused.toDate(localTimeZone));
                  }
                }}
                isDisabled={false}
              />
            </div>

            <div className="w-[250px] flex flex-col">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2 before:content-[''] before:w-3 before:h-3 before:bg-primary before:rounded-full">
                Chọn thời gian
              </h3>
              <div className={cn(
                "min-h-[320px] flex-1 w-full overflow-y-auto pr-2",
                "scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
              )}>
                <RightPanel
                  date={date}
                  timeZone={localTimeZone}
                  weeksInMonth={weeksInMonth}
                  handleChangeAvailableTime={handleChangeAvailableTime}
                  selectedTime={selectedTime}
                  availableSlots={availableSlots}
                />
              </div>
            </div>
          </>
        ) : (
          <FormPanel />
        )}
      </div>
    </div>
  )
}
