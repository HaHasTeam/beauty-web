import { ChevronDown } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

const ProductSort = ({
  sortOption,
  setSortOption,
}: {
  sortOption: string | null
  setSortOption: Dispatch<SetStateAction<string | null>>
}) => {
  const { t } = useTranslation()

  const handleSortChange = (id: string | null) => {
    setSortOption(id)
  }
  return (
    <div className="w-full bg-secondary/50 rounded-sm">
      <div className="w-full p-3 flex justify-between items-center gap-2">
        <span className="text-secondary-foreground font-semibold">{t('sort.title')}</span>

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
