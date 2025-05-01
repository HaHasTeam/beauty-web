import { PayOSConfig, usePayOS } from '@payos/payos-checkout'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'

import { generatePaymentLinkApi } from '@/network/apis/payment'
import { basePayOSConfig } from '@/utils/payOs'
import SuccessContent from '@/views/Wallet/SuccessContent'

interface QRCodePaymentProps {
  /**
   * Amount to pay in VND
   */
  amount: number
  /**
   * Optional payment description
   */
  description?: string
  /**
   * Optional payment ID for reference
   */
  paymentId?: string
  /**
   * Element ID for the QR code container (make sure it's unique if using multiple instances)
   */
  elementId?: string
  /**
   * Callback function triggered on successful payment
   * @param data Payment response data including the order ID
   */
  onSuccess?: (paidId: string) => Promise<void>
  /**
   * Callback function triggered on payment error
   * @param error Error details
   */
  onError?: (error: Error | unknown) => void
  /**
   * Optional CSS class name for the container
   */
  className?: string
}

export function QRCodePayment({
  amount,
  description = 'Payment',
  elementId = 'qr-payment-checkout',
  paymentId,
  onSuccess,
}: QRCodePaymentProps) {
  const { mutateAsync: generatePaymentLink, data: paymentLinkRes } = useMutation({
    mutationKey: [generatePaymentLinkApi.mutationKey],
    mutationFn: generatePaymentLinkApi.fn,
  })

  const [paidId, setPaidId] = useState()
  const checkoutRef = useRef<HTMLDivElement>(null)
  const [completed, setCompleted] = useState(false)
  console.log('paymentLinkRes', paymentLinkRes)

  const payOsConfig: PayOSConfig = useMemo<PayOSConfig>(() => {
    return {
      ...basePayOSConfig,
      CHECKOUT_URL: paymentLinkRes?.data.url || '',
      onSuccess: async (data) => {
        setPaidId(data.id)
        setCompleted(true)
      },
    }
  }, [paymentLinkRes?.data.url])

  useEffect(() => {
    if (paidId) {
      onSuccess?.(paidId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paidId])

  const { open } = usePayOS(payOsConfig)
  useEffect(() => {
    if (paymentLinkRes?.data.url) {
      open()
    }
  }, [paymentLinkRes?.data.url, open])

  useEffect(() => {
    if (amount >= 0 && elementId && !paymentLinkRes?.data.url) {
      generatePaymentLink({
        amount,
        description: description || 'Payment',
      })
    }
  }, [amount, description, elementId, generatePaymentLink, paymentLinkRes?.data.url, paymentId])

  useEffect(() => {
    if (checkoutRef.current && paymentLinkRes?.data.url) {
      checkoutRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  })

  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (successRef.current && completed) {
      successRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [completed])

  useEffect(() => {
    if (checkoutRef.current) {
      const iframes = checkoutRef.current.getElementsByTagName('iframe')
      while (iframes.length > 1) {
        iframes[1].parentNode?.removeChild(iframes[1])
      }
    }
  })

  return (
    <div className="w-full mx-auto h-fit">
      <div>
        <div className="space-y-8">
          {!completed && paymentLinkRes?.data.url && (
            <div id="payOs-checkout" ref={checkoutRef} className="mb-20"></div>
          )}
          {!!completed && (
            <>
              <div ref={successRef}>
                <SuccessContent />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
