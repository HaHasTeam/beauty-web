import { useCountdown } from '@/hooks/useCountDown'

import { TimeUnit } from './UnitTime'

interface CountdownProps {
  targetDate: string
  language?: 'en' | 'vi'
}

const labels = {
  en: {
    days: 'days',
    hours: 'hrs',
    minutes: 'min',
    seconds: 'sec',
  },
  vi: {
    days: 'ngày',
    hours: 'giờ',
    minutes: 'phút',
    seconds: 'giây',
  },
}

export function Countdown({ targetDate, language = 'en' }: CountdownProps) {
  const timeLeft = useCountdown(targetDate)

  return (
    <div className="flex items-center justify-center gap-1 w-full flex-wrap xs:flex-nowrap">
      <TimeUnit value={timeLeft.days} label={labels[language].days} />
      <div className="text-base font-bold">:</div>
      <TimeUnit value={timeLeft.hours} label={labels[language].hours} />
      <div className="text-base font-bold">:</div>
      <TimeUnit value={timeLeft.minutes} label={labels[language].minutes} />
      <div className="text-base font-bold">:</div>
      <TimeUnit value={timeLeft.seconds} label={labels[language].seconds} />
    </div>
  )
}
