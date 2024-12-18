import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { formEmailSchema } from '@/lib/schema'
import { requestResetPasswordApi } from '@/network/apis/auth'

import Button from '../button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

export default function ForgotPassword() {
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
        message: `Send request success`,
      })
    },
  })

  async function onSubmit(values: z.infer<typeof formEmailSchema>) {
    try {
      await sendRequestResetPassword(values.email)
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Please enter your email" type="email" {...field} />
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
              'Send Email'
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
