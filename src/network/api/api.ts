import { request } from '@/network/axios'
import { ActionResponse } from '@/types'

import {
  createAccountParams,
  getCanvasData,
  resetPasswordParams,
  sendRequestResetPasswordParams,
  signInParams,
} from './api-params-moudle'
import { GetCityTotal, LoginResponse } from './api-res-model'

const APIS = {
  GET_CITY_TOTAL_NUMBER: '/xxxx/xxxx/xxxxx',
  CREATE_ACCOUNT: '/accounts',
  SIGN_IN: '/auth/login',
  SIGN_UP: '/auth/register',
  REQUEST_RESET_PASSWORD: '/accounts/request-reset-pass',
  SET_PASSWORD: (accountId: string) => `/accounts/modify-password/${accountId}`,
}

export const getCityTotalNumber = (params: getCanvasData) =>
  request.get<GetCityTotal>(APIS.GET_CITY_TOTAL_NUMBER, params)

export const createAccount = async (data: createAccountParams) =>
  await request.post<ActionResponse<LoginResponse>>(APIS.CREATE_ACCOUNT, data)

export const login = async (data: signInParams) => await request.post<ActionResponse<LoginResponse>>(APIS.SIGN_IN, data)

export const requestResetPassword = async (data: sendRequestResetPasswordParams) =>
  await request.post<ActionResponse<null>>(APIS.REQUEST_RESET_PASSWORD, data)

export const setPassword = async (data: resetPasswordParams) =>
  await request.put<ActionResponse<null>>(APIS.SET_PASSWORD(data.accountId), data)
