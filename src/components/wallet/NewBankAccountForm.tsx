import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import FormLabel from '@/components/form-label'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getBanksApi } from '@/network/apis/bank'
import { IBank } from '@/types/bank'

const bankAccountSchema = z.object({
  bankCode: z.string({
    required_error: 'Please select a bank',
  }),
  accountNumber: z
    .string()
    .min(5, 'Account number must be at least 5 characters')
    .max(20, 'Account number must not exceed 20 characters'),
  accountName: z.string().min(2, 'Account name must be at least 2 characters'),
  isDefault: z.boolean().default(false),
})

type BankAccountFormValues = z.infer<typeof bankAccountSchema>

interface NewBankAccountFormProps {
  onSubmit: (data: {
    bankName: string
    accountNumber: string
    accountName: string
    isDefault?: boolean
  }) => Promise<void>
  isLoading: boolean
}

const NewBankAccountForm = ({ onSubmit, isLoading }: NewBankAccountFormProps) => {
  const { t } = useTranslation()

  // Fetch banks from API
  const { data: banksData, isLoading: isBanksLoading } = useQuery({
    queryKey: [getBanksApi.queryKey],
    queryFn: getBanksApi.fn,
  })

  const banks = banksData?.data || []

  // Form definition with React Hook Form
  const form = useForm<BankAccountFormValues>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      bankCode: '',
      accountNumber: '',
      accountName: '',
      isDefault: false,
    },
  })
  console.log(form.formState.errors, 'SDal')
  console.log(form.getValues(), 'DS')

  const handleFormSubmit = async (values: BankAccountFormValues) => {
    try {
      // Find the selected bank to get its name
      const selectedBank = banks.find((bank) => bank.code === values.bankCode)

      if (!selectedBank) {
        form.setError('bankCode', { message: 'Invalid bank selection' })
        return
      }

      await onSubmit({
        bankName: selectedBank.name,
        accountNumber: values.accountNumber,
        accountName: values.accountName,
        isDefault: values.isDefault,
      })

      // Reset form after successful submission
      form.reset()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const showLoading = isLoading || isBanksLoading

  return (
    <div className="relative">
      {showLoading && <LoadingContentLayer />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="bankCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel required className="text-gray-700">
                  {t('wallet.bankAccounts.bankName')}
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={showLoading}>
                  <FormControl>
                    <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary/30">
                      <SelectValue placeholder={t('wallet.bankAccounts.enterBankName')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent
                    className="max-h-[200px] overflow-y-auto w-[var(--radix-select-trigger-width)]"
                    position="popper"
                    side="bottom"
                    align="start"
                  >
                    {banks.map((bank: IBank) => (
                      <SelectItem key={bank.code} value={bank.code} className="flex items-center gap-2 w-full">
                        <div className="w-full flex items-center gap-2">
                          <img src={bank.logo} alt={bank.shortName} className="w-16 h-auto object-contain" />
                          {bank.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel required className="text-gray-700">
                  {t('wallet.bankAccounts.accountNumber')}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t('wallet.bankAccounts.enterAccountNumber')}
                    className="border-gray-300 focus:border-primary focus:ring-primary/30"
                    disabled={showLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountName"
            render={({ field }) => (
              <FormItem>
                <FormLabel required className="text-gray-700">
                  {t('wallet.bankAccounts.accountName')}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t('wallet.bankAccounts.enterAccountName')}
                    className="border-gray-300 focus:border-primary focus:ring-primary/30"
                    disabled={showLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isDefault"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="text-primary focus:ring-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    disabled={showLoading}
                  />
                </FormControl>
                <FormLabel className="cursor-pointer text-gray-700">{t('wallet.bankAccounts.setAsDefault')}</FormLabel>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={showLoading}>
            {t('wallet.bankAccounts.addAccount')}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default NewBankAccountForm
