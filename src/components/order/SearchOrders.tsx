import { Search } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SearchOrdersProps {
  onSearch?: (query: string) => void
}

export default function SearchOrders({ onSearch }: SearchOrdersProps) {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSearch?.(inputValue.trim())
  }

  const handleReset = () => {
    setInputValue('')
    onSearch?.('')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center rounded-lg shadow-sm">
        <div className="flex-1 flex items-center border rounded-l-md bg-white">
          <Search className="w-5 h-5 text-muted-foreground ml-3" />
          <Input
            value={inputValue}
            onChange={handleInputChange}
            type="search"
            name="search"
            placeholder={t('search.orderPlaceholder')}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        <Button
          type="submit"
          variant="default"
          className="text-primary-foreground hover:text-primary-foreground hover:bg-primary/80 px-4 font-medium rounded-l-none"
        >
          {t('search.orderButton')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="ml-2 text-muted-foreground hover:text-muted-foreground/80 hover:bg-red-50 px-4 font-medium"
        >
          {t('search.reset')}
        </Button>
      </div>
    </form>
  )
}
