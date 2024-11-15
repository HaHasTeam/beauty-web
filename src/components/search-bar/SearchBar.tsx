import { Search } from 'lucide-react'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

const SearchBar = () => {
  return (
    <div className="flex-1 px-2 md:px-12">
      <div className="flex w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-10 pr-4 rounded-r-none"
            defaultValue="mask"
          />
        </div>
        <Button className="rounded-l-none border-primary">
          <Search className="text-primary-foreground" />
        </Button>
      </div>
      <div className="mt-1 flex space-x-4 text-sm text-gray-500">
        <span>mask</span>
        <span>toner</span>
        <span>cushion</span>
        <span>lipstick</span>
      </div>
    </div>
  )
}

export default SearchBar
