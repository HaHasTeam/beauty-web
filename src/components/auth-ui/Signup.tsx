import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import OrVector from '@/assets/images/orVector.png'
import OrVector02 from '@/assets/images/orVector02.png'
import { buttonVariants } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import configs from '@/config'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { formRegisterSchema } from '@/lib/schema'
import { cn } from '@/lib/utils'
import { createUserApi } from '@/network/apis/user'

import Button from '../button'
import { Icons } from '../Icons'

export default function SignUp() {
  // const [isSubmitting, setIsSubmitting] = useState(false)
  const handleServerError = useHandleServerError()

  const navigate = useNavigate()
  const { successToast } = useToast()
  const form = useForm<z.infer<typeof formRegisterSchema>>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
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
      navigate(configs.routes.signIn)
      successToast({
        message: `Sign In success`,
      })
    },
  })

  async function onSubmit(values: z.infer<typeof formRegisterSchema>) {
    try {
      const formateData = {
        ...values,
        role: 'e016d06f-126e-4e67-8f6a-dfc63d25361c',
        username: values.firstName + ' ' + values.lastName,
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
      <p className="text-[32px] font-bold text-primary dark:text-white text-center">Sign Up</p>
      <p className="mb-2.5 mt-2.5 font-normal text-zinc-950 dark:text-zinc-400 text-center">Enter your information</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Please enter your first name" type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Please enter your last name" type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                    <Input placeholder="Please enter your phone number" {...field} />
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
                    <Link to="/terms" className="text-[#FFA07A] hover:underline">
                      Terms and Conditions
                    </Link>
                  </FormLabel>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className="w-full  text-white">
            Sign In
          </Button>
        </form>
      </Form>
      <div className="mt-6 text-center">
        <div className="flex items-baseline justify-center gap-2">
          <img src={OrVector} alt="vector" />
          <p className="text-sm text-gray-600 mb-4">OR</p>
          <img src={OrVector02} alt="vector" />
        </div>
        <a
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'w-full mb-4 flex items-center justify-center cursor-pointer',
          )}
        >
          <Icons.GoogleIcon />
          Continue with Google
        </a>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/sign-in" className="text-[#FFA07A] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
