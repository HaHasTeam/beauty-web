import { AlertCircle, HelpCircle, Play, Video } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ProjectInformationEnum } from '@/types/enum'

import { ScrollArea } from '../ui/scroll-area'

interface VoucherDialogProps {
  triggerComponent: React.ReactElement<unknown>
  onConfirmVoucher: (value: string) => void
  selectedProducts: string[]
}
export default function VoucherDialog({ triggerComponent, onConfirmVoucher, selectedProducts }: VoucherDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState('')

  const vouchers = [
    {
      id: 'video',
      type: 'Video Only',
      icon: <Video className="w-6 h-6" />,
      discount: '50%',
      maxDiscount: '25k',
      minSpend: '0',
      usageCount: 3,
      used: '81%',
      expiry: '28.11.2024',
      bgColor: 'bg-red-200',
    },
    {
      id: 'live',
      type: 'Chỉ có trên Live',
      icon: <Play className="w-6 h-6" />,
      discount: '50%',
      maxDiscount: '35k',
      minSpend: '0',
      usageCount: 3,
      used: '84%',
      expiry: '28.11.2024',
      bgColor: 'bg-red-200',
    },
  ]
  const handleConfirm = () => {
    if (selectedVoucher) {
      onConfirmVoucher(selectedVoucher) // Confirm the selected voucher
    }
    setOpen(false) // Close the dialog
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{t('voucher.chooseVoucher', { projectName: ProjectInformationEnum.name })}</DialogTitle>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              {t('voucher.help')}
              <HelpCircle className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <DialogDescription> {t('voucher.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Voucher Input */}
          <div className="flex gap-2 bg-muted/50 p-4 rounded-lg items-center">
            <label className="text-sm font-medium mb-1.5 block"> {t('voucher.title')}</label>
            <Input placeholder={t('voucher.title')} className=" border border-gray-300 focus:border-primary/50" />
            <Button className="self-end uppercase"> {t('voucher.apply')}</Button>
          </div>

          {/* Voucher List */}
          <ScrollArea className="h-72">
            <div className="px-3 py-2">
              <RadioGroup value={selectedVoucher} onValueChange={setSelectedVoucher}>
                <div className="space-y-4">
                  {vouchers.map((voucher) => (
                    <div key={voucher.id} className="relative">
                      <div className="flex gap-4 p-4 border rounded-lg">
                        {/* Left Section */}
                        <div
                          className={`w-32 ${voucher.bgColor} p-4 rounded-lg flex flex-col items-center justify-center text-center`}
                        >
                          {voucher.icon}
                          <div className="mt-2 text-sm font-medium uppercase">
                            {ProjectInformationEnum.name} {voucher.id.toUpperCase()}
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-lg font-medium">
                                Giảm {voucher.discount} Giảm tối đa ₫{voucher.maxDiscount}
                              </div>
                              <div className="text-sm text-muted-foreground">Đơn Tối Thiểu ₫{voucher.minSpend}</div>
                              <span className="inline-block border border-red-500 text-red-500 text-xs px-2 py-0.5 rounded mt-1">
                                {voucher.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-red-500">×{voucher.usageCount}</span>
                              <RadioGroupItem value={voucher.id} id={voucher.id} />
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            Đã dùng {voucher.used}, {t('date.exp')} {voucher.expiry}
                            <Button variant="link" className="text-blue-500 p-0 h-auto text-sm ml-2">
                              {t('voucher.condition')}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Warning Message */}
                      {selectedProducts?.length === 0 && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-red-500">
                          <AlertCircle className="w-4 h-4" />
                          {t('voucher.chooseProductAppAlert')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <div className="flex justify-end gap-2 w-full">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('dialog.cancel')}
            </Button>
            <Button onClick={handleConfirm} disabled={selectedProducts?.length === 0}>
              {t('dialog.ok')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
