'use client'

import { type CalendarDate, getLocalTimeZone, getWeeksInMonth, parseDate, today } from '@internationalized/date'
import type { DateValue } from '@react-aria/calendar'
import { useLocale } from '@react-aria/i18n'
import * as React from 'react'

import { Calendar } from '@/components/calendar'

import { FormPanel } from './form-panel'
import { RightPanel } from './right-panel'

export interface BookingCalendarProps {
  onDateTimeSelect?: (dateTime: string) => void
  onClose?: () => void
  selectedDateTime?: string
}

export function BookingCalendar({ onDateTimeSelect, onClose, selectedDateTime }: BookingCalendarProps) {
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

  // Update internal state when selectedDateTime prop changes
  React.useEffect(() => {
    if (selectedDateTime) {
      const dateObj = new Date(selectedDateTime)
      setDate(parseDate(dateObj.toISOString().split('T')[0]))

      const hours = dateObj.getHours()
      const minutes = dateObj.getMinutes()

      // Format with leading zeros for 24-hour time
      const formattedHours = hours < 10 ? `0${hours}` : `${hours}`
      const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`

      setSelectedTime(`${formattedHours}:${formattedMinutes}`)
    }
  }, [selectedDateTime])

  const weeksInMonth = getWeeksInMonth(focusedDate as DateValue, locale)

  const handleChangeDate = (date: DateValue) => {
    setDate(date as CalendarDate)
    if (selectedTime) {
      handleDateTimeSelection(date as CalendarDate, selectedTime)
    }
  }

  const handleChangeAvailableTime = (time: string) => {
    setSelectedTime(time)
    handleDateTimeSelection(date, time)
  }

  // Tạo datetime string từ ngày và giờ đã chọn (định dạng 24h)
  const handleDateTimeSelection = (selectedDate: CalendarDate, time: string) => {
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
      onDateTimeSelect(dateTimeString)
      if (onClose) {
        onClose()
      }
    }
  }

  // CSS styles to highlight selected items
  React.useEffect(() => {
    // Add custom styling for selected dates and times
    const style = document.createElement('style')
    style.textContent = `
			/* Highlight selected date with strong background and border */
			.calendar-container .react-aria-Cell[aria-selected="true"] {
				background-color: var(--primary) !important;
				color: white !important;
				font-weight: bold !important;
				border-radius: 999px !important;
				position: relative;
				z-index: 1;
				transform: scale(1.1);
				box-shadow: 0 2px 8px rgba(0,0,0,0.2);
			}
			
			/* Add a dot indicator under today's date */
			.calendar-container .react-aria-Cell[data-today="true"]::after {
				content: "";
				position: absolute;
				bottom: 2px;
				left: 50%;
				transform: translateX(-50%);
				width: 4px;
				height: 4px;
				background-color: var(--primary);
				border-radius: 50%;
			}
			
			/* Improve hover effect on calendar cells */
			.calendar-container .react-aria-Cell:not([aria-selected="true"]):hover {
				background-color: var(--primary-light, #f0f7ff) !important;
				color: var(--primary) !important;
				transform: scale(1.05);
				transition: all 0.2s ease;
			}
			
			/* Enhanced Calendar styling */
			.calendar-container .react-aria-Calendar {
				--highlight-background: var(--primary);
				--highlight-foreground: white;
				--cell-size: 40px;
				padding: 8px;
				border-radius: 12px;
				background-color: var(--background);
				box-shadow: 0 4px 12px rgba(0,0,0,0.05);
				border: 1px solid var(--border);
			}
			
			.calendar-container .react-aria-Button {
				transition: all 0.2s ease;
			}
			
			.calendar-container .react-aria-Button:hover {
				background-color: var(--primary-light, #f0f7ff);
				color: var(--primary);
			}
			
			.calendar-container .react-aria-CalendarCell:focus {
				outline: none;
				box-shadow: 0 0 0 2px var(--primary);
			}
			
			/* Custom styling for time slots (sync with right-panel component) */
			.time-selection-container .time-slot {
				transition: all 0.3s ease;
				position: relative;
				overflow: hidden;
				border-radius: 0.5rem;
				font-weight: 500;
			}
			
			.time-selection-container .time-slot:hover {
				background-color: var(--primary-light, #f0f7ff);
				color: var(--primary);
				border-color: var(--primary-light);
				transform: translateY(-2px) scale(1.02);
				box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
			}
			
			.time-selection-container .time-slot:active {
				transform: scale(0.95);
			}
			
			.time-selection-container .time-slot.selected {
				background-color: var(--primary) !important;
				color: white !important;
				border-color: var(--primary) !important;
				font-weight: 700;
				transform: scale(1.05);
				box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
			}
			
			.time-selection-container .time-slot.selected::after {
				content: '';
				position: absolute;
				inset: 0;
				background: linear-gradient(to bottom right, rgba(255,255,255,0.2), transparent);
				pointer-events: none;
			}
			
			/* Custom scrollbar styling */
			.custom-scrollbar::-webkit-scrollbar {
				width: 6px;
			}
			
			.custom-scrollbar::-webkit-scrollbar-track {
				background: #f1f1f1;
				border-radius: 10px;
			}
			
			.custom-scrollbar::-webkit-scrollbar-thumb {
				background: #cdcdcd;
				border-radius: 10px;
			}
			
			.custom-scrollbar::-webkit-scrollbar-thumb:hover {
				background: #aaaaaa;
			}
		`
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const showForm = false

  return (
    <div className="w-full bg-background px-4 sm:px-8 py-6 rounded-md shadow-sm border border-border/50">
      <div className="flex flex-col md:flex-row gap-6">
        {!showForm ? (
          <>
            <div className="calendar-container">
              <Calendar
                minValue={today(localTimeZone)}
                defaultValue={today(localTimeZone)}
                value={date}
                onChange={handleChangeDate}
                onFocusChange={(focused) => setFocusedDate(focused)}
              />
            </div>

            <div className="time-selection-container w-fit">
              <h3 className="text-lg font-medium mb-3">Chọn thời gian</h3>
              <div className="max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                <RightPanel
                  date={date}
                  timeZone={localTimeZone}
                  weeksInMonth={weeksInMonth}
                  handleChangeAvailableTime={handleChangeAvailableTime}
                  selectedTime={selectedTime}
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
