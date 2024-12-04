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
              <h3 className="font-medium">Cách Sử Dụng Voucher</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Để có thể áp dụng mã Allure voucher, bạn hãy chọn nút "Lưu" để lấy voucher và mục ví voucher của bạn
                nhé.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Cách Tìm Voucher</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bạn có thể tìm thấy Allure Voucher xuyên suốt trang web và ứng dụng. Mẹo riêng cho bạn nè, hãy bắt đầu
                với những trang chương trình khuyến mãi và trang chủ của brand nhé!
              </p>
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
