import { useTranslation } from 'react-i18next'

import { OrderEnum, ProductCartStatusEnum } from '@/types/enum'

interface ProductTagProps {
  tag: string
  text?: string
  size?: 'small' | 'medium' | 'large'
}

export default function ProductTag({ tag, text, size = 'medium' }: ProductTagProps) {
  const { t } = useTranslation()

  let tagColorClass = ''
  let tagText = ''
  const sizeClasses = {
    small: 'px-1 text-xs',
    medium: 'px-2 py-1 text-sm sm:text-xs',
    large: 'p-3 lg:text-base md:text-sm sm:text-xs',
  }

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
    case ProductCartStatusEnum.HIDDEN: // use for product in cart
      tagColorClass = 'bg-gray-200 text-gray-800'
      tagText = t('productTag.hidden')
      break
    case ProductCartStatusEnum.SOLD_OUT: // use for product in cart
      tagColorClass = 'bg-red-100 text-red-500'
      tagText = t('productTag.outOfStock')
      break
    case OrderEnum.FLASH_SALE:
      tagColorClass = 'bg-orange-200 text-orange-800'
      tagText = t('productTag.flashSale')
      break
    case 'LiveStream':
      tagColorClass = 'bg-white text-red-500 border border-red-500'
      tagText = t('productTag.liveStream')
      break
    case OrderEnum.GROUP_BUYING:
      tagColorClass = 'bg-white text-orange-500 border border-orange-500'
      tagText = t('productTag.groupBuying')
      break
    case OrderEnum.PRE_ORDER:
      tagColorClass = 'bg-white text-yellow-500 border border-yellow-500'
      tagText = t('productTag.preOrder')
      break
    default:
      tagColorClass = 'bg-gray-200 text-gray-800' // Default color
      tagText = tag // Default to the tag string if no match is found
      break
  }

  return (
    <span className={`${sizeClasses[size]} cursor-default rounded-md font-medium ${tagColorClass}`}>
      {text ? text : tagText}
    </span>
  )
}
