import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { IClassification } from '@/types/classification.interface'

interface ClassificationPopoverProps {
  classifications: IClassification[]
}
export default function ClassificationPopover({ classifications }: ClassificationPopoverProps) {
  const { t } = useTranslation()
  const [selectedOption, setSelectedOption] = useState(
    classifications
      .filter((classification) => classification.selected)
      .map((s) => s.id)
      .toString(),
  )
  const [currentSelection, setCurrentSelection] = useState(selectedOption)
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (option: string) => {
    setCurrentSelection(option)
  }
  const selectedOptionName =
    classifications.find((classification) => classification.id === selectedOption)?.name ||
    t('productDetail.selectOption')

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
          <Label className="lg:w-3/5 xl:w-1/2 md:w-1/2 w-1/2">
            <span className="text-muted-foreground lg:text-sm text-xs overflow-ellipsis">
              {t('productDetail.classification')}
            </span>
          </Label>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="lg:w-2/5 xl:w-1/2 md:w-1/2 w-1/2 h-7 overflow-ellipsis">
                <span className="line-clamp-2">{selectedOptionName}</span>
                <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="end">
              <div className="p-4 border-b">
                <Label> {t('productDetail.classification')}</Label>
              </div>
              <div className="p-2">
                {classifications.map((option) => (
                  <Button
                    key={option?.id}
                    variant="ghost"
                    className={`w-full justify-start px-2 py-1.5 text-sm ${
                      currentSelection === option?.id ? 'bg-accent text-accent-foreground' : ''
                    }`}
                    onClick={() => handleSelect(option?.id)}
                  >
                    {option?.name}
                  </Button>
                ))}
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
