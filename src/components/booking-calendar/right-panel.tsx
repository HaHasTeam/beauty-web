import { type CalendarDate } from '@internationalized/date'
import * as React from 'react'

import Empty from '@/components/empty/Empty'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { TSlot } from '.'

export interface RightPanelProps {
  date: CalendarDate
  timeZone: string
  weeksInMonth: number
  handleChangeAvailableTime: (time: string, slotId?: string) => void
  selectedTime: string | null
  availableSlots?: TSlot[]
}

export function RightPanel({ handleChangeAvailableTime, selectedTime, availableSlots = [] }: RightPanelProps) {
  const selectedTimeRef = React.useRef<HTMLDivElement>(null)

  // Sắp xếp slots theo thời gian bắt đầu
  const sortedSlots = React.useMemo(() => {
    return [...availableSlots].sort((a, b) => {
      const dateA = new Date(a.startTime)
      const dateB = new Date(b.startTime)
      return dateA.getTime() - dateB.getTime()
    })
  }, [availableSlots])

  // Format thời gian từ slot
  const formatTimeFromSlot = (slot: TSlot): string => {
    // Kiểm tra nếu startTime đã ở dạng giờ:phút
    if (slot.startTime && slot.startTime.includes(':')) {
      // Nếu startTime đã ở định dạng "10:00", sử dụng trực tiếp
      if (slot.startTime.length <= 5) {
        return slot.startTime
      }
      // Nếu startTime là datetime ISO string hoặc định dạng khác
      else {
        const date = new Date(slot.startTime)
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`
      }
    }

    // Fallback - định dạng giờ từ ISO string
    const date = new Date(slot.startTime)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  // Format giờ kết thúc từ slot
  const formatEndTimeFromSlot = (slot: TSlot): string => {
    // Kiểm tra nếu endTime đã ở dạng giờ:phút
    if (slot.endTime && slot.endTime.includes(':')) {
      // Nếu endTime đã ở định dạng "11:00", sử dụng trực tiếp
      if (slot.endTime.length <= 5) {
        return slot.endTime
      }
      // Nếu endTime là datetime ISO string hoặc định dạng khác
      else {
        const date = new Date(slot.endTime)
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`
      }
    }

    // Nếu không có endTime, tính toán tự động (giả sử mỗi slot kéo dài 1 giờ)
    if (slot.startTime) {
      const startDate = new Date(slot.startTime)
      // Giả sử mỗi slot kéo dài 60 phút
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)
      const hours = endDate.getHours().toString().padStart(2, '0')
      const minutes = endDate.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }

    return '' // Fallback
  }

  // Scroll to selected time on mount and when selectedTime changes
  React.useEffect(() => {
    if (selectedTimeRef.current) {
      selectedTimeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [selectedTime])

  if (sortedSlots.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Empty
          title="Không có khung giờ khả dụng"
          description="Vui lòng chọn một ngày khác để xem các khung giờ có sẵn"
        />
      </div>
    )
  }

  return (
    <div className="w-full min-h-full overflow-auto">
      <div className="p-2 bg-background rounded-xl w-full">
        <div className="grid grid-cols-2 gap-2">
          {sortedSlots.map((slot) => {
            const startTimeStr = formatTimeFromSlot(slot)
            const endTimeStr = formatEndTimeFromSlot(slot)
            const isSelected = selectedTime === startTimeStr

            return (
              <div key={slot.id} ref={isSelected ? selectedTimeRef : null}>
                <Button
                  size="sm"
                  variant="outline"
                  className={cn(
                    'w-full text-center h-10 rounded-lg font-medium overflow-hidden border border-border relative transition-all duration-200 ease-in-out',
                    isSelected
                      ? 'bg-primary text-white border-primary font-semibold'
                      : 'hover:bg-primary/10 hover:text-primary hover:border-primary hover:-translate-y-0.5',
                  )}
                  onClick={() => handleChangeAvailableTime(startTimeStr, slot.id)}
                >
                  <div className="flex flex-row items-center justify-center w-full">
                    <span className="text-sm">{startTimeStr}</span>
                    <span className="text-sm">: {endTimeStr}</span>
                  </div>
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
