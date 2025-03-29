import { useMutation } from '@tanstack/react-query'
import { XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { payTransactionApi } from '@/network/apis/transaction'
import { PAY_TYPE } from '@/network/apis/transaction/type'
import { formatCurrency } from '@/utils/number'

import { QRCodePayment } from './QRCodePayment'

interface QRCodeAlertDialogProps {
  /**
   * Controls whether the dialog is open
   */
  open: boolean
  /**
   * Callback for when the open state changes
   */
  onOpenChange: (open: boolean) => void
  /**
   * Amount to pay in VND
   */
  amount: number
  paymentId?: string
  description?: string
  elementId?: string

  /**
   * Optional title for the dialog
   */
  title?: string
  /**
   * Optional CSS class name for the dialog content
   */
  className?: string
  type: PAY_TYPE
  onSuccess?: () => void
}

export function QRCodeAlertDialog({
  open,
  onOpenChange,
  amount,
  description = 'Payment',
  paymentId,
  elementId = 'qr-payment-dialog-checkout',
  title,
  type,
  className,
  onSuccess,
}: QRCodeAlertDialogProps) {
  const { t } = useTranslation()
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [paymentId_result, setPaymentId_result] = useState<string | null>(null)

  const { mutateAsync: payTransaction } = useMutation({
    mutationKey: [payTransactionApi.mutationKey],
    mutationFn: payTransactionApi.fn,
  })
  // Reset payment state when dialog is opened
  useEffect(() => {
    if (open) {
      setPaymentStatus('pending')
      setPaymentId_result(null)
    }
  }, [open])

  // Handle payment success
  const handleSuccess = async (paymentOSId: string) => {
    setPaymentStatus('success')
    setPaymentId_result(paymentOSId)
    if (paymentId) {
      await payTransaction({ orderId: paymentOSId, id: paymentId, type })
    }
    onSuccess?.()
  }

  // Handle payment error
  const handleError = (error: Error | unknown) => {
    setPaymentStatus('error')
    console.log(error)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={`sm:max-w-md md:max-w-lg p-0 overflow-hidden ${className} gap-0`}>
        {/* Header area */}
        <div className="p-6 pb-4">
          <AlertDialogHeader className="flex flex-row items-start justify-between">
            <div>
              <AlertDialogTitle className="text-xl font-medium">{title || t('wallet.scanAndPay')}</AlertDialogTitle>
              <p className="text-sm text-muted-foreground">{t('wallet.scanToPayDescription')}</p>
            </div>
            {paymentStatus !== 'pending' && (
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-full h-8 w-8 inline-flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
              >
                <XIcon className="h-5 w-5" />
                <span className="sr-only">{t('wallet.close')}</span>
              </button>
            )}
          </AlertDialogHeader>
        </div>

        {/* QR Code area */}
        <div className="relative">
          {paymentStatus === 'pending' && (
            <div>
              <QRCodePayment
                amount={amount}
                description={description}
                paymentId={paymentId}
                elementId={elementId}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </div>
          )}

          {/* Success state */}
          {paymentStatus === 'success' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-green-600">{t('wallet.paymentSuccessful')}</h3>
                  <p className="text-sm text-muted-foreground">{t('wallet.transactionCompleted')}</p>
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded-md space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('wallet.amount')}:</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('wallet.paymentMethod')}:</span>
                  <span className="font-medium">{t('wallet.BANK_TRANSFER')}</span>
                </div>
                {paymentId_result && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t('wallet.transactionId')}:</span>
                    <span className="font-mono text-xs">{paymentId_result}</span>
                  </div>
                )}
              </div>

              <Button onClick={() => onOpenChange(false)} className="w-full">
                {t('wallet.close')}
              </Button>
            </div>
          )}

          {/* Error state */}
          {paymentStatus === 'error' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-600"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-red-600">{t('wallet.paymentError')}</h3>
                  <p className="text-sm text-muted-foreground">{t('wallet.paymentFailed')}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setPaymentStatus('pending')} className="flex-1">
                  {t('wallet.tryAgain')}
                </Button>
                <Button variant="destructive" onClick={() => onOpenChange(false)} className="flex-1">
                  {t('wallet.cancel')}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer area - only shown in pending state */}
        {paymentStatus === 'pending' && (
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('wallet.amount')}</span>
              <span className="font-medium text-xl">{formatCurrency(amount)}</span>
            </div>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
