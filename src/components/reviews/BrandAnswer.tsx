import { useTranslation } from 'react-i18next'

interface BrandAnswerProps {
  brandName: string
  updatedAt: string
  description: string
  brandLogo: string | null
}
const BrandAnswer = ({ brandName, updatedAt, description, brandLogo }: BrandAnswerProps) => {
  const { t } = useTranslation()
  return (
    <div className="rounded-lg bg-secondary/20 p-4">
      <div className="flex gap-2 items-center">
        <div className="flex gap-2 items-center">
          {brandLogo && (
            <div className="w-6 h-6">
              <img src={brandLogo} alt={brandName} className="object-cover w-full h-full rounded-full" />
            </div>
          )}
          <span className="font-semibold text-sm">{brandName}</span>
        </div>
        <div className="border-l px-2 border-gray-500">
          <span className="text-gray-500 text-sm">
            Last updated: {t('date.toLocaleDateString', { val: new Date(updatedAt) })}
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-700">{description}</p>
    </div>
  )
}

export default BrandAnswer
