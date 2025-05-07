import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import OrVector from '@/assets/images/orVector.png'
import OrVector02 from '@/assets/images/orVector02.png'
import { buttonVariants } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import configs from '@/config'
import { getOauthGoogleUrl } from '@/config/contants'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getFormRegisterSchema } from '@/lib/schema'
import { cn } from '@/lib/utils'
import { getRoleIdByEnum } from '@/network/apis/role'
import { createUserApi } from '@/network/apis/user'

import Button from '../button'
import { Icons } from '../Icons'
import ImageWithFallback from '../ImageFallback'
import LoadingLayer from '../loading-icon/LoadingLayer'
import { PhoneInputWithCountries } from '../phone-input'

export default function SignUp() {
  const { t } = useTranslation()
  // const [isSubmitting, setIsSubmitting] = useState(false)
  const handleServerError = useHandleServerError()
  const formRegisterSchema = getFormRegisterSchema()
  const navigate = useNavigate()
  const { successToast } = useToast()
  const { isLoading: isGettingRolesIdByEnum, data: getRoleIdByEnumData } = useQuery({
    queryKey: [getRoleIdByEnum.queryKey],
    queryFn: getRoleIdByEnum.fn,
  })

  const form = useForm<z.infer<typeof formRegisterSchema>>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      email: '',
      username: '',
      gender: '',
      phone: '',
      password: '',
      passwordConfirm: '',
      acceptTerms: false,
    },
  })

  const { mutateAsync: createUserFn, isPending: isSubmitting } = useMutation({
    mutationKey: [createUserApi.mutationKey],
    mutationFn: createUserApi.fn,
    onSuccess: () => {
      navigate(configs.routes.checkEmail + '?' + new URLSearchParams({ email: form.getValues('email') }).toString())
      successToast({
        message: `Sign In success`,
      })
    },
  })

  async function onSubmit(values: z.infer<typeof formRegisterSchema>) {
    try {
      const formateData = {
        ...values,
        phone: '0' + values?.phone?.slice(3),
        role: getRoleIdByEnumData?.CUSTOMER.id || '',
        username: values.username,
      }
      await createUserFn(formateData)
    } catch (error) {
      console.error('Form submission error', error)
      handleServerError({
        error,
      })
    }
  }

  return (
    <div className="my-8 ">
      {isGettingRolesIdByEnum && <LoadingLayer />}

      <p className="text-[32px] font-bold text-primary dark:text-white text-center">Sign Up</p>
      <p className="mb-2.5 mt-2.5 font-normal text-zinc-950 dark:text-zinc-400 text-center">Enter your information</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Please enter your username" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
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

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <PhoneInputWithCountries {...field} className="bg-background" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0  p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {' '}
                    I accept the{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms and Conditions
                    </Link>
                  </FormLabel>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className="w-full  text-white">
            Sign Up
          </Button>
        </form>
      </Form>
      <div className="mt-6 text-center">
        <div className="flex items-baseline justify-center gap-2">
          <ImageWithFallback src={OrVector} alt="vector" fallback={fallBackImage} className="object-contain" />
          <p className="text-sm text-gray-600 mb-4">OR</p>
          <ImageWithFallback src={OrVector02} alt="vector" fallback={fallBackImage} className="object-contain" />
        </div>
        <a
          href={getOauthGoogleUrl()}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'w-full mb-4 flex items-center justify-center cursor-pointer',
          )}
        >
          <Icons.GoogleIcon />
          {t('continueWithGoogle')}
        </a>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/sign-in" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
