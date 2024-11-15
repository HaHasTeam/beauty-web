import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

const ProductSort = () => {
  const { t } = useTranslation()
  const [sortOption, setSortOption] = useState<null | string>('related')
  const sortButton = [
    { id: 'related', value: `${t('sort.related')}` },
    { id: 'lasted', value: `${t('sort.lasted')}` },
    { id: 'trend', value: `${t('sort.trend')}` },
  ]
  const handleSortChange = (id: string | null) => {
    setSortOption(id)
    console.log(sortOption)
  }
  return (
    <div className="w-full bg-accent rounded-sm">
      <div className="w-full p-3 flex align-middle items-center gap-2">
        <span className="text-gray-500 font-semibold">{t('sort.title')}</span>
        {sortButton.map((bt) => (
          <Button
            className={`${bt.id === sortOption && 'hover:bg-primary/80'}`}
            variant={bt.id === sortOption ? 'default' : 'outline'}
            key={bt.id}
            onClick={() => handleSortChange(bt.id)}
          >
            {bt.value}
          </Button>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`${sortOption === 'priceLowToHigh' || sortOption === 'priceHighToLow' ? 'bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground' : 'bg-white'} inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 `}
          >
            {t('sort.price')}
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleSortChange('priceLowToHigh')}>
              {t('sort.lowToHigh')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange('priceHighToLow')}>
              {t('sort.highToLow')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default ProductSort
