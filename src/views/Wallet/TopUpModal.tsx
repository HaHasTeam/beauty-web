import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import { PayOSConfig, usePayOS } from 'payos-checkout'
import { useEffect, useMemo, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import StripeLogo from '@/assets/images/stripe.png'
import Button from '@/components/button'
import { Badge } from '@/components/ui/badge'
import { CustomInput } from '@/components/ui/custom-input'
import { DialogClose } from '@/components/ui/dialog'
import { Form, FormField, FormItem } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { generatePaymentLinkApi } from '@/network/apis/payment'
import { depositToWallet, getMyWalletApi } from '@/network/apis/wallet'
import { PaymentMethodEnum } from '@/types/payment'
import { basePayOSConfig } from '@/utils/payOs'

import SuccessContent from './SuccessContent'

const formSchema = z.object({
  amount: z.coerce.number(),
  method: z.string(),
})

export default function TopUpModal() {
  const { mutateAsync: generatePaymentLink, data: paymentLinkRes } = useMutation({
    mutationKey: [generatePaymentLinkApi.mutationKey],
    mutationFn: generatePaymentLinkApi.fn,
  })
  const { mutateAsync: depositToWalletFn, data: depositRes } = useMutation({
    mutationKey: [depositToWallet.mutationKey],
    mutationFn: depositToWallet.fn,
  })
  const [paidId, setPaidId] = useState()
  const checkoutRef = useRef<HTMLDivElement>(null)
  const payOsConfig: PayOSConfig = useMemo<PayOSConfig>(() => {
    return {
      ...basePayOSConfig,
      CHECKOUT_URL: paymentLinkRes?.data.url || '',
      onSuccess: async (data) => {
        setPaidId(data.id)
      },
    }
  }, [paymentLinkRes?.data.url])

  const queryClient = useQueryClient()
  useEffect(() => {
    if (paidId) {
      depositToWalletFn({ id: paidId }).then(() => {
        queryClient.invalidateQueries({
          queryKey: [getMyWalletApi.queryKey],
        })
      })
    }
  }, [paidId, depositToWalletFn, queryClient])

  const { open } = usePayOS(payOsConfig)
  useEffect(() => {
    if (paymentLinkRes?.data.url) {
      open()
    }
  }, [paymentLinkRes?.data.url, open])
  const { t } = useTranslation()
  const predefinedAmounts = [
    {
      value: 100000,
      label: t('format.currency', {
        value: 100000,
      }),
    },
    {
      value: 200000,
      label: t('format.currency', {
        value: 200000,
      }),
    },
    {
      value: 500000,
      label: t('format.currency', {
        value: 500000,
      }),
    },
    {
      value: 1000000,
      label: t('format.currency', {
        value: 1000000,
      }),
    },
  ]
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      method: PaymentMethodEnum.BANK_TRANSFER,
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    if (data.method === PaymentMethodEnum.BANK_TRANSFER) {
      await generatePaymentLink({
        amount: data.amount,
        description: 'TOP UP ACTION',
      })
    }
  }
  useEffect(() => {
    if (checkoutRef.current && paymentLinkRes?.data.url) {
      checkoutRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  })

  const successRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (successRef.current && depositRes) {
      successRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [depositRes])

  useEffect(() => {
    if (checkoutRef.current) {
      const iframes = checkoutRef.current.getElementsByTagName('iframe')
      while (iframes.length > 1) {
        iframes[1].parentNode?.removeChild(iframes[1])
      }
    }
  })

  const readOnlyForm = !!paymentLinkRes?.data.url
  return (
    <div className="w-full mx-auto p-4 space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {!depositRes && (
            <>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border-2">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          Amount
                          <Badge className="ml-2 text-white">Top Up</Badge>
                        </span>
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <span className="text-lg font-semibold">VND</span>|{' '}
                          <span className="text-sm font-light ">Viet Nam Dong</span>
                        </span>
                      </div>
                      <CustomInput
                        readOnly={readOnlyForm}
                        placeholder="0"
                        {...field}
                        type="number"
                        className="text-7xl font-normal mb-4 border-none h-fit bg-transparent focus-visible:ring-offset-0 focus-visible:border-none focus-visible::outline-none focus-visible:ring-0"
                      />
                      <div className="flex gap-2 flex-wrap">
                        {predefinedAmounts.map((amt) => (
                          <Button
                            type="button"
                            onClick={() => {
                              if (readOnlyForm) return
                              field.onChange(amt.value)
                            }}
                            key={amt.value}
                            variant={field.value === amt.value ? 'destructive' : 'outline'}
                            className="rounded-full"
                          >
                            {amt.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <RadioGroup
                      value={field.value}
                      className="space-y-4"
                      onValueChange={(value) => {
                        if (readOnlyForm) return
                        field.onChange(value)
                      }}
                    >
                      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <div className="flex items-start gap-2">
                          <RadioGroupItem
                            value={PaymentMethodEnum.BANK_TRANSFER}
                            key={PaymentMethodEnum.BANK_TRANSFER}
                            id={PaymentMethodEnum.BANK_TRANSFER}
                          />
                          <Label htmlFor={PaymentMethodEnum.BANK_TRANSFER} className="flex flex-col gap-6">
                            <div className="flex items-center gap-2">
                              Pay by bank
                              <div className="flex gap-1">
                                <img
                                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/02/Logo-Vietcombank.png"
                                  alt="vcb"
                                  className="h-4"
                                />
                                <img
                                  src="https://cdn.haitrieu.com/wp-content/uploads/2021/11/Logo-TCB-V.png"
                                  alt="tcb"
                                  className="h-4"
                                />
                                <img
                                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-BIDV-.png"
                                  alt="bidv"
                                  className="h-4"
                                />
                                <img
                                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png"
                                  alt="bidv"
                                  className="h-4"
                                />
                              </div>
                            </div>
                            {field.value === PaymentMethodEnum.BANK_TRANSFER && (
                              <div className="flex items-center font-light ">
                                <img
                                  src={'https://payos.vn/wp-content/uploads/sites/13/2023/07/payos-logo.svg'}
                                  alt="PayOS"
                                  className="h-8 mr-2"
                                />
                                We collaborate with PayOS to provide you with the best payment experience with free fee.
                              </div>
                            )}
                          </Label>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <div className="flex items-start gap-2">
                          <RadioGroupItem
                            value={PaymentMethodEnum.VISA_CARD}
                            key={PaymentMethodEnum.VISA_CARD}
                            id={PaymentMethodEnum.VISA_CARD}
                            disabled
                          />
                          <Label htmlFor={PaymentMethodEnum.VISA_CARD} className="flex flex-col gap-6">
                            <div className="flex items-center gap-2">
                              Card
                              <div className="flex gap-2">
                                <img
                                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                                  alt="Visa"
                                  className="h-4"
                                />
                                <img
                                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                                  alt="Mastercard"
                                  className="h-4"
                                />{' '}
                                <img
                                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/JCB_logo.svg/600px-JCB_logo.svg.png"
                                  alt="JCB"
                                  className="h-4"
                                />
                              </div>
                            </div>
                            {field.value === PaymentMethodEnum.VISA_CARD && (
                              <div className="flex items-center font-light">
                                <img src={StripeLogo} alt="Stripe" className="h-8 mr-2" />
                                We collaborate with Stripe to provide you with the best payment experience with 4% fee.
                              </div>
                            )}
                          </Label>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </RadioGroup>
                  </FormItem>
                )}
              />
            </>
          )}

          {!depositRes && paymentLinkRes?.data.url && (
            <div id="payOs-checkout" ref={checkoutRef} className="mb-20"></div>
          )}
          {!depositRes && !paymentLinkRes?.data.url && (
            <Button className="w-full" variant={'secondary'} loading={form.formState.isSubmitting}>
              Continue
            </Button>
          )}
          {!!depositRes && (
            <>
              <div ref={successRef}>
                <SuccessContent />
              </div>
              <DialogClose className="w-full">
                <Button className="w-full" variant={'secondary'}>
                  Close
                </Button>
              </DialogClose>
            </>
          )}
        </form>
      </Form>
    </div>
  )
}
