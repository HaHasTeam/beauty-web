import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const keyword = searchParams.get('keyword') || ''
    setQuery(keyword)
    if (keyword) {
      handleSearch() // Trigger search when query parameter is found in URL
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])
  const suggestions = ['mask', 'toner', 'cushion', 'lipstick']
  return (
    <div className="flex-1 px-2 md:px-12">
      <div className="flex w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-10 pr-4 rounded-r-none"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button className="rounded-l-none border-primary" onClick={() => handleSearch()}>
          <Search className="text-primary-foreground" />
        </Button>
      </div>
      <div className="mt-1 flex space-x-4 text-sm text-gray-500">
        {suggestions.map((suggestion) => (
          <span
            key={suggestion}
            className="cursor-pointer hover:text-gray-700"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </span>
        ))}
      </div>
    </div>
  )
}

export default SearchBar
