import { TServerResponse } from '@/types/request'
import { toMutationFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

interface RegisterUserDeviceRequest {
  token: string
  browser: string
  os: string
}
export const createFirebaseTokenApi = toMutationFetcher<void, TServerResponse<{ token: string }>>(
  'createFirebaseTokenApi',
  async () => {
    return privateRequest('/firebase-auth/generate-token', {
      method: 'POST',
    })
  },
)
export const createFCMTokenApi = toMutationFetcher<RegisterUserDeviceRequest, TServerResponse<{ token: string }>>(
  'createFCMTokenApi',
  async (params) => {
    return privateRequest('/fcm/create-token', {
      method: 'POST',
      data: { token: params.token },
    })
  },
)
