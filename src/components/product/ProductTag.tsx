import { useTranslation } from 'react-i18next'

interface ProductTagProps {
  tag: string
  text?: string
}

export default function ProductTag({ tag, text }: ProductTagProps) {
  const { t } = useTranslation()

  let tagColorClass = ''
  let tagText = ''

  // Define color based on tag
  switch (tag) {
    case 'Best Seller':
      tagColorClass = 'bg-yellow-200 text-yellow-800'
      tagText = t('productTag.bestSeller')
      break
    case 'Limited Edition':
      tagColorClass = 'bg-purple-200 text-purple-800'
      tagText = t('productTag.limitedEdition')
      break
    case 'New Arrival':
      tagColorClass = 'bg-blue-200 text-blue-800'
      tagText = t('productTag.newArrival')
      break
    case 'Hot Deal':
      tagColorClass = 'bg-red-200 text-red-800'
      tagText = t('productTag.hotDeal')
      break
    case 'DealPercent':
      tagColorClass = 'bg-red-100 text-red-500'
      break
    case 'Flash Sale':
      tagColorClass = 'bg-orange-200 text-orange-800'
      tagText = t('productTag.flashSale')
      break
    default:
      tagColorClass = 'bg-gray-200 text-gray-800' // Default color
      tagText = tag // Default to the tag string if no match is found
      break
  }

  return <span className={`px-2 py-1 rounded-md text-sm font-medium ${tagColorClass}`}>{text ? text : tagText}</span>
}
