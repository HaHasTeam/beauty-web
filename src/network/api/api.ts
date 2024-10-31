import { request } from '@/network/axios'

import { createAccountParams, getCanvasData, signInParams } from './api-params-moudle'
import { GetCityTotal } from './api-res-model'

enum APIS {
  GET_CITY_TOTAL_NUMBER = '/xxxx/xxxx/xxxxx',
  CREATE_ACCOUNT = '/accounts',
  SIGN_IN = '/auth/login',
}

export const getCityTotalNumber = (params: getCanvasData) =>
  request.get<GetCityTotal>(APIS.GET_CITY_TOTAL_NUMBER, params)

export const createAccount = async (data: createAccountParams) => await request.post(APIS.CREATE_ACCOUNT, data)
export const login = async (data: signInParams) => await request.post(APIS.SIGN_IN, data)
