import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QrCode, Wallet, WalletMinimal } from 'lucide-react'
import { Dispatch, KeyboardEvent, SetStateAction, useId, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import Label from '@/components/form-label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import { filterOrdersParentApi, getParentOrderByIdApi, updateOrderPaymentMethod } from '@/network/apis/order'
import { payTransactionApi } from '@/network/apis/transaction'
import { PAY_TYPE } from '@/network/apis/transaction/type'
import { getMyWalletApi } from '@/network/apis/wallet'
import { getUpdatePaymentMethodSchema } from '@/schemas/order.schema'
import { PaymentMethod } from '@/types/enum'
import { PaymentMethodEnum } from '@/types/payment'
import TopUpModal from '@/views/Wallet/TopUpModal'

import Button from '../button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import AddPaymentCardDialog from './AddPaymentCardDialog'

interface RePaymentDialogProps {
  totalPayment: number
  paymentMethod: PaymentMethod
  setIsOpenQRCodePayment: Dispatch<SetStateAction<boolean>>
  setPaymentId: Dispatch<SetStateAction<string | undefined>>
  orderId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  setIsChangePaymentMethod: Dispatch<SetStateAction<boolean>>
}
export default function RePaymentDialog({
  orderId,
  setPaymentId,
  setIsOpenQRCodePayment,
  totalPayment,
  paymentMethod,
  open,
  onOpenChange,
  setIsChangePaymentMethod,
}: RePaymentDialogProps) {
  const { t } = useTranslation()
  const UpdatePaymentMethodSchema = getUpdatePaymentMethodSchema()
  const formId = useId()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const { data: myWallet } = useQuery({
    queryKey: [getMyWalletApi.queryKey],
    queryFn: getMyWalletApi.fn,
  })
  const { mutateAsync: payTransaction } = useMutation({
    mutationKey: [payTransactionApi.mutationKey],
    mutationFn: payTransactionApi.fn,
    onSuccess: () => {
      setIsLoading(false)
      onOpenChange(false)
      successToast({
        message: t('payment.paymentSuccess'),
      })
      queryClient.invalidateQueries({
        queryKey: [filterOrdersParentApi.queryKey],
      })
      queryClient.invalidateQueries({
        queryKey: [getParentOrderByIdApi.queryKey],
      })
      queryClient.invalidateQueries({
        queryKey: [getMyWalletApi.queryKey],
      })
    },
    onError: (error) => {
      setIsLoading(false)
      onOpenChange(false)
      queryClient.invalidateQueries({
        queryKey: [filterOrdersParentApi.queryKey],
      })
      queryClient.invalidateQueries({
        queryKey: [getMyWalletApi.queryKey],
      })
      queryClient.invalidateQueries({
        queryKey: [getParentOrderByIdApi.queryKey],
      })
      handleServerError({ error })
    },
  })
  const defaultValues = {
    paymentMethod: paymentMethod,
  }

  const form = useForm<z.infer<typeof UpdatePaymentMethodSchema>>({
    resolver: zodResolver(UpdatePaymentMethodSchema),
    defaultValues: defaultValues,
  })

  const { mutateAsync: updatePaymentMethodFn } = useMutation({
    mutationKey: [updateOrderPaymentMethod.mutationKey],
    mutationFn: updateOrderPaymentMethod.fn,
    onSuccess: () => {
      if (form.getValues('paymentMethod') === PaymentMethod.BANK_TRANSFER) {
        setIsOpenQRCodePayment(true)
        setPaymentId(orderId)
        setIsLoading(false)
        return
      }
      if (form.getValues('paymentMethod') === PaymentMethod.WALLET) {
        if (orderId) {
          payTransaction({ orderId: orderId, id: orderId, type: PAY_TYPE.ORDER })
        }
        return
      }
      setIsChangePaymentMethod(true)
    },
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
                {t('format.currency', {
                  value: myWallet?.data.availableBalance ?? 0,
                })}
              </span>
            </div>
          </div>
        </div>
      ),
      action: (
        <div className="ml-auto">
          <Dialog>
            <DialogTrigger asChild>
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
        </div>
      ),
      isDisabled: !isWalletAvailable || !isEnoughBalance,
      icon: <WalletMinimal className="text-primary" />,
      isAddMore: false,
    },
    {
      id: PaymentMethod.BANK_TRANSFER,
      label: `${t('wallet.BANK_TRANSFER')}`,
      icon: <QrCode className="text-primary" />,
      isAddMore: false,
      isDisabled: false,
    },
  ]

  const creditCards = [{ id: '1', name: 'Visa - TienPhong Commercial Joint Stock Bank' }]

  async function onSubmit(values: z.infer<typeof UpdatePaymentMethodSchema>) {
    try {
      console.log(values)
      if (paymentMethod !== values.paymentMethod) {
        setIsLoading(true)
        await updatePaymentMethodFn({ id: orderId, paymentMethod: values.paymentMethod as PaymentMethodEnum })
        onOpenChange(false)
      } else {
        setIsLoading(true)
        if (paymentMethod === PaymentMethod.BANK_TRANSFER) {
          setIsOpenQRCodePayment(true)
          setPaymentId(orderId)
          return
        }
        if (paymentMethod === PaymentMethod.WALLET) {
          if (orderId) {
            payTransaction({ orderId: orderId, id: orderId, type: PAY_TYPE.ORDER })
          }
          return
        }
      }
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
        form,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-xl lg:max-w-3xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{t('wallet.choosePaymentMethod')}</DialogTitle>
            <DialogDescription></DialogDescription>
          </div>
        </DialogHeader>
        <div className="w-full">
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
              className="w-full grid gap-4"
              id={`form-${formId}`}
            >
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <div className="w-full space-y-1">
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="w-full relative flex flex-col gap-2"
                        >
                          {paymentMethods.map((method) => (
                            <div
                              key={method.id}
                              className={`flex flex-col gap-3 border border-gray-300 justify-center rounded-lg p-2 sm:p-4 ${
                                field.value === method.id ? 'border-red-500 text-red-500' : 'border-gray-300'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
                                <RadioGroupItem
                                  value={method.id}
                                  id={method.id}
                                  disabled={method.isDisabled}
                                  className="mt-1 "
                                />
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
                              {method?.isAddMore && !method.isDisabled && (
                                <div className="pl-4 sm:pl-16 flex flex-col gap-2">
                                  {creditCards?.length > 0 && (
                                    <RadioGroup>
                                      {creditCards?.map((card) => (
                                        <div key={card?.id} className="flex items-center gap-2">
                                          <RadioGroupItem value="visa" id="visa" />
                                          <Label htmlFor="visa" className="ml-2 text-sm sm:text-base truncate">
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
              <DialogFooter>
                <div className="flex justify-end gap-2 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-primary hover:bg-primary/10 text-primary hover:text-primary"
                    onClick={() => onOpenChange(false)}
                  >
                    {t('dialog.cancel')}
                  </Button>
                  <Button form={`form-${formId}`} type="submit" loading={isLoading}>
                    {t('button.submit')}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
