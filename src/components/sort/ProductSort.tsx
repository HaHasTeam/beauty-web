import { ChevronDown } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Separator } from '../ui/separator'

// Assuming ProductTagEnum is imported or defined elsewhere
// If not defined, you'll need to import it
// import { ProductTagEnum } from '@/types'

const ProductSort = ({
  sortOption,
  setSortOption,
}: {
  sortOption?: string
  setSortOption: Dispatch<SetStateAction<string | undefined>>
}) => {
  const { t } = useTranslation()

  const handleSortChange = (id?: string) => {
    setSortOption(id)
  }

  // Helper function to get the display text for the current sort option
  const getSortDisplayText = () => {
    if (sortOption === 'HOT') {
      return t('sort.related')
    } else if (sortOption === 'NEW') {
      return t('sort.lasted')
    } else if (sortOption === 'BEST_SELLER') {
      return t('sort.trend')
    } else if (sortOption === 'priceLowToHigh') {
      return t('sort.lowToHigh')
    } else if (sortOption === 'priceHighToLow') {
      return t('sort.highToLow')
    }
    return t('sort.title')
  }

  return (
    <div className="w-full bg-secondary/50 rounded-sm">
      <div className="w-full p-3 flex justify-between items-center gap-2">
        <span className="text-secondary-foreground font-semibold">{t('sort.title')}</span>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={`${sortOption ? 'bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground' : 'bg-white'} inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 `}
          >
            {getSortDisplayText()}
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleSortChange('HOT')}>{t('sort.related')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange('NEW')}>{t('sort.lasted')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange('BEST_SELLER')}>{t('sort.trend')}</DropdownMenuItem>

            {/* Separator */}
            <Separator className="my-1" />

            {/* Price sorting options */}
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
