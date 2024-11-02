import { z } from 'zod'

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(20),
})
export type SignInSchemaType = z.infer<typeof SignInSchema>
const SignInForm = () => {
  // function onSubmit(values: SignInSchemaType) {
  //   try {
  //     console.log(values)
  //     // toast(
  //     //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
  //     //     <code className="text-white">{JSON.stringify(values, null, 2)}</code>
  //     //   </pre>,
  //     // )
  //   } catch (error) {
  //     console.error('Form submission error', error)
  //     // toast.error('Failed to submit the form. Please try again.')
  //   }
  // }
  return <div></div>
}

export default SignInForm
