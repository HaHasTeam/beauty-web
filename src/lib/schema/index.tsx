import { z } from 'zod'

const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/)
export const formRegisterSchema = z
  .object({
    firstName: z.string().min(0).max(50),
    lastName: z.string().max(50),
    email: z.string().email(),
    password: z.string().min(8).max(20),
    gender: z.string().optional(),
    phone: z.string().regex(phoneRegex, 'Invalid phone number!').max(10).min(1).optional(),
    passwordConfirm: z.string().min(8).max(20),
    acceptTerms: z.boolean(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  })

export const formSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
})
export const formEmailSchema = z.object({
  email: z.string().email(),
})
