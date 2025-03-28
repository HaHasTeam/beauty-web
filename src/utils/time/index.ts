import { formatDate, formatDistanceToNow } from 'date-fns'

/**
 * Converts milliseconds to days, rounding up to the next whole number
 * @param milliseconds The time in milliseconds
 * @returns The number of days (rounded up)
 */
export const millisecondsToRoundedDays = (milliseconds: number): number => {
  const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000

  const days = milliseconds / MILLISECONDS_PER_DAY

  return Math.ceil(days)
}

export const formatMessageTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  const now = new Date()

  // If the message is from today, show the time
  if (date.toDateString() === now.toDateString()) {
    return formatDate(date, 'h:mm a')
  }

  // If the message is from this week, show the day
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diffInDays < 7) {
    return formatDate(date, 'EEE h:mm a')
  }

  // Otherwise, show the date
  return formatDate(date, 'MMM d, yyyy')
}

export const formatRelativeTime = (timestamp: number): string => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
}
