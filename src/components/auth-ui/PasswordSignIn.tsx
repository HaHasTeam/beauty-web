import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { formSignInSchema } from '@/lib/schema'
import { login } from '@/network/api/api'
import { signInParams } from '@/network/api/api-params-moudle'
import { LoginResponse } from '@/network/api/api-res-model'
import { useStore } from '@/store/store'
import { ActionResponse } from '@/types'

import { Input } from '../ui/input'
import { PasswordInput } from '../ui/password-input'

// Define prop type with allowEmail boolean
// interface PasswordSignInProps {
//   allowEmail?: boolean
// }

export default function PasswordSignIn() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { initialize } = useStore(
    useShallow((state) => ({
      initialize: state.initialize,
    })),
  )
  const { toast } = useToast()
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSignInSchema>>({
    resolver: zodResolver(formSignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const { mutateAsync: signInCustomerMutate } = useMutation<
    ActionResponse<LoginResponse>,
    AxiosError<{ message: string }>,
    signInParams
  >({
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
      if (data.message && data.data) {
        initialize(true, data.data)
        setIsSubmitting(false)
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
      console.log('error', error)
      setIsSubmitting(false)
      if (error.response) {
        return toast({
          variant: 'destructive',
          title: 'Message from system',
          description: error.response.data.message,
        })
      }
    },
  })
  async function onSubmit(values: z.infer<typeof formSignInSchema>) {
    // try {
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
    setIsSubmitting(true)
    await signInCustomerMutate(formateData)
    // } catch (error) {
    //   console.error('Form submission error', error)
    //   toast({
    //     variant: 'destructive',
    //     title: 'Uh oh! Something went wrong.',
    //     description: error.response.data.message,
    //   })
    // }
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
          <Link
            to="/forgot-password"
            className="text-xs sm:text-sm text-[#FFA07A] hover:underline block text-right mt-1"
          >
            Forgot your password?
          </Link>
          <Button disabled={isSubmitting} className="w-full bg-[#FFA07A] hover:bg-[#FF8C5A] text-white">
            {isSubmitting ? 'Submitting' : 'Log in'}
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
