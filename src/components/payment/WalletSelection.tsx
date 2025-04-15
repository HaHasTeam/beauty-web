import { useQuery } from '@tanstack/react-query'
import { Wallet, WalletMinimal } from 'lucide-react'
import { KeyboardEvent, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import Label from '@/components/form-label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { getMyWalletApi } from '@/network/apis/wallet'
import { PaymentMethod } from '@/types/enum'
import CreateWalletBtn from '@/views/Wallet/CreateWalletBtn'
import TopUpModal from '@/views/Wallet/TopUpModal'

import AlertMessage from '../alert/AlertMessage'
import Button from '../button'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'

interface WalletSelectionProps {
  totalPayment: number
}
export default function WalletSelection({ totalPayment }: WalletSelectionProps) {
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
    const availableBalance = myWallet?.data.availableBalance ?? 0
    return availableBalance >= totalPayment
  }, [myWallet, isWalletAvailable, totalPayment])

  // Prevent form submission when pressing Enter in dialog
  const handleDialogKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.stopPropagation()
    }
  }

  const paymentMethods = [
    {
      id: PaymentMethod.WALLET,
      label: (
        <div className="flex items-center w-full">
          <div className="flex flex-col">
            <span className="font-medium">{t('wallet.WALLET')}</span>
            <div className="flex items-center text-sm text-gray-600 space-x-1 max-w-[180px] sm:max-w-[220px]">
              <span>{t('walletTerm.balance')}:</span>
              <span className="font-medium text-primary truncate">
                {myWallet?.data.availableBalance !== undefined
                  ? t('format.currency', {
                      value: myWallet?.data.availableBalance ?? 0,
                    })
                  : '--'}
              </span>
            </div>
          </div>
        </div>
      ),
      action: (
        <div className="ml-auto">
          {isWalletAvailable && (
            <Dialog>
              <DialogTrigger>
                <Button
                  className="bg-primary hover:bg-primary/70 text-white text-xs sm:text-sm whitespace-nowrap"
                  type="button"
                >
                  <Wallet className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                  {t('walletTerm.topUp')}
                </Button>
              </DialogTrigger>
              <DialogContent
                className="max-w-xl max-h-[70%] overflow-auto"
                onKeyDown={handleDialogKeyDown}
                preventEscapeClose
              >
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
  ]

  return (
    <div className="w-full p-4 bg-white shadow-sm rounded-md">
      <h2 className="text-lg font-medium mb-4">{t('wallet.paymentMethod')}</h2>
      <RadioGroup value={PaymentMethod.WALLET} className="w-full relative flex flex-col gap-2">
        <div>
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex flex-col gap-3 border justify-center rounded-lg p-2 sm:p-4 border-red-500 text-red-500`}
            >
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
                <RadioGroupItem value={method.id} id={method.id} disabled={method.isDisabled} className="mt-1 " />
                <div className="flex flex-row items-center gap-2 w-full justify-between flex-wrap">
                  <Label
                    htmlFor={method.id}
                    className={cn(
                      'px-2 sm:px-4 py-1 sm:py-2 h-full flex-1 rounded cursor-pointer',
                      method.isDisabled && 'opacity-50',
                    )}
                  >
                    {method.label}
                  </Label>
                  {method.action}
                </div>
              </div>
            </div>
          ))}
          <AlertMessage message={t('payment.methodMessage')} />
        </div>
      </RadioGroup>
    </div>
  )
}
