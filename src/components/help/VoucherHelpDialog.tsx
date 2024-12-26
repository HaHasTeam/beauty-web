import { HelpCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

export default function VoucherHelpPopOver() {
  const { t } = useTranslation()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          {t('voucher.help')}
          <HelpCircle className="w-4 h-4 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-3 pr-4">
            <h3 className="font-semibold text-center">{t('voucher.help')}</h3>
            <div className="space-y-2">
              <h3 className="font-medium">{t('voucher.howToUse')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('voucher.howToUseDescription')}</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">{t('voucher.howToFind')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('voucher.howToFindDescription')}</p>
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
