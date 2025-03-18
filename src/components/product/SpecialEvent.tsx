import { Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { OrderEnum } from '@/types/enum'

interface SpecialEventProps {
  time: string
  title: string
}
export default function SpecialEvent({ title, time }: SpecialEventProps) {
  const { t } = useTranslation()

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const calculateTimeLeft = (endTime: string) => {
    const end = new Date(endTime).getTime()
    const now = new Date().getTime()
    const difference = Math.max(end - now, 0) // Ensure no negative values

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((difference / (1000 * 60)) % 60)
    const seconds = Math.floor((difference / 1000) % 60)

    return { days, hours, minutes, seconds }
  }

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(time))

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(time))
    }, 1000)

    return () => clearInterval(timer)
  }, [time])

  return (
    <div
      className={`text-white px-4 py-2 flex items-center justify-between rounded-sm ${title === OrderEnum.FLASH_SALE ? 'bg-rose-500' : 'bg-yellow-500'}`}
    >
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 fill-white" />
        <span className="font-bold tracking-wide uppercase">{title}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm uppercase">{t('event.finishIn')}</span>
        <div className="flex gap-1" role="timer" aria-label="Flash sale countdown timer">
          <div className="flex flex-col items-center">
            <div className="bg-black rounded px-1.5 py-0.5 min-w-[28px] text-center">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <span className="text-xs mt-1 text-white/80">{t('event.days')}</span>
          </div>

          <span className="text-lg font-bold">:</span>

          <div className="flex flex-col items-center">
            <div className="bg-black rounded px-1.5 py-0.5 min-w-[28px] text-center">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <span className="text-xs mt-1 text-white/80">{t('event.hours')}</span>
          </div>

          <span className="text-lg font-bold">:</span>

          <div className="flex flex-col items-center">
            <div className="bg-black rounded px-1.5 py-0.5 min-w-[28px] text-center">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <span className="text-xs mt-1 text-white/80">{t('event.minutes')}</span>
          </div>

          <span className="text-lg font-bold">:</span>

          <div className="flex flex-col items-center">
            <div className="bg-black rounded px-1.5 py-0.5 min-w-[28px] text-center">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <span className="text-xs mt-1 text-white/80">{t('event.seconds')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
