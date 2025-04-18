import { z } from 'zod'

import { defaultRequiredRegex, usernameRegex } from '@/constants/regex'

const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/)
export const formRegisterSchema = z
  .object({
    username: z
      .string()
      .regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message())
      .regex(usernameRegex.pattern, usernameRegex.message()),
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
export const formChangePasswordSchema = z
  .object({
    password: z.string().min(8).max(20),
    passwordConfirm: z.string().min(8).max(20),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  })

export const formChangePasswordProfileSchema = z
  .object({
    currentPassword: z.string().min(8).max(20),
    password: z.string().min(8).max(20),
    passwordConfirm: z.string().min(8).max(20),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  })
