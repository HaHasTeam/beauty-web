'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronUp, Filter } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@/components/button'
import { CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getAllCategoryApi } from '@/network/apis/category'
import { ICategory } from '@/types/category'
import { ProductEnum } from '@/types/enum'

import { Slider } from '../ui/slider'

export interface PriceRange {
  min: number | null
  max: number | null
}

interface ProductFilterProps {
  onCategoriesSelect: (categoryIds: string[]) => void

  onStatusSelect: (statuses: ProductEnum[]) => void
  onPriceRangeSelect: (priceRange: PriceRange) => void
  selectedCategoryIds?: string[]
  selectedStatuses?: ProductEnum[]
  selectedPriceRange?: PriceRange
}

// Section identifiers for collapsible sections
type SectionId = 'main' | 'category' | 'tags' | 'status' | 'price'

// Price slider configuration
const MIN_PRICE = 0
const MAX_PRICE = 10000000 // 10 million VND
const STEP_PRICE = 100000 // 100,000 VND steps

// Price range presets for quick selection
const PRICE_PRESETS = [
  { label: 'filter.price.under500k', min: 0, max: 500000 },
  { label: 'filter.price.500kto1m', min: 500000, max: 1000000 },
  { label: 'filter.price.1mto2m', min: 1000000, max: 2000000 },
  { label: 'filter.price.2mto5m', min: 2000000, max: 5000000 },
  { label: 'filter.price.over5m', min: 5000000, max: MAX_PRICE },
]

// Format price with currency
const formatPrice = (price: number | null): string => {
  if (price === null) return ''
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price)
}

const ProductFilter = ({
  onCategoriesSelect,
  onStatusSelect,
  onPriceRangeSelect,
  selectedCategoryIds = [],

  selectedStatuses = [],
  selectedPriceRange = { min: null, max: null },
}: ProductFilterProps) => {
  const { t } = useTranslation()

  // Consolidated UI state for collapsible sections
  const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>({
    main: true,
    category: true,
    tags: true,
    status: true,
    price: true,
  })

  // Consolidated filter state
  const [filters, setFilters] = useState({
    categoryIds: selectedCategoryIds,

    statuses: selectedStatuses,
    priceRange: selectedPriceRange,
  })

  // Slider values state
  const [sliderValues, setSliderValues] = useState<[number, number]>([
    selectedPriceRange.min !== null ? selectedPriceRange.min : MIN_PRICE,
    selectedPriceRange.max !== null ? selectedPriceRange.max : MAX_PRICE,
  ])

  // Update filter state when props change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categoryIds: selectedCategoryIds,

      statuses: selectedStatuses,
      priceRange: selectedPriceRange,
    }))

    // Update slider values if price range changes from outside
    if (selectedPriceRange.min !== null || selectedPriceRange.max !== null) {
      setSliderValues([
        selectedPriceRange.min !== null ? selectedPriceRange.min : MIN_PRICE,
        selectedPriceRange.max !== null ? selectedPriceRange.max : MAX_PRICE,
      ])
    }
  }, [selectedCategoryIds, selectedStatuses, selectedPriceRange])

  const { data: categoryListData, isLoading: isCategoryListLoading } = useQuery({
    queryKey: [getAllCategoryApi.queryKey],
    queryFn: getAllCategoryApi.fn,
  })

  // Toggle section open/closed state
  const toggleSection = useCallback((section: SectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }, [])

  // Filter categories to only include level 1
  const level1Categories = useMemo(
    () => categoryListData?.data?.filter((category: ICategory) => category.level === 1) || [],
    [categoryListData?.data],
  )

  // Handle category selection
  const handleCategoryToggle = useCallback(
    (categoryId: string) => {
      setFilters((prev) => {
        const updatedCategoryIds = prev.categoryIds.includes(categoryId)
          ? prev.categoryIds.filter((id) => id !== categoryId)
          : [...prev.categoryIds, categoryId]

        onCategoriesSelect(updatedCategoryIds)
        return { ...prev, categoryIds: updatedCategoryIds }
      })
    },
    [onCategoriesSelect],
  )

  // Handle status selection
  const handleStatusToggle = useCallback(
    (status: ProductEnum) => {
      setFilters((prev) => {
        const updatedStatuses = prev.statuses.includes(status)
          ? prev.statuses.filter((s) => s !== status)
          : [...prev.statuses, status]

        onStatusSelect(updatedStatuses)
        return { ...prev, statuses: updatedStatuses }
      })
    },
    [onStatusSelect],
  )

  // Handle slider change
  const handleSliderChange = useCallback(
    (values: number[]) => {
      const [min, max] = values as [number, number]
      setSliderValues([min, max])

      // Update filters
      setFilters((prev) => ({
        ...prev,
        priceRange: { min, max },
      }))

      // Apply the price range immediately
      onPriceRangeSelect({ min, max })
    },
    [onPriceRangeSelect],
  )

  // Handle preset price range selection
  const handlePresetSelect = useCallback(
    (preset: { min: number; max: number }) => {
      setSliderValues([preset.min, preset.max])

      // Update filters
      setFilters((prev) => ({
        ...prev,
        priceRange: { min: preset.min, max: preset.max },
      }))

      // Apply the price range
      onPriceRangeSelect({ min: preset.min, max: preset.max })
    },
    [onPriceRangeSelect],
  )

  // Get status display name
  const getStatusDisplayName = useCallback(
    (status: ProductEnum) => {
      switch (status) {
        case ProductEnum.PRE_ORDER:
          return t('filter.status.preOrder', 'Pre-Order')
        case ProductEnum.OFFICIAL:
          return t('filter.status.official', 'Official')
        case ProductEnum.FLASH_SALE:
          return t('filter.status.flashSale', 'Flash Sale')
        case ProductEnum.OUT_OF_STOCK:
          return t('filter.status.outOfStock', 'Out of Stock')
        case ProductEnum.INACTIVE:
          return t('filter.status.inactive', 'Inactive')
        default:
          return status
      }
    },
    [t],
  )

  // Check if any filters are applied
  const hasFilters = useMemo(
    () =>
      filters.categoryIds.length > 0 ||
      filters.statuses.length > 0 ||
      filters.priceRange.min !== null ||
      filters.priceRange.max !== null,
    [filters],
  )

  // Handle apply filters
  const handleApplyFilters = useCallback(() => {
    onCategoriesSelect(filters.categoryIds)
    onStatusSelect(filters.statuses)
    onPriceRangeSelect({ min: sliderValues[0], max: sliderValues[1] })
  }, [filters, sliderValues, onCategoriesSelect, onStatusSelect, onPriceRangeSelect])

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <CardHeader className="text-primary pb-2 flex flex-row gap-2 items-center align-middle">
        <Filter className="h-5 w-5" />
        <span className="uppercase font-bold text-sm md:text-base">{t('filter.title', 'Filter')}</span>
        <button
          onClick={() => toggleSection('main')}
          className="ml-auto"
          aria-label={openSections.main ? 'Collapse filter' : 'Expand filter'}
        >
          {openSections.main ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </CardHeader>

      <Collapsible
        open={openSections.main}
        onOpenChange={(open) => setOpenSections((prev) => ({ ...prev, main: open }))}
      >
        <CollapsibleContent>
          <CardContent className="space-y-4 p-3 md:p-4">
            {/* Price Range Section */}
            <Collapsible
              open={openSections.price}
              onOpenChange={(open) => setOpenSections((prev) => ({ ...prev, price: open }))}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
                <span className="text-sm md:text-base font-medium">{t('filter.priceRange', 'Price Range')}</span>
                {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 py-2">
                {/* Price slider */}
                <div className="space-y-5 pt-4">
                  <Slider
                    defaultValue={sliderValues}
                    value={sliderValues}
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    step={STEP_PRICE}
                    onValueChange={handleSliderChange}
                    className="my-6"
                  />

                  <div className="flex justify-between items-center">
                    <div className="text-xs md:text-sm font-medium">{formatPrice(sliderValues[0])}</div>
                    <div className="text-xs md:text-sm font-medium">{formatPrice(sliderValues[1])}</div>
                  </div>
                </div>

                {/* Quick presets */}
                <div className="space-y-2">
                  <p className="text-xs md:text-sm font-medium">{t('filter.price.quickRanges', 'Quick Ranges')}</p>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                    {PRICE_PRESETS.map((preset, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handlePresetSelect(preset)}
                        className="text-xs h-auto py-1 px-2"
                      >
                        {preset.min === 0
                          ? t('filter.price.under', 'Under') + ' ' + formatPrice(preset.max)
                          : preset.max === MAX_PRICE
                            ? t('filter.price.over', 'Over') + ' ' + formatPrice(preset.min)
                            : formatPrice(preset.min) + ' - ' + formatPrice(preset.max)}
                      </Button>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Separator className="my-2" />

            {/* Categories Section */}
            <Collapsible
              open={openSections.category}
              onOpenChange={(open) => setOpenSections((prev) => ({ ...prev, category: open }))}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
                <span className="text-sm md:text-base font-medium">{t('filter.categories', 'Categories')}</span>
                {openSections.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent>
                {isCategoryListLoading ? (
                  <div className="py-4 text-center text-sm">Loading categories...</div>
                ) : level1Categories.length > 0 ? (
                  <ScrollArea className="max-h-[200px] md:max-h-[300px] pr-4 py-2">
                    <div className="space-y-2">
                      {level1Categories.map((category: ICategory) => (
                        <div key={category.id} className="flex items-center space-x-2 py-1">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={filters.categoryIds.includes(category.id)}
                            onCheckedChange={() => handleCategoryToggle(category.id)}
                          />
                          <Label htmlFor={`category-${category.id}`} className="cursor-pointer text-xs md:text-sm">
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="py-4 text-center text-sm">No categories found</div>
                )}
              </CollapsibleContent>
            </Collapsible>

            <Separator className="my-2" />

            {/* Product Status Section */}
            <Collapsible
              open={openSections.status}
              onOpenChange={(open) => setOpenSections((prev) => ({ ...prev, status: open }))}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
                <span className="text-sm md:text-base font-medium">{t('filter.productStatus', 'Product Status')}</span>
                {openSections.status ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 py-2">
                {Object.values(ProductEnum)
                  .filter(
                    (item) =>
                      item == ProductEnum.FLASH_SALE || item == ProductEnum.OFFICIAL || item == ProductEnum.PRE_ORDER,
                  )
                  .map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={filters.statuses.includes(status)}
                        onCheckedChange={() => handleStatusToggle(status)}
                      />
                      <Label htmlFor={`status-${status}`} className="cursor-pointer text-xs md:text-sm">
                        {getStatusDisplayName(status)}
                      </Label>
                    </div>
                  ))}
              </CollapsibleContent>
            </Collapsible>

            <Button
              className="w-full mt-4 text-xs md:text-sm py-2"
              disabled={!hasFilters || isCategoryListLoading}
              onClick={handleApplyFilters}
            >
              {t('filter.apply', 'Apply')}
            </Button>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default ProductFilter
