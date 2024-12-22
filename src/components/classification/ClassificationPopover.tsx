import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { IClassification } from '@/types/classification'
import { checkCurrentProductClassificationActive } from '@/utils/product'

import Empty from '../empty/Empty'

interface ClassificationPopoverProps {
  classifications: IClassification[]
  selectedClassification: string
  productClassification: IClassification | null
}
export default function ClassificationPopover({
  classifications,
  selectedClassification,
  productClassification,
}: ClassificationPopoverProps) {
  const { t } = useTranslation()
  const [selectedOption, setSelectedOption] = useState(selectedClassification)
  console.log(selectedClassification)
  const [currentSelection, setCurrentSelection] = useState(selectedOption)
  const [isOpen, setIsOpen] = useState(false)
  const isProductClassificationActive = checkCurrentProductClassificationActive(productClassification, classifications)

  const handleSelect = (option: string) => {
    setCurrentSelection(option)
  }
  const selectedOptionName =
    classifications.find((classification) => classification.title === selectedOption)?.title ||
    t('productDetail.selectClassification')

  const handleSave = () => {
    setSelectedOption(currentSelection)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setCurrentSelection(selectedOption)
    setIsOpen(false)
  }
  return (
    <div className="w-full">
      <div className="w-full space-y-2">
        <div className="w-full flex items-center justify-between">
          <Label className="w-fit">
            <span className="text-muted-foreground lg:text-sm text-xs overflow-ellipsis">
              {t('productDetail.classification')}
            </span>
          </Label>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="w-fit h-7 overflow-ellipsis">
                <span className="line-clamp-2">{selectedOptionName}</span>
                <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="end">
              <div className="p-4 border-b">
                <Label> {t('productDetail.classification')}</Label>
              </div>
              <div className="p-2">
                {classifications && classifications?.length > 0 ? (
                  classifications?.map((option) => (
                    <Button
                      key={option?.id}
                      variant="ghost"
                      disabled={!isProductClassificationActive}
                      className={`w-full justify-start px-2 py-1.5 text-sm ${
                        currentSelection === option?.id ? 'bg-accent text-accent-foreground' : ''
                      }`}
                      onClick={() => handleSelect(option?.id)}
                    >
                      {option?.title}
                    </Button>
                  ))
                ) : (
                  <Empty title={t('empty.classification.title')} description={t('empty.classification.description')} />
                )}
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  {t('button.cancel')}
                </Button>
                <Button size="sm" onClick={handleSave}>
                  {t('button.save')}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
