import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { OrderRequestTypeEnum, RequestStatusEnum } from '@/types/enum'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

interface FilterProps {
  onFilterChange: (typeFilters: OrderRequestTypeEnum[], statusFilters: RequestStatusEnum[]) => void
}
export const OrderRequestFilter = ({ onFilterChange }: FilterProps) => {
  const { t } = useTranslation()
  const [typeFilters, setTypeFilters] = useState<OrderRequestTypeEnum[]>([])
  const [statusFilters, setStatusFilters] = useState<RequestStatusEnum[]>([])
  const [typeOpen, setTypeOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)

  const requestTypes = [
    { value: OrderRequestTypeEnum.CANCEL, label: t('requestTypes.cancel') },
    { value: OrderRequestTypeEnum.REFUND, label: t('requestTypes.return') },
    { value: OrderRequestTypeEnum.REJECT_REFUND, label: t('requestTypes.rejectReturn') },
    { value: OrderRequestTypeEnum.COMPLAINT, label: t('requestTypes.complaint') },
  ]

  const requestStatuses = [
    { value: RequestStatusEnum.PENDING, label: t('requestStatus.pending') },
    { value: RequestStatusEnum.APPROVED, label: t('requestStatus.approved') },
    { value: RequestStatusEnum.REJECTED, label: t('requestStatus.rejected') },
  ]

  const toggleType = (value: OrderRequestTypeEnum) => {
    const newValues = typeFilters.includes(value)
      ? typeFilters.filter((item) => item !== value)
      : [...typeFilters, value]

    setTypeFilters(newValues)
    onFilterChange(newValues, statusFilters)
  }

  const toggleStatus = (value: RequestStatusEnum) => {
    const newValues = statusFilters.includes(value)
      ? statusFilters.filter((item) => item !== value)
      : [...statusFilters, value]

    setStatusFilters(newValues)
    onFilterChange(typeFilters, newValues)
  }

  const clearFilters = () => {
    setTypeFilters([])
    setStatusFilters([])
    onFilterChange([], [])
  }
  console.log(requestTypes)
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Show active filters */}
      <div className="flex flex-wrap gap-2">
        {typeFilters.map((filter) => (
          <Badge
            key={`type-${filter}`}
            variant="secondary"
            className="flex items-center gap-1 bg-purple-100 text-purple-600 hover:text-purple-600"
            onClick={() => toggleType(filter)}
          >
            {requestTypes.find((t) => t.value === filter)?.label}
            <span className="cursor-pointer">×</span>
          </Badge>
        ))}
        {statusFilters.map((filter) => (
          <Badge
            key={`status-${filter}`}
            variant="secondary"
            className="flex items-center gap-1 bg-orange-100 text-orange-600 hover:text-orange-600"
            onClick={() => toggleStatus(filter)}
          >
            {requestStatuses.find((s) => s.value === filter)?.label}
            <span className="cursor-pointer">×</span>
          </Badge>
        ))}

        {(typeFilters.length > 0 || statusFilters.length > 0) && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-gray-500">
            {t('filter.reset')}
          </Button>
        )}
      </div>
      {/* Request Type Filter */}
      <div className="w-full sm:w-auto">
        <Popover open={typeOpen} onOpenChange={setTypeOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={typeOpen}
              className="w-full justify-between border border-primary/40 hover:bg-primary/10 text-primary hover:text-primary"
            >
              {typeFilters.length > 0 ? `${t('request.typeSelected')}: ${typeFilters.length}` : t('request.selectType')}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput className="" placeholder={t('request.searchType')} />
              <CommandList>
                <CommandEmpty>{t('request.noTypeFound')}</CommandEmpty>
                <CommandGroup>
                  {requestTypes
                    ? requestTypes?.map((type) => (
                        <CommandItem key={type.value} value={type.value} onSelect={() => toggleType(type.value)}>
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              typeFilters?.includes(type.value) ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          {type.label}
                        </CommandItem>
                      ))
                    : null}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Request Status Filter */}
      <div className="w-full sm:w-auto">
        <Popover open={statusOpen} onOpenChange={setStatusOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={statusOpen}
              className="w-full justify-between border border-primary/40 hover:bg-primary/10 text-primary hover:text-primary"
            >
              {statusFilters.length > 0
                ? `${t('request.statusSelected')}: ${statusFilters.length}`
                : t('request.selectStatus')}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder={t('request.searchStatus')} />
              <CommandList>
                <CommandEmpty>{t('request.noStatusFound')}</CommandEmpty>
                <CommandGroup>
                  {requestStatuses.map((status) => (
                    <CommandItem key={status.value} value={status.value} onSelect={() => toggleStatus(status.value)}>
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          statusFilters.includes(status.value) ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {status.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
