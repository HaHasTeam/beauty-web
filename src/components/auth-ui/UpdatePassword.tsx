import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { decodeToken } from 'react-jwt'
import { useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import configs from '@/config'
import { useToast } from '@/hooks/use-toast'
import { formChangePasswordSchema } from '@/lib/schema'
import { setPassword } from '@/network/api/api'
import { resetPasswordParams } from '@/network/api/api-params-moudle'
import { IToken } from '@/network/api/api-res-model'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { PasswordInput } from '../ui/password-input'

export default function UpdatePassword() {
  const location = useLocation()
  const UrlParams = new URLSearchParams(location.search)
  const token = UrlParams.get('code') || 'chưa có accessToken'
  const decodedToken = decodeToken(token) as IToken
  const navigate = useNavigate()
  // const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formChangePasswordSchema>>({
    resolver: zodResolver(formChangePasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  })

  const { mutateAsync: setPasswordMutation, isPending } = useMutation({
    mutationFn: async (data: resetPasswordParams) => {
      return setPassword(data)
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
        navigate(configs.routes.signIn)
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
  function onSubmit(values: z.infer<typeof formChangePasswordSchema>) {
    try {
      console.log(values)
      const formateData: resetPasswordParams = {
        password: values.password,
        accountId: decodedToken?.accountId,
      }
      setPasswordMutation(formateData)
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
                'Send Email'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
