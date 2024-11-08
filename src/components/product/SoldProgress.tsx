import { useTranslation } from 'react-i18next'

interface SoldProgressProps {
  soldAmount: number
  maxAmount: number
}

export default function SoldProgress({ soldAmount, maxAmount }: SoldProgressProps) {
  const { t } = useTranslation()
  const progress = Math.min(Math.max(soldAmount / maxAmount, 0), 1) * 100

  return (
    <div className="w-full bg-gray-200 h-4 rounded-full relative flex items-center text-center">
      <div className="absolute z-10 h-full bg-rose-500 rounded-full " style={{ width: `${progress}%` }}></div>
      <div className="w-full absolute z-20 flex items-center justify-center">
        <span className="text-muted-foreground text-center text-xs">
          {t('product.sold', { amount: soldAmount ? soldAmount : 0 })}
        </span>
      </div>
    </div>
  )
}
