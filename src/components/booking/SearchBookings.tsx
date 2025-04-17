import { Search } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SearchBookingsProps {
  onSearch: (query: string) => void
}

const SearchBookings = ({ onSearch }: SearchBookingsProps) => {
  const { t } = useTranslation()
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = () => {
    onSearch(searchValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="flex w-full items-center gap-2 rounded-lg shadow-sm border border-gray-100">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('booking.searchPlaceholder', 'Tìm kiếm theo ID...')}
          className="w-full rounded-md  pl-10 pr-4 py-2 h-11 bg-white"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Button
        onClick={handleSearch}
        variant="default"
        size="sm"
        className="h-11 px-4 bg-primary hover:bg-primary/90 transition-colors shadow-sm"
      >
        <Search className="h-4 w-4 mr-2" />
        {t('common.search', 'Tìm kiếm')}
      </Button>
    </div>
  )
}

export default SearchBookings
