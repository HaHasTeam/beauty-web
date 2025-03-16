import { RequestStatusEnum } from '@/types/enum'

export const getRequestStatusColor = (status: RequestStatusEnum) => {
  switch (status) {
    case RequestStatusEnum.PENDING:
      return 'bg-yellow-100 text-yellow-600'
    case RequestStatusEnum.APPROVED:
      return 'bg-green-100 text-green-600'
    case RequestStatusEnum.REJECTED:
      return 'bg-red-100 text-red-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}
