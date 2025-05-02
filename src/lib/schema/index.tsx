import i18next from 'i18next'
import { z } from 'zod'

import { defaultRequiredRegex, emailRegex, phoneRegex, usernameRegex } from '@/constants/regex'

export const passwordEasyRegex = () => {
  return {
    pattern: /^(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
    message: () => i18next.t('validation.required'),
  }
}
export const passwordRegexEasy = passwordEasyRegex()
export const formRegisterSchema = z
  .object({
    username: z
      .string()
      .regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message())
      .regex(usernameRegex.pattern, usernameRegex.message()),
    email: z.string().email(),
    password: z.string().regex(passwordRegexEasy.pattern, passwordRegexEasy.message()),

    gender: z.string().optional(),
    phone: z
      .string()
      .regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message())
      .refine(phoneRegex.pattern, phoneRegex.message()),
    passwordConfirm: z.string().regex(passwordRegexEasy.pattern, passwordRegexEasy.message()),

    acceptTerms: z.boolean(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: i18next.t('signUp.passwordsDoNotMatch'),
    path: ['passwordConfirm'],
  })

export const getFormRegisterSchema = () => {
  return z
    .object({
      username: z
        .string()
        .regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message())
        .regex(usernameRegex.pattern, usernameRegex.message()),
      email: z
        .string()
        .regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message())
        .regex(emailRegex.pattern, emailRegex.message()),
      password: z.string().regex(passwordRegexEasy.pattern, passwordRegexEasy.message()),

      gender: z.string().optional(),
      phone: z
        .string()
        .regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message())
        .refine(phoneRegex.pattern, phoneRegex.message()),
      passwordConfirm: z.string().regex(passwordRegexEasy.pattern, passwordRegexEasy.message()),

      acceptTerms: z.boolean(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: i18next.t('signUp.passwordsDoNotMatch'),
      path: ['passwordConfirm'],
    })
}

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
