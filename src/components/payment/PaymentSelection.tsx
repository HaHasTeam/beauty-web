import { useQuery } from '@tanstack/react-query'
import { CreditCard, HandCoins, Wallet, WalletMinimal } from 'lucide-react'
import { useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import Label from '@/components/form-label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { getMyWalletApi } from '@/network/apis/wallet'
import { CreateOrderSchema } from '@/schemas/order.schema'
import { PaymentMethod } from '@/types/enum'
import CreateWalletBtn from '@/views/Wallet/CreateWalletBtn'
import TopUpModal from '@/views/Wallet/TopUpModal'

import Button from '../button'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import AddPaymentCardDialog from './AddPaymentCardDialog'

interface PaymentSelectionProps {
  form: UseFormReturn<z.infer<typeof CreateOrderSchema>>
  hasPreOrderProduct: boolean
  totalPayment: number
}
export default function PaymentSelection({ form, hasPreOrderProduct, totalPayment }: PaymentSelectionProps) {
  const { t } = useTranslation()
  const { data: myWallet } = useQuery({
    queryKey: [getMyWalletApi.queryKey],
    queryFn: getMyWalletApi.fn,
  })

  const isWalletAvailable = myWallet?.data

  const isEnoughBalance = useMemo(() => {
    if (!isWalletAvailable) {
      return false
    }
    const balance = myWallet?.data.balance ?? 0
    return balance >= totalPayment
  }, [myWallet, isWalletAvailable, totalPayment])

  const paymentMethods = hasPreOrderProduct
    ? [
        {
          id: PaymentMethod.WALLET,
          label: (
            <div className="flex items-center gap-2 w-full justify-between">
              <div className="flex items-center gap-0.5 ">
                <span className="">{t('wallet.WALLET')}</span>
                <span>/ {t('walletTerm.balance')}:</span>
                <span className="">
                  {t('format.currency', {
                    value: myWallet?.data.balance ?? 0,
                  })}
                </span>
              </div>
            </div>
          ),
          action: (
            <div>
              <Dialog>
                <DialogTrigger>
                  <Button className="bg-primary hover:bg-primary/70 text-white">
                    <Wallet className="h-5 w-5" />
                    {t('walletTerm.topUp')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl max-h-[70%] overflow-auto">
                  <TopUpModal />
                </DialogContent>
              </Dialog>
            </div>
          ),
          isDisabled: !isWalletAvailable || !isEnoughBalance,
          icon: <WalletMinimal className="text-primary" />,
          isAddMore: false,
        },
        {
          id: PaymentMethod.CARD,
          label: `${t('wallet.CARD')}`,
          icon: <CreditCard className="text-primary" />,
          isAddMore: true,
          isDisabled: true,
        },
      ]
    : [
        {
          id: PaymentMethod.CASH,
          label: `${t('wallet.CASH')}`,
          icon: <HandCoins className="text-primary" />,
          isAddMore: false,
          isDisabled: false,
        },
        {
          id: PaymentMethod.WALLET,
          label: (
            <div className="flex items-center gap-2 w-full justify-between">
              <div className="flex items-center gap-0.5 ">
                <span className="">{t('wallet.WALLET')}</span>
                <span>/ {t('walletTerm.balance')}:</span>
                <span className="">
                  {myWallet?.data.balance !== undefined
                    ? t('format.currency', {
                        value: myWallet?.data.balance ?? 0,
                      })
                    : '--'}
                </span>
              </div>
            </div>
          ),
          action: (
            <div>
              {isWalletAvailable && (
                <Dialog>
                  <DialogTrigger>
                    <Button className="bg-primary hover:bg-primary/70 text-white">
                      <Wallet className="h-5 w-5" />
                      {t('walletTerm.topUp')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl max-h-[70%] overflow-auto">
                    <TopUpModal />
                  </DialogContent>
                </Dialog>
              )}
              {!isWalletAvailable && <CreateWalletBtn />}
            </div>
          ),
          isDisabled: !isWalletAvailable || !isEnoughBalance,
          icon: <WalletMinimal className="text-primary" />,
          isAddMore: false,
        },
        {
          id: PaymentMethod.CARD,
          label: `${t('wallet.CARD')}`,
          icon: <CreditCard className="text-primary" />,
          isAddMore: true,
          isDisabled: true,
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
                        <RadioGroupItem value={method.id} id={method.id} disabled={method.isDisabled} />
                        <div className="flex items-center gap-2 w-full">
                          <Label
                            htmlFor={method.id}
                            className={cn(
                              'px-4 py-2 h-full flex-1 rounded cursor-pointer',
                              method.isDisabled && 'opacity-50',
                            )}
                          >
                            {method.label}
                          </Label>
                          {method.action}
                        </div>
                      </div>
                      {method?.isAddMore && !method.isDisabled && (
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
