import { z } from 'zod'

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(20),
})
export type SignInSchemaType = z.infer<typeof SignInSchema>
const SignInForm = () => {
  return <div></div>
}

export default SignInForm
