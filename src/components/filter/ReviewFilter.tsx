import { Check, Star } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

interface FilterOption {
  id: string
  label: string
  value: string | number
  type: 'toggle' | 'star'
}

export default function ReviewFilter() {
  const { t } = useTranslation()
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set())

  const filterOptions: FilterOption[] = [
    { id: 'newest', label: `${t('filter.newest')}`, value: 'newest', type: 'toggle' },
    { id: 'has-image', label: `${t('filter.hasImage')}`, value: 'has-image', type: 'toggle' },
    { id: 'star-5', label: `${t('filter.numberOfStar', { count: 5 })}`, value: 5, type: 'star' },
    { id: 'star-4', label: `${t('filter.numberOfStar', { count: 4 })}`, value: 4, type: 'star' },
    { id: 'star-3', label: `${t('filter.numberOfStar', { count: 3 })}`, value: 3, type: 'star' },
    { id: 'star-2', label: `${t('filter.numberOfStar', { count: 2 })}`, value: 2, type: 'star' },
    { id: 'star-1', label: `${t('filter.numberOfStar', { count: 1 })}`, value: 1, type: 'star' },
  ]

  const toggleFilter = (filterId: string) => {
    const newFilters = new Set(selectedFilters)
    if (newFilters.has(filterId)) {
      newFilters.delete(filterId)
    } else {
      newFilters.add(filterId)
    }
    setSelectedFilters(newFilters)
    console.log(newFilters)
  }

  return (
    <div className="p-5 flex flex-col gap-2">
      <span className="font-semibold">{t('filter.filterBy')}</span>
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <Button
            key={option.id}
            variant={selectedFilters.has(option.id) ? 'outline' : 'outline'}
            onClick={() => toggleFilter(option.id)}
            className={`h-8 gap-1.5 rounded-full border-gray-300 ${selectedFilters.has(option.id) ? ' border-primary bg-primary/10 hover:bg-primary/15 text-primary hover:text-primary' : 'border-gray-300'}`}
          >
            {option.type === 'toggle' && selectedFilters.has(option.id) && <Check className="text-primary/80" />}
            {option.label}
            {option.type === 'star' && <Star className="w-4 h-4 fill-current text-yellow-500" />}
          </Button>
        ))}
      </div>
    </div>
  )
}
