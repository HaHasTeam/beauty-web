import { CreditCard, HandCoins, WalletMinimal } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import AddPaymentCardDialog from './AddPaymentCardDialog'

export default function PaymentSelection() {
  const { t } = useTranslation()
  const [selectedPayment, setSelectedPayment] = useState('cash')

  const paymentMethods = [
    { id: 'cash', label: `${t('wallet.COD')}`, icon: <HandCoins className="text-primary" />, isAddMore: false },
    { id: 'wallet', label: `${t('wallet.title')}`, icon: <WalletMinimal className="text-primary" />, isAddMore: false },
    { id: 'credit', label: `${t('wallet.ATM')}`, icon: <CreditCard className="text-primary" />, isAddMore: true },
  ]
  const creditCards = [{ id: '1', name: 'Visa - TienPhong Commercial Joint Stock Bank' }]

  return (
    <div className="w-full p-4">
      <h2 className="text-lg font-medium mb-4">{t('wallet.choosePaymentMethod')}</h2>
      <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="flex flex-col gap-3">
            <div className="flex gap-4 items-center">
              <RadioGroupItem value={method.id} id={method.id} />
              <label htmlFor={method.id} className="flex items-center gap-2">
                {method.icon}
                <span>{method.label}</span>
              </label>
            </div>
            <div className="px-14">
              {method?.isAddMore && (
                <div className="flex flex-col gap-2">
                  {creditCards?.length > 0 && (
                    <RadioGroup>
                      {creditCards?.map((card) => (
                        <div key={card?.id} className="flex items-center gap-2">
                          <RadioGroupItem value="visa" id="visa" />
                          <label htmlFor="visa" className="ml-2">
                            {card?.name}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                  <div>
                    <AddPaymentCardDialog textTrigger={t('wallet.addOtherCard')} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
