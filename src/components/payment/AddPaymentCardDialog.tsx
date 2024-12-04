import { Plus, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import paymentCards from '@/assets/images/paymentCard1.jpg'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import CVVHelpPopover from './CVVHelpPopover'

interface AddPaymentCardDialogProps {
  textTrigger: string
}

export default function AddPaymentCardDialog({ textTrigger }: AddPaymentCardDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-2 border-primary text-primary hover:text-primary hover:bg-primary/10">
          <Plus /> <span>{textTrigger}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('wallet.addCard')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img src={paymentCards} alt="Card logos" width={100} height={30} className="object-contain" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">{t('wallet.cardNumber')}:</label>
            <Input className="border border-gray-300 focus:border-primary" placeholder={t('wallet.cardNumberEx')} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">{t('wallet.bankAccount')}:</label>
            <Input className="border border-gray-300 focus:border-primary" placeholder={t('wallet.bankAccountEx')} />
          </div>
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('date.expiredDate')}:</label>
              <Input className="border border-gray-300 focus:border-primary" placeholder="MM/YY" />
            </div>
            <div className="space-y-2">
              <div className="flex gap-1 items-center">
                <label className="block text-sm font-medium">{t('wallet.cvv')}:</label> <CVVHelpPopover />
              </div>
              <Input className="border border-gray-300 focus:border-primary" placeholder={t('wallet.cvvEx')} />
            </div>
          </div>
          <div className="text-sm text-muted-foreground p-4 rounded-lg bg-secondary border-primary">
            <div className="flex gap-1 items-center">
              <ShieldCheck className="text-green-700" size={20} />
              <span className="font-semibold">{t('wallet.securityChecked')}</span>
            </div>
            <p className="px-6">{t('wallet.saveCard')}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('button.cancel')}
          </Button>
          <Button onClick={() => setOpen(false)}>{t('button.submit')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
