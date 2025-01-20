import { CreditCard, HandCoins, WalletMinimal } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import Label from '@/components/form-label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import CreateOrderSchema from '@/schemas/order.schema'
import { PaymentMethod } from '@/types/enum'

import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import AddPaymentCardDialog from './AddPaymentCardDialog'

interface PaymentSelectionProps {
  form: UseFormReturn<z.infer<typeof CreateOrderSchema>>
  hasPreOrderProduct: boolean
}
export default function PaymentSelection({ form, hasPreOrderProduct }: PaymentSelectionProps) {
  const { t } = useTranslation()
  const paymentMethods = hasPreOrderProduct
    ? [
        {
          id: PaymentMethod.WALLET,
          label: `${t('wallet.WALLET')}`,
          icon: <WalletMinimal className="text-primary" />,
          isAddMore: false,
        },
        {
          id: PaymentMethod.CARD,
          label: `${t('wallet.CARD')}`,
          icon: <CreditCard className="text-primary" />,
          isAddMore: true,
        },
      ]
    : [
        {
          id: PaymentMethod.CASH,
          label: `${t('wallet.CASH')}`,
          icon: <HandCoins className="text-primary" />,
          isAddMore: false,
        },
        {
          id: PaymentMethod.WALLET,
          label: `${t('wallet.WALLET')}`,
          icon: <WalletMinimal className="text-primary" />,
          isAddMore: false,
        },
        {
          id: PaymentMethod.CARD,
          label: `${t('wallet.CARD')}`,
          icon: <CreditCard className="text-primary" />,
          isAddMore: true,
        },
      ]
  const creditCards = [{ id: '1', name: 'Visa - TienPhong Commercial Joint Stock Bank' }]

  return (
    <div className="w-full p-4 bg-white shadow-sm rounded-md">
      <h2 className="text-lg font-medium mb-4">{t('wallet.choosePaymentMethod')}</h2>
      <FormField
        control={form.control}
        name="paymentMethod"
        render={({ field }) => (
          <FormItem className="w-full">
            <div className="w-full space-y-1">
              <FormControl>
                <RadioGroup value={field.value} onValueChange={field.onChange}>
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex flex-col gap-3 border border-gray-300 justify-center rounded-lg p-4 ${
                        field.value === method.id ? 'border-red-500 text-red-500' : 'border-gray-300'
                      }`}
                    >
                      <div className="flex gap-4 items-center">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label htmlFor={method.id} className="px-4 py-2 h-full w-full rounded cursor-pointer">
                          {method.label}
                        </Label>
                      </div>
                      {method?.isAddMore && (
                        <div className="pl-16 flex flex-col gap-2">
                          {creditCards?.length > 0 && (
                            <RadioGroup>
                              {creditCards?.map((card) => (
                                <div key={card?.id} className="flex items-center gap-2">
                                  <RadioGroupItem value="visa" id="visa" />
                                  <Label htmlFor="visa" className="ml-2">
                                    {card?.name}
                                  </Label>
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
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  )
}
