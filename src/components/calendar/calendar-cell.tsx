import { type CalendarDate, getLocalTimeZone, isSameMonth, isToday } from '@internationalized/date'
import { useCalendarCell } from '@react-aria/calendar'
import { useFocusRing } from '@react-aria/focus'
import { mergeProps } from '@react-aria/utils'
import type { CalendarState } from '@react-stately/calendar'
import { useRef } from 'react'

import { cn } from '@/lib/utils'

export function CalendarCell({
  state,
  date,
  currentMonth,
}: {
  state: CalendarState
  date: CalendarDate
  currentMonth: CalendarDate
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { cellProps, buttonProps, isSelected, isDisabled, formattedDate } = useCalendarCell({ date }, state, ref)

  const isOutsideMonth = !isSameMonth(currentMonth, date)

  const isDateToday = isToday(date, getLocalTimeZone())

  const { focusProps, isFocusVisible } = useFocusRing()

  return (
    <td {...cellProps} className={cn('py-0.5 relative px-0.5', isFocusVisible ? 'z-10' : 'z-0')}>
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideMonth}
        className="size-14 outline-none group rounded-md"
      >
        <div
          className={cn(
            'size-full rounded-full flex items-center justify-center relative',
            'text-foreground text-sm font-semibold transition-all duration-200',
            isDisabled
              ? isDateToday
                ? 'cursor-default opacity-70'
                : 'text-muted-foreground/60 cursor-default'
              : 'cursor-pointer hover:scale-105',
            // Focus ring, visible while the cell has keyboard focus.
            isFocusVisible && 'ring-2 group-focus:z-10 ring-primary/70 ring-offset-2',
            // Enhanced selection styling for selected dates
            isSelected && 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/30 scale-110 z-10',
            // Hover state for non-selected cells.
            !isSelected && !isDisabled && 'hover:bg-primary/20 hover:text-primary hover:shadow-md',
            // Today indicator - more prominent
            isDateToday && !isSelected && 'border-2 border-primary/70',
            // Add animation for selection
            isSelected && 'animate-pulse-once',
          )}
        >
          {formattedDate}
          {isDateToday && (
            <div
              className={cn(
                'absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-1/2 size-1.5 bg-gray-12 rounded-full',
                isSelected && 'bg-gray-1',
              )}
            />
          )}
        </div>
      </div>
    </td>
  )
}
