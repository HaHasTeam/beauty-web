import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import Hero01 from '@/assets/images/hero01.png'
import OrVector from '@/assets/images/orVector.png'
import OrVector02 from '@/assets/images/orVector02.png'
import { Icons } from '@/components/Icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { useToast } from '@/hooks/use-toast'
import { formSignInSchema } from '@/lib/schema'
import { cn } from '@/lib/utils'
import { login } from '@/network/api/api'
import { signInParams } from '@/network/api/api-params-moudle'

const SignIn = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const form = useForm<z.infer<typeof formSignInSchema>>({
    resolver: zodResolver(formSignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const { mutateAsync: signInCustomerMutate } = useMutation({
    mutationFn: async (data: signInParams) => {
      return login(data)
    },
    onSuccess: (data) => {
      console.log('data', data)

      // if (!data.ok) {
      //   // if (data.error) {
      //   //   const errs = data.error as { [key: string]: { message: string } }
      //   //   Object.entries(errs).forEach(([key, value]) => {
      //   //     form.setError(key as keyof createAccountParams, {
      //   //       type: 'manual',
      //   //       message: value.message,
      //   //     })
      //   //   })
      //   // }
      //   toast({
      //     variant: 'destructive',
      //     title: 'Uh oh! Something went wrong.',
      //     description: data.message || data.statusText,
      //   })
      //   throw new Error(data.message || data.statusText)
      // }
      if (data.message) {
        form.reset()
        navigate('/')
        return toast({
          variant: 'default',
          className: 'bg-green-600 text-white',
          title: 'Message from system',
          description: data.message,
        })
      }

      return toast({
        title: 'Submitted successfully',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{data.message}</code>
          </pre>
        ),
      })
    },
    onError(error) {
      // console.log('error', error)

      // if (error) {
      return toast({
        // variant: 'destructive',
        title: 'Message from system',
        description: error.message,
      })
      // }
    },
  })
  async function onSubmit(values: z.infer<typeof formSignInSchema>) {
    try {
      // toast({
      //   title: 'data onSubmit',
      //   description: (
      //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
      //       <code className="text-white">{JSON.stringify(values, null, 2)}</code>
      //     </pre>
      //   ),
      // })
      console.log(values)
      const formateData: signInParams = {
        ...values,
      }
      await signInCustomerMutate(formateData)
    } catch (error) {
      console.error('Form submission error', error)
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Failed to submit the form. Please try again.',
      })
    }
  }
  return (
    <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center p-4 relative">
      {/* <h1 className="text-5xl font-bold text-[#FFA07A] mb-6 absolute top-10 left-50% ">Allure</h1> */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 relative bg-blend-color-burn">
            <div className="absolute  top-4 right-4 bg-white px-2 py-1 rounded text-sm flex cursor-pointer">
              Back to shopping <ChevronRight className="text-[#FFA07A]" />
            </div>
            <img
              src={Hero01}
              alt="Beauty product application"
              width={600}
              height={600}
              className="object-cover w-full h-full pointer-events-none"
            />
            {/* <div className="absolute bottom-4 right-1/2 bg-white px-2 py-1 rounded text-sm">
              Be beautiful right now!
            </div> */}
          </div>
          <div className="md:w-1/2 p-8">
            <h2 className="text-2xl font-medium mb-2 text-center text-[#FFA07A]">{t('welcome')}</h2>
            <p className="text-gray-500 mb-6 text-center">Unleash your inner beauty. Log in now.</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <Button className="w-full bg-[#FFA07A] hover:bg-[#FF8C5A] text-white">Log in</Button>
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
                Haven't an account yet?{' '}
                <Link to="/signup" className="text-[#FFA07A] hover:underline">
                  Create an Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
