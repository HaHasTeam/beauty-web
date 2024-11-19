import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { formEmailSchema } from '@/lib/schema'
import { requestResetPassword } from '@/network/api/api'
import { sendRequestResetPasswordParams } from '@/network/api/api-params-moudle'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

// Define prop type with allowEmail boolean

export default function ForgotPassword() {
  const [isSubmitting] = useState(false)
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formEmailSchema>>({
    resolver: zodResolver(formEmailSchema),
    defaultValues: {
      email: '',
    },
  })

  const { mutateAsync: sendRequestResetPassword } = useMutation({
    mutationFn: async (data: sendRequestResetPasswordParams) => {
      return requestResetPassword(data)
    },
    onSuccess: (data) => {
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

        return toast({
          variant: 'default',
          className: 'bg-green-600 text-white',
          title: 'Message from system',
          description: data.message,
        })
      }

      return toast({
        variant: 'default',
        title: 'Submitted successfully',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data.message, null, 2)}</code>
          </pre>
        ),
      })
    },
    onError(error) {
      return toast({
        variant: 'destructive',
        title: 'Message from system',
        description: error.message,
      })
    },
  })
  function onSubmit(values: z.infer<typeof formEmailSchema>) {
    try {
      // toast({
      //   title: 'data onSubmit',
      //   description: (
      //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
      //       <code className="text-w  hite">{JSON.stringify(values, null, 2)}</code>
      //     </pre>
      //   ),
      // })
      console.log(values)
      const formateData: sendRequestResetPasswordParams = {
        email: values.email,
      }
      sendRequestResetPassword(formateData)
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
              type="submit"
              size={'lg'}
              className="mt-2 flex w-full items-center justify-center rounded-lg text-sm font-medium"
            >
              {isSubmitting ? (
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
                'Send Email'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
