'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { z } from 'zod'

import { Button } from '@/components/ui/button'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { formChangePasswordProfileSchema, type formChangePasswordSchema } from '@/lib/schema'
import { changePasswordApi } from '@/network/apis/auth'
import { getUserProfileApi } from '@/network/apis/user'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { PasswordInput } from '../ui/password-input'

export default function ChangePasswordProfile() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const { data: userProfileData } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn,
  })

  const form = useForm<z.infer<typeof formChangePasswordProfileSchema>>({
    resolver: zodResolver(formChangePasswordProfileSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      passwordConfirm: '',
    },
  })
  const { mutateAsync: setPasswordMutation, isPending } = useMutation({
    mutationKey: [changePasswordApi.mutationKey],
    mutationFn: changePasswordApi.fn,
    onSuccess: () => {
      form.reset()
      queryClient.invalidateQueries({ queryKey: [getUserProfileApi.queryKey] })
      successToast({
        message: t('toast.successChangePasswordMessage'),
      })
    },
  })

  async function onSubmit(values: z.infer<typeof formChangePasswordSchema>) {
    try {
      const formateData = {
        password: values.password,
        currentPassword: values.currentPassword,
        accountId: userProfileData?.data.id || '',
      }
      console.log('sign up', formateData)
      await setPasswordMutation(formateData)
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
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('formLabels.currentPassword')}</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder={t('placeholders.currentPassword')} {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('formLabels.password')}</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder={t('placeholders.password')} {...field} />
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
                  <FormLabel>{t('formLabels.confirmPassword')}</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder={t('placeholders.confirmPassword')} {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size={'lg'}
              className="mt-2 flex w-full items-center justify-center rounded-lg text-sm font-medium"
            >
              {isPending ? (
                <svg
                  aria-hidden="true"
                  role="status"
                  className="mr-2 inline h-4 w-4 animate-spin text-zinc-200 duration-500 dark:text-zinc-950"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="white"
                  ></path>
                </svg>
              ) : (
                t('button.updatePassword')
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
