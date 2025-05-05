import { TServerError } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { publicRequest } from '@/utils/request'

import { TChangePasswordRequestParams } from './type'

export const activateAccountApi = toQueryFetcher<string, TServerError>('activateAccountApi', async (accountId) => {
  return publicRequest(`/accounts/verify-account/${accountId}`, {
    method: 'PUT',
  })
})

export const changePasswordApi = toMutationFetcher<TChangePasswordRequestParams, TServerError>(
  'changePasswordApi',
  async (params) => {
    return publicRequest(`/accounts/modify-password/${params?.accountId}`, {
      method: 'PUT',
      data: params,
    })
  },
)

export const resetPasswordApi = toMutationFetcher<TChangePasswordRequestParams, TServerError>(
  'resetPasswordApi',
  async (params) => {
    return publicRequest(`/accounts/set-password/${params?.accountId}`, {
      method: 'PUT',
      data: params,
    })
  },
)
export const requestResetPasswordApi = toMutationFetcher<{ email: string; url: string }, TServerError>(
  'requestResetPasswordApi',
  async ({ email, url }) => {
    return publicRequest(`/accounts/request-reset-pass`, {
      method: 'POST',
      data: { email, url },
    })
  },
)

export const resendMutateApi = toMutationFetcher<{ email: string; url: string }, TServerError>(
  'resendMutateApi',
  async (params) => {
    return publicRequest(`/accounts/resend-verify-email`, {
      method: 'POST',
      data: params,
    })
  },
)
