import configs from '@/config'
import { TAuth } from '@/types/auth'
import { ConsultantServiceStatusEnum, IConsultantService } from '@/types/consultant-service'
import { TServerResponse, TServerResponseWithPaging } from '@/types/request'
import { TRoleResponse } from '@/types/role'
import { TUser, UserRoleEnum, UserStatusEnum } from '@/types/user'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest, publicRequest } from '@/utils/request'

import { filterConsultantServicesApi } from '../consultant-service'
import {
  TCreateUserRequestParams,
  TGetAccountFilterRequestParams,
  TGetConsultantsFilterRequestParams,
  TInviteCoWorkerRequestParams,
  TInviteMultipleCoWorkersRequestParams,
  TLoginUserRequestParams,
  TUpdateUserRequestParams,
  TUpdateUsersListStatusRequestParams,
  TUpdateUserStatusRequestParams,
  TUserResponse,
} from './type'

const verifyEmailRedirectUrl = import.meta.env.VITE_APP_URL + configs.routes.checkEmail
export const getUserProfileApi = toQueryFetcher<void, TServerResponse<TUserResponse>>('getUserProfileApi', async () => {
  return privateRequest('/accounts/me')
})

export const createUserApi = toMutationFetcher<TCreateUserRequestParams, TServerResponse<TUserResponse>>(
  'createUserApi',
  async (data) => {
    return publicRequest('/accounts', {
      method: 'POST',
      data: {
        ...data,
        url: data.redirectUrl || verifyEmailRedirectUrl,
      },
    })
  },
)

export const signInWithPasswordApi = toMutationFetcher<TLoginUserRequestParams, TServerResponse<TAuth>>(
  'signInApi',
  async (data) => {
    return publicRequest('/auth/login', {
      method: 'POST',
      data,
    })
  },
)

export const updateProfileApi = toMutationFetcher<TUpdateUserRequestParams, TServerResponse<TUserResponse>>(
  'updateProfileApi',
  async (data) => {
    return privateRequest('/accounts', {
      method: 'PUT',
      data,
    })
  },
)

export const inviteCoWorkersApi = toMutationFetcher<TInviteCoWorkerRequestParams, TServerResponse<void>>(
  'inviteMultipleCoWorkersApi',
  async (data) => {
    return privateRequest('/accounts/request-create-account', {
      method: 'POST',
      data: {
        email: data.email,
        role: data.role,
        brand: data.brand,
        url: data.redirectUrl,
      },
    })
  },
)

export const inviteMultipleCoWorkersApi = toMutationFetcher<
  TInviteMultipleCoWorkersRequestParams,
  TServerResponse<void>[]
>('inviteMultipleCoWorkersApi', async (data) => {
  const { emails, role, brand, redirectUrl } = data
  const requests = emails.map((email) => {
    return inviteCoWorkersApi.raw({ email, role, brand, redirectUrl })
  })
  return Promise.all(requests)
})

export const getAllUserApi = toQueryFetcher<void, TServerResponse<TUserResponse[]>>('getAllUserApi', async () => {
  return privateRequest('/accounts')
})

export const updateUserStatusApi = toMutationFetcher<TUpdateUserStatusRequestParams, TServerResponse<void>>(
  'updateUserStatusApi',
  async (data) => {
    return privateRequest(`/accounts/update-account-status/${data.id}`, {
      method: 'PUT',
      data: {
        status: data.status,
      },
    })
  },
)

export const updateUsersListStatusApi = toMutationFetcher<TUpdateUsersListStatusRequestParams, TServerResponse<void>[]>(
  'updateUsersListStatusApi',
  async (data) => {
    const { ids, status } = data
    const requests = ids.map((id) => {
      return updateUserStatusApi.raw({ id, status })
    })
    return Promise.all(requests)
  },
)

export const getActiveConsultantsApi = toQueryFetcher<
  TGetConsultantsFilterRequestParams,
  TServerResponseWithPaging<TUser[]>
>('getActiveConsultantsApi', async (params) => {
  // Create filter parameters specifically for active consultants
  const filterParams: TGetAccountFilterRequestParams = {
    ...params,
    statuses: [UserStatusEnum.ACTIVE].join(','),
    role: UserRoleEnum.CONSULTANT,
  }

  const res = (await publicRequest('/accounts/filter-account', {
    method: 'GET',
    params: filterParams,
  })) as TServerResponseWithPaging<TUserResponse[]>

  const { data: userData } = res

  // Process to format the user data
  const parsedData = userData.items.map<TUser>((user) => {
    // Handle the role which might be an object with a 'role' property or just a string
    const userRole =
      typeof user.role === 'object' && user.role !== null
        ? (user.role as TRoleResponse).role
        : user.role || UserRoleEnum.CONSULTANT

    return {
      ...user,
      role: userRole,
    } as TUser
  })

  // Return properly formatted result
  return {
    message: res.message,
    data: {
      ...res.data,
      items: parsedData,
    },
  }
})

export const getConsultantsWithServicesApi = toQueryFetcher<
  TGetConsultantsFilterRequestParams,
  TServerResponseWithPaging<
    {
      consultant: TUser
      services: IConsultantService[]
    }[]
  >
>('getConsultantsWithServicesApi', async (params) => {
  const consultants = await getActiveConsultantsApi.raw(params)

  const services = await Promise.all(
    consultants.data.items.map(async (consultant) => {
      const services = await filterConsultantServicesApi.raw({
        accountIds: consultant.id,
        statuses: [ConsultantServiceStatusEnum.ACTIVE].join(','),
        limit: 2,
      })
      return services.data.items
    }),
  ).catch((error) => {
    console.log('error', error)
    return []
  })

  const consultantWithServices = consultants.data.items
    .map((consultant, index) => {
      const existAnyService = services[index].length > 0
      if (existAnyService) {
        return {
          consultant,
          services: services[index],
        }
      }

      return null
    })
    .filter((item) => item !== null)

  return {
    message: consultants.message,
    data: {
      items: consultantWithServices,
      total: consultants.data.total,
      totalPages: consultants.data.totalPages,
      page: consultants.data.page,
      limit: consultants.data.limit,
    },
  }
})

/**
 * Get an active consultant by ID
 * @param id - The ID of the consultant to fetch
 * @returns The consultant data if found and active
 */
export const getConsultantActiveById = toQueryFetcher<string, TServerResponse<TUser>>(
  'getConsultantActiveById',
  async (id) => {
    return publicRequest(`/accounts/get-by-id/${id}`)
  },
)

/**
 * Get an active consultant by ID with all their active services
 * @param id - The ID of the consultant to fetch
 * @returns The consultant data with all their active services
 */
export const getConsultantActiveByIdWithFullActiveService = toQueryFetcher<
  string,
  TServerResponse<{
    consultant: TUser
    services: IConsultantService[]
  }>
>('getConsultantActiveByIdWithFullActiveService', async (id) => {
  try {
    // First get the consultant data
    const consultant = await getConsultantActiveById.raw(id)

    // Then get all their active services (no limit)
    const services = await filterConsultantServicesApi.raw({
      accountIds: id,
      statuses: [ConsultantServiceStatusEnum.ACTIVE].join(','),
      limit: 1000, // TODO: remove this limit
    })

    // Return combined data
    return {
      message: consultant.message,
      data: {
        consultant: consultant.data,
        services: services.data.items,
      },
    }
  } catch (error) {
    console.error('Error fetching consultant with services:', error)
    throw error
  }
})
