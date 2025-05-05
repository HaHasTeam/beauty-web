import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import configs from '@/config'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { formSignInSchema } from '@/lib/schema'
import { createFirebaseTokenApi } from '@/network/apis/firebase'
import { signInWithPasswordApi } from '@/network/apis/user'
import { useStore } from '@/store/store'
import { signInWithToken } from '@/utils/firebase/auth-service'

import Button from '../button'
import { Input } from '../ui/input'
import { PasswordInput } from '../ui/password-input'

// Define prop type with allowEmail boolean
// interface PasswordSignInProps {
//   allowEmail?: boolean
// }

export default function PasswordSignIn() {
  const { t } = useTranslation()
  const { authenticate, setFirebaseToken } = useStore(
    useShallow((state) => ({
      authenticate: state.setAuthState,
      setFirebaseToken: state.setFirebaseToken,
    })),
  )
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSignInSchema>>({
    resolver: zodResolver(formSignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const { mutateAsync: createToken } = useMutation({
    mutationFn: createFirebaseTokenApi.fn,
    mutationKey: [createFirebaseTokenApi.mutationKey],
  })
  const { mutateAsync: signInWithPasswordFn, isPending: isSignInWithPasswordLoading } = useMutation({
    mutationKey: [signInWithPasswordApi.mutationKey],
    mutationFn: signInWithPasswordApi.fn,
    onSuccess: () => {
      successToast({
        message: t('welcomeBack', { email: form.getValues('email') }),
      })
    },
  })

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data } = await signInWithPasswordFn({
        email,
        password,
      })
      authenticate({
        isAuthenticated: true,
        authData: data,
      })
      const dataFirebase = await createToken()

      await signInWithToken(dataFirebase.data.token)
      setFirebaseToken(dataFirebase.data.token)
      navigate(configs.routes.home)
    } catch (error) {
      handleServerError({
        error,
      })
    }
  }
  async function onSubmit(values: z.infer<typeof formSignInSchema>) {
    await handleLogin(values.email, values.password)
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem autoFocus>
                <FormLabel>{t('email')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('emailPlaceholder')} type="email" {...field} />
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
                <FormLabel>{t('password')}</FormLabel>
                <FormControl>
                  <PasswordInput placeholder={t('passwordPlaceholder')} {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Link to="/forgot-password" className="text-xs sm:text-sm text-primary hover:underline block text-right mt-1">
            {t('forgotPassword')}
          </Link>
          <Button disabled={isSignInWithPasswordLoading} className="w-full">
            {t('loginButton')}
          </Button>
        </form>
      </Form>
      {/* <p>
        <Link to="/auth/signin/forgot_password" className="font-medium text-zinc-950 dark:text-white text-sm">
          Forgot your password?
        </Link>
      </p> */}
    </div>
  )
}
