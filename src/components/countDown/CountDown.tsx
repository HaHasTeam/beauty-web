import { useCountdown } from '@/hooks/useCountDown'

import { TimeUnit } from './UnitTime'

interface CountdownProps {
  targetDate: string
  language?: 'en' | 'vi'
}

const labels = {
  en: {
    days: 'days',
    hours: 'hours',
    minutes: 'minutes',
    seconds: 'seconds',
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
    <div className="flex items-center gap-2 justify-center">
      <TimeUnit value={timeLeft.days} label={labels[language].days} />
      <div className="text-2xl font-bold">:</div>
      <TimeUnit value={timeLeft.hours} label={labels[language].hours} />
      <div className="text-2xl font-bold">:</div>
      <TimeUnit value={timeLeft.minutes} label={labels[language].minutes} />
      <div className="text-2xl font-bold">:</div>
      <TimeUnit value={timeLeft.seconds} label={labels[language].seconds} />
    </div>
  )
}
