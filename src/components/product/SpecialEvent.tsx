import { Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface SpecialEventProps {
  time: string
  title: string
}
export default function SpecialEvent({ title, time }: SpecialEventProps) {
  const { t } = useTranslation()

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // This function will parse the passed `time` (HH:MM:SS)
  const parseTime = (time: string) => {
    const [hours, minutes, seconds] = time.split(':').map(Number)
    return { hours, minutes, seconds }
  }
  useEffect(() => {
    const { hours, minutes, seconds } = parseTime(time)
    setTimeLeft({ hours, minutes, seconds })

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newSeconds = prev.seconds - 1
        const newMinutes = newSeconds < 0 ? prev.minutes - 1 : prev.minutes
        const newHours = newMinutes < 0 ? prev.hours - 1 : prev.hours

        return {
          hours: newHours < 0 ? 23 : newHours,
          minutes: newMinutes < 0 ? 59 : newMinutes,
          seconds: newSeconds < 0 ? 59 : newSeconds,
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [time])

  return (
    <div className="bg-[#FF4D15] text-white px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 fill-white" />
        <span className="font-bold tracking-wide uppercase">{title}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm uppercase">{t('event.finishIn')}</span>
        <div className="flex gap-1" role="timer" aria-label="Flash sale countdown timer">
          <div className="bg-black rounded px-1.5 py-0.5 min-w-[28px] text-center">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="bg-black rounded px-1.5 py-0.5 min-w-[28px] text-center">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="bg-black rounded px-1.5 py-0.5 min-w-[28px] text-center">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  )
}
