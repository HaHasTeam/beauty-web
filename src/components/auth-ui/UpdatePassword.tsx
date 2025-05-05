import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import configs from '@/config'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { formChangePasswordSchema } from '@/lib/schema'
import { resetPasswordApi } from '@/network/apis/auth'
import { TEmailDecoded } from '@/types'

import Button from '../button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { PasswordInput } from '../ui/password-input'

export default function UpdatePassword() {
  const handleServerError = useHandleServerError()

  const location = useLocation()
  const UrlParams = new URLSearchParams(location.search)
  const code = UrlParams.get('code') || 'chưa có accessToken'
  const accountId = code ? jwtDecode<TEmailDecoded>(code).accountId : undefined
  const navigate = useNavigate()
  // const [isSubmitting, setIsSubmitting] = useState(false)
  const { successToast } = useToast()
  const form = useForm<z.infer<typeof formChangePasswordSchema>>({
    resolver: zodResolver(formChangePasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  })

  const { mutateAsync: setPasswordMutation, isPending: isSubmitting } = useMutation({
    mutationKey: [resetPasswordApi.mutationKey],
    mutationFn: resetPasswordApi.fn,
    onSuccess: () => {
      form.reset()
      navigate(configs.routes.signIn)
      successToast({
        message: `Change password successfully`,
      })
    },
  })

  async function onSubmit(values: z.infer<typeof formChangePasswordSchema>) {
    try {
      const formateData = {
        password: values.password,
        accountId: accountId || '',
      }
      console.log(formateData)
      await setPasswordMutation(formateData)
    } catch (error) {
      console.error('Form submission error', error)
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Please Enter your password." {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Please Enter your confirm password." {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className="w-full  text-white">
              Update Password
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
