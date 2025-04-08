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
    <div className="flex w-full items-center gap-2">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('booking.searchPlaceholder', 'Tìm kiếm theo ID...')}
          className="w-full rounded-md border pl-8 pr-10 py-2"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Button onClick={handleSearch} variant="default" size="sm" className="h-10">
        {t('common.search', 'Tìm kiếm')}
      </Button>
    </div>
  )
}

export default SearchBookings
