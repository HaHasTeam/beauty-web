import { HelpCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import cvv from '@/assets/images/cvv.jpg'
import { ScrollArea } from '@/components/ui/scroll-area'

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

export default function CVVHelpPopover() {
  const { t } = useTranslation()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <HelpCircle className="w-4 h-4 ml-1 hover:cursor-pointer text-gray-500" />
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <ScrollArea className="max-h-[80vh]">
          <h3 className="font-semibold text-center">{t('wallet.cvvFull')}</h3>
          <div className="space-y-2 mt-1 flex justify-center flex-col items-center">
            <div className="w-72 h-28">
              <img src={cvv} className="w-full h-full object-contain" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('wallet.cvvDescription')}</p>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
