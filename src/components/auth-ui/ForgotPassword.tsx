import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import routes from '@/config/routes'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { formEmailSchema } from '@/lib/schema'
import { requestResetPasswordApi } from '@/network/apis/auth'

import Button from '../button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

export default function ForgotPassword() {
  const verifyEmailRedirectUrl = import.meta.env.VITE_APP_URL + routes.resetPassword
  const { t } = useTranslation()
  const handleServerError = useHandleServerError()
  const { successToast } = useToast()
  const form = useForm<z.infer<typeof formEmailSchema>>({
    resolver: zodResolver(formEmailSchema),
    defaultValues: {
      email: '',
    },
  })

  const { mutateAsync: sendRequestResetPassword, isPending: isRequestPending } = useMutation({
    mutationKey: [requestResetPasswordApi.mutationKey],
    mutationFn: requestResetPasswordApi.fn,
    onSuccess: () => {
      successToast({
        message: t('resetRequestSuccess'),
      })
    },
  })

  async function onSubmit(values: z.infer<typeof formEmailSchema>) {
    try {
      await sendRequestResetPassword({ email: values.email, url: verifyEmailRedirectUrl })
    } catch (error) {
      handleServerError({
        error,
      })
    }
  }

  return (
    <div className="mb-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-4">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('emailPlaceholder')} type="email" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isRequestPending}
              loading={isRequestPending}
              type="submit"
              size={'lg'}
              className="mt-2 flex w-full items-center justify-center rounded-lg text-sm font-medium"
            >
              {t('sendEmailButton')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
