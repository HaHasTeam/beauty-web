import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ChevronRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import Hero01 from '@/assets/images/hero01.png'
import OrVector from '@/assets/images/orVector.png'
import OrVector02 from '@/assets/images/orVector02.png'
import { Icons } from '@/components/Icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { formRegisterSchema } from '@/lib/schema'
import { cn } from '@/lib/utils'
import { createAccount } from '@/network/api/api'
import { createAccountParams, ICommonResponse } from '@/network/api/api-params-moudle'

const SignUp = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formRegisterSchema>>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      gender: '',
      password: '',
      passwordConfirm: '',
      acceptTerms: false,
      phone: '',
    },
  })
  const { mutateAsync: signUpCustomerMutate } = useMutation({
    mutationFn: async (data: createAccountParams) => {
      return createAccount(data)
    },
    onSuccess: (data: ICommonResponse) => {
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
        navigate('/signin')
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
    onError(error: AxiosError) {
      const { response } = error
      if (response?.data?.message) {
        return toast({
          variant: 'destructive',
          title: 'Message from system',
          description: response.data.message,
        })
      }
    },
  })
  function onSubmit(values: z.infer<typeof formRegisterSchema>) {
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
      const formateData: createAccountParams = {
        ...values,
        role: 'CUSTOMER',
        username: values.firstName + ' ' + values.lastName,
      }
      signUpCustomerMutate(formateData)
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
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
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
            <h2 className="text-2xl font-medium mb-2 text-center text-[#FFA07A]">Welcome to Allure</h2>
            <p className="text-gray-500 mb-6 text-center">
              Enter your details below to create your account and get started{' '}
            </p>
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
                <Button type="submit" className="w-full bg-[#FFA07A] hover:bg-[#FF8C5A] text-white">
                  Register
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
                <Link to="/signup" className="text-[#FFA07A] hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
