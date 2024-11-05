import { request } from '@/network/axios'
import { ActionResponse } from '@/types'

import { createAccountParams, getCanvasData, signInParams } from './api-params-moudle'
import { GetCityTotal, LoginResponse } from './api-res-model'

enum APIS {
  GET_CITY_TOTAL_NUMBER = '/xxxx/xxxx/xxxxx',
  CREATE_ACCOUNT = '/accounts',
  SIGN_IN = '/auth/login',
  SIGN_UP =                                                    '/auth/regiset',
}

export const getCityTotalNumber = (params: getCanvasData) =>
  request.get<GetCityTotal>(APIS.GET_CITY_TOTAL_NUMBER, params)

export const createAccount = async (data: createAccountParams) =>
  await request.post<ActionResponse<LoginResponse>>(APIS.CREATE_ACCOUNT, data)
export const login = async (data: signInParams) => await request.post<ActionResponse<LoginResponse>>(APIS.SIGN_IN, data)
