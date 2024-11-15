import { ChevronDown, ChevronUp, Filter } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { validatePrice } from '@/utils/validation'

import { Button } from '../ui/button'
import { CardContent, CardHeader } from '../ui/card'
import { Checkbox } from '../ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

type Category = {
  label: string
  children: { id: string; label: string }[]
  multiple: boolean
}

const categories: Category[] = [
  {
    label: 'Product Type',
    children: [
      { id: 'cleanser', label: 'Cleanser' },
      { id: 'toner', label: 'Toner' },
      { id: 'serum', label: 'Serum' },
    ],
    multiple: true,
  },
  {
    label: 'Ingredient Type',
    children: [
      { id: 'vitamin-c', label: 'Vitamin C' },
      { id: 'retinol', label: 'Retinol' },
      { id: 'hyaluronic-acid', label: 'Hyaluronic Acid' },
    ],
    multiple: true,
  },
  {
    label: 'Skin Type',
    children: [
      { id: 'all', label: 'All' },
      { id: 'combination', label: 'Combination/Oily' },
      { id: 'dry', label: 'Dry' },
      { id: 'normal', label: 'Normal' },
      { id: 'sensitive', label: 'Sensitive' },
    ],
    multiple: true,
  },
  {
    label: 'Price Range',
    children: [
      { id: 'under25', label: 'Under $25' },
      { id: '25-50', label: '$25 - $50' },
      { id: '50-100', label: '$50 - $100' },
    ],
    multiple: false,
  },
]

const ProductFilter = () => {
  const { t } = useTranslation()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'Product Type': true,
    'Ingredient Type': true,
    'Skin Type': true,
    'Price Range': true,
  })
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({})
  const [customPrice, setCustomPrice] = useState<{ min: string; max: string }>({ min: '', max: '' })
  const [priceError, setPriceError] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleCheckboxChange = (category: string, id: string) => {
    setSelectedOptions((prev) => {
      const currentSelections = prev[category] || []
      const updatedSelections = currentSelections.includes(id)
        ? currentSelections.filter((item) => item !== id)
        : [...currentSelections, id]
      return { ...prev, [category]: updatedSelections }
    })
  }

  const handleRadioChange = (category: string, id: string) => {
    // Clear custom price when a predefined range is selected
    if (category === 'Price Range') {
      setCustomPrice({ min: '', max: '' })
    }
    setSelectedOptions((prev) => ({ ...prev, [category]: [id] }))
  }

  const handleCustomPriceInput = (key: 'min' | 'max', value: string) => {
    // Auto-select custom price option when user inputs values
    setCustomPrice((prev) => {
      const updatedPrice = { ...prev, [key]: value }
      if (updatedPrice.min || updatedPrice.max) {
        setSelectedOptions((prev) => ({ ...prev, 'Price Range': [updatedPrice.min + '-' + updatedPrice.max] }))
      }
      return updatedPrice
    })
  }

  const handleApply = () => {
    const validationError = validatePrice(customPrice.min, customPrice.max)
    if (validationError) {
      setPriceError(validationError)
      return
    }
    setPriceError(null)
    console.log('Selected Options:', selectedOptions)
    console.log('Custom Price:', customPrice)
  }

  return (
    <div className="w-full h-full shadow-sm">
      <CardHeader className="text-primary pb-2 flex flex-row gap-2 items-center align-middle">
        <Filter className="h-5 w-5" />
        <span className="uppercase font-bold">{t('filter.title')}</span>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => (
          <Collapsible
            key={category.label}
            open={openSections[category.label]}
            onOpenChange={() => toggleSection(category.label)}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
              <span className="text-base font-medium">{category.label}</span>
              {openSections[category.label] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              {category.multiple ? (
                category.children.map((child) => (
                  <div key={child.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={child.id}
                      checked={selectedOptions[category.label]?.includes(child.id) || false}
                      onCheckedChange={() => handleCheckboxChange(category.label, child.id)}
                    />
                    <Label htmlFor={child.id}>{child.label}</Label>
                  </div>
                ))
              ) : (
                <RadioGroup
                  value={selectedOptions[category.label]?.[0] || ''}
                  onValueChange={(value) => handleRadioChange(category.label, value)}
                >
                  {category.children.map((child) => (
                    <div key={child.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={child.id} id={child.id} />
                      <Label htmlFor={child.id}>{child.label}</Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={customPrice.min + '-' + customPrice.max} id="custom-price" />
                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{t('filter.currency')}</span>
                        <Input
                          type="number"
                          placeholder="Min"
                          className="h-8 w-20"
                          value={customPrice.min}
                          onChange={(e) => handleCustomPriceInput('min', e.target.value)}
                        />
                      </div>
                      <div>
                        <div className="text-sm bg-gray-400 w-3 h-[1px]"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{t('filter.currency')}</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          className="h-8 w-20"
                          value={customPrice.max}
                          onChange={(e) => handleCustomPriceInput('max', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  {priceError && <p className="text-red-500 text-sm">{priceError}</p>}
                </RadioGroup>
              )}
            </CollapsibleContent>
          </Collapsible>
        ))}

        <Button className="w-full" onClick={handleApply}>
          {t('filter.apply')}
        </Button>
      </CardContent>
    </div>
  )
}

export default ProductFilter
