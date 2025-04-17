import { IConsultantService } from '@/types/consultant-service'
import { TServerResponse, TServerResponseWithPaging } from '@/types/request'
import { toQueryFetcher } from '@/utils/query'
import { privateRequest, publicRequest } from '@/utils/request'

import { FilterConsultantServiceParams, GetConsultantServiceByIdParams,GetConsultantServicesParams } from './type'


/**
 * Filter consultant services with various parameters
 * 
 * @example
 * ```tsx
 * // Filter by price, system service, account IDs, and status
 * const { data, isLoading } = useQuery({
 *   queryKey: [filterConsultantServicesApi.queryKey, { price: 100, systemServiceId: 'service-123' }],
 *   queryFn: () => filterConsultantServicesApi.fn({ price: 100, systemServiceId: 'service-123' })
 * })
 * ```
 * 
 * @returns Paginated list of consultant services matching the filter criteria
 */
export const filterConsultantServicesApi = toQueryFetcher<
  FilterConsultantServiceParams,
  TServerResponseWithPaging<IConsultantService[]>
>('filterConsultantServicesApi', async (params) => {
  return publicRequest(`/consultant-services/filter-consultant-services`,{
    params
  })
})

/**
 * Get all services of a specific consultant by consultantId
 * 
 * @example
 * ```tsx
 * // Get all services for a consultant
 * const { data, isLoading } = useQuery({
 *   queryKey: [getConsultantServicesApi.queryKey, { consultantId: 'consultant-123' }],
 *   queryFn: () => getConsultantServicesApi.fn({ consultantId: 'consultant-123' })
 * })
 * ```
 * 
 * @returns List of consultant services for the specified consultant
 */
export const getConsultantServicesApi = toQueryFetcher<
  GetConsultantServicesParams,
  TServerResponse<IConsultantService[]>
>('getConsultantServicesApi', async (params) => {
  if (!params?.consultantId) {
    throw new Error('Consultant ID is required')
  }
  
  return privateRequest(`/consultant-services/get-by-consultant/${params.consultantId}`)
})

/**
 * Get a specific consultant service by its ID
 * 
 * @example
 * ```tsx
 * // Get a specific service by ID
 * const { data, isLoading } = useQuery({
 *   queryKey: [getConsultantServiceByIdApi.queryKey, { id: 'service-123' }],
 *   queryFn: () => getConsultantServiceByIdApi.fn({ id: 'service-123' })
 * })
 * ```
 * 
 * @returns The consultant service with the specified ID
 */
export const getConsultantServiceByIdApi = toQueryFetcher<
  GetConsultantServiceByIdParams,
  TServerResponse<IConsultantService>
>('getConsultantServiceByIdApi', async (params) => {
  if (!params?.id) {
    throw new Error('Service ID is required')
  }
  
  return privateRequest(`/consultant-services/get-by-id/${params.id}`)
}) 