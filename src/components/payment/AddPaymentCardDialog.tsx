import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import paymentCards from '@/assets/images/paymentCard1.jpg'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('wallet.addCard')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img src={paymentCards} alt="Card logos" width={100} height={30} className="object-contain" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">{t('wallet.cardNumber')}:</label>
            <Input className="border border-gray-300" placeholder="VD: 4123 4567 8901 2345" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">{t('wallet.bankAccount')}:</label>
            <Input className="border border-gray-300" placeholder="VD: NGUYEN VAN A" />
          </div>
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('date.expiredDate')}:</label>
              <Input className="border border-gray-300" placeholder="MM/YY" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('wallet.cvv')}:</label>
              <Input className="border border-gray-300" placeholder="VD: 123" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground p-4 rounded-lg bg-secondary border-primary">
            {t('wallet.saveCard')}
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
