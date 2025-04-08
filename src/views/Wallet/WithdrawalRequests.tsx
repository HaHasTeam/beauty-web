import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { AlertCircle, ArrowDown, History } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import { cancelWithdrawalRequestApi, getWithdrawalRequestsApi } from '@/network/apis/wallet/withdrawal-requests'
import { useStore } from '@/store/store'
import { IWithdrawalRequest, WithdrawalRequestFilterParams, WithdrawalRequestStatusEnum } from '@/types/wallet'
import { formatCurrency } from '@/utils/number'
import { minifyString } from '@/utils/string'

// Badge for withdrawal request status
const StatusBadge = ({ status }: { status: WithdrawalRequestStatusEnum }) => {
  const { t } = useTranslation()

  // Set badge style based on status
  const getStatusStyle = () => {
    switch (status) {
      case WithdrawalRequestStatusEnum.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case WithdrawalRequestStatusEnum.APPROVED:
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case WithdrawalRequestStatusEnum.REJECTED:
        return 'bg-red-100 text-red-800 border-red-200'
      case WithdrawalRequestStatusEnum.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200'
      case WithdrawalRequestStatusEnum.CANCELLED:
        return 'bg-slate-100 text-slate-800 border-slate-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Get translated status
  const getTranslatedStatus = () => {
    const statusKey = `wallet.withdrawalRequests.status.${status.toLowerCase()}`
    return t(statusKey, status)
  }

  return (
    <Badge className={`${getStatusStyle()} border px-2 py-1 h-6 font-medium rounded-md`}>{getTranslatedStatus()}</Badge>
  )
}

// Withdrawal request item component
const WithdrawalRequestItem = ({
  request,
  onCancel,
  isCanceling,
}: {
  request: IWithdrawalRequest
  onCancel: (id: string) => void
  isCanceling: boolean
}) => {
  const { t } = useTranslation()
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const { user } = useStore(
    useShallow((state) => ({
      user: state.user,
    })),
  )
  const currentUserId = user?.id
  const canCancel = request.status === WithdrawalRequestStatusEnum.PENDING
  const showProcessedBy = request.processedBy && request.processedBy.id !== currentUserId
  const isRejected = request.status === WithdrawalRequestStatusEnum.REJECTED && !!request.rejectedReason

  // Get bank details - handling both the new direct model and previous model
  const getBankName = () => {
    if (request.bankName) return request.bankName
    return request.bankAccount?.bankName || ''
  }

  const getAccountNumber = () => {
    if (request.accountNumber) return request.accountNumber
    return request.bankAccount?.accountNumber || ''
  }

  const getAccountName = () => {
    if (request.accountName) return request.accountName
    return request.bankAccount?.accountName || ''
  }

  // Get gradient background based on status
  const getGradientBg = () => {
    switch (request.status) {
      case WithdrawalRequestStatusEnum.PENDING:
        return 'from-amber-50 to-white'
      case WithdrawalRequestStatusEnum.APPROVED:
        return 'from-blue-50 to-white'
      case WithdrawalRequestStatusEnum.COMPLETED:
        return 'from-green-50 to-white'
      case WithdrawalRequestStatusEnum.REJECTED:
        return 'from-red-50 to-white'
      case WithdrawalRequestStatusEnum.CANCELLED:
        return 'from-slate-50 to-white'
      default:
        return 'from-slate-50 to-white'
    }
  }

  // Get icon background color based on status
  const getIconBgColor = () => {
    switch (request.status) {
      case WithdrawalRequestStatusEnum.PENDING:
        return 'bg-amber-100 text-amber-800'
      case WithdrawalRequestStatusEnum.APPROVED:
        return 'bg-blue-100 text-blue-800'
      case WithdrawalRequestStatusEnum.COMPLETED:
        return 'bg-green-100 text-green-800'
      case WithdrawalRequestStatusEnum.REJECTED:
        return 'bg-red-100 text-red-800'
      case WithdrawalRequestStatusEnum.CANCELLED:
        return 'bg-slate-100 text-slate-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  const handleCancelRequest = () => {
    setShowCancelDialog(false)
    onCancel(request.id)
  }

  return (
    <>
      <div
        className={`border border-border bg-gradient-to-r ${getGradientBg()} rounded-xl p-3 mb-3 transition-all duration-200 shadow-sm hover:shadow-lg relative overflow-hidden group`}
      >
        {/* Decorative pattern */}
        <div className="absolute top-0 right-0 w-24 h-24 opacity-5 rounded-full -mt-8 -mr-8 bg-black transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
        {/* Decorative dots pattern */}
        <div className="absolute w-full h-full opacity-[0.03] -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjwvc3ZnPg==')]"></div>

        <div className="flex flex-col sm:flex-row gap-3 relative">
          {/* Left side with icon and type */}
          <div className="flex items-center gap-3">
            <div className={`${getIconBgColor()} p-2 rounded-full flex items-center justify-center shadow-sm`}>
              <ArrowDown className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <StatusBadge status={request.status} />
              <span className="text-xs text-muted-foreground mt-0.5">
                {format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm:ss')}
              </span>
            </div>
          </div>

          {/* Center with ID and bank details */}
          <div className="flex-grow flex flex-col justify-center my-1 sm:my-0">
            <div className="flex items-center gap-2">
              <div className="uppercase text-xs font-mono bg-white px-1.5 py-0.5 rounded-md text-center border border-slate-200 shadow-sm">
                {'#' + minifyString(request.id)}
              </div>
            </div>

            <div className="text-sm flex flex-wrap items-center mt-1 gap-x-3 gap-y-1">
              <div className="flex items-center">
                <span className="text-slate-500 mr-1">{t('wallet.withdrawalRequests.bank', 'Bank')}:</span>
                <span className="font-medium">{getBankName()}</span>
              </div>
              <div className="flex items-center">
                <span className="text-slate-500 mr-1">{t('wallet.withdrawalRequests.accountNumber', 'Account')}:</span>
                <span className="font-medium">{getAccountNumber()}</span>
              </div>
              <div className="flex items-center">
                <span className="text-slate-500 mr-1">{t('wallet.withdrawalRequests.accountName', 'Name')}:</span>
                <span className="font-medium">{getAccountName()}</span>
              </div>

              {showProcessedBy && (
                <div className="flex items-center">
                  <span className="text-slate-500 mr-1">
                    {t('wallet.withdrawalRequests.processedBy', 'Processed by')}:
                  </span>
                  <span className="font-medium">Admin</span>
                </div>
              )}
            </div>

            {/* Rejection reason - displayed directly instead of tooltip */}
            {isRejected && (
              <div className="mt-2 bg-red-50 border border-red-100 rounded-md p-2 text-sm text-red-700 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium mb-0.5">{t('wallet.withdrawalRequests.rejected', 'Rejected')}:</div>
                  <div className="text-xs">{request.rejectedReason}</div>
                </div>
              </div>
            )}
          </div>

          {/* Right side with amount and actions */}
          <div className="flex flex-col items-end justify-center gap-2 min-w-[120px]">
            <div className="text-red-600 font-semibold text-base md:text-lg px-3 py-1.5 rounded-lg backdrop-blur-sm bg-rose-100/80 shadow-sm">
              {formatCurrency(request.amount)}
            </div>
            {canCancel && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowCancelDialog(true)}
                className="h-8"
                disabled={isCanceling}
              >
                {t('wallet.withdrawalRequests.cancel', 'Cancel')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('wallet.withdrawalRequests.cancelConfirmTitle', 'Cancel Withdrawal Request')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                'wallet.withdrawalRequests.cancelConfirmDescription',
                'Are you sure you want to cancel this withdrawal request? This action cannot be undone.',
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCanceling}>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelRequest}
              disabled={isCanceling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('wallet.withdrawalRequests.confirmCancel', 'Yes, cancel request')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Status filter component
const StatusFilters = ({
  selectedStatus,
  onStatusChange,
}: {
  selectedStatus: WithdrawalRequestStatusEnum | 'ALL'
  onStatusChange: (status: WithdrawalRequestStatusEnum | 'ALL') => void
}) => {
  const { t } = useTranslation()

  // Get translated status text
  const getTranslatedStatus = (status: WithdrawalRequestStatusEnum | 'ALL') => {
    if (status === 'ALL') {
      return t('wallet.withdrawalRequests.filters.all', 'All')
    }
    const statusKey = `wallet.withdrawalRequests.status.${status.toLowerCase()}`
    return t(statusKey, status)
  }

  // Get style based on selected status
  const getStatusStyle = (status: WithdrawalRequestStatusEnum | 'ALL') => {
    if (selectedStatus === status) {
      return 'bg-primary text-white border-primary hover:bg-primary/90'
    }

    switch (status) {
      case WithdrawalRequestStatusEnum.PENDING:
        return 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200'
      case WithdrawalRequestStatusEnum.APPROVED:
        return 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'
      case WithdrawalRequestStatusEnum.COMPLETED:
        return 'bg-emerald-50 text-green-700 hover:bg-emerald-100 border-emerald-200'
      case WithdrawalRequestStatusEnum.REJECTED:
        return 'bg-rose-50 text-red-700 hover:bg-rose-100 border-rose-200'
      case WithdrawalRequestStatusEnum.CANCELLED:
        return 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
      case 'ALL':
        return 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
      default:
        return 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  // Array of all statuses to filter by
  const statuses: (WithdrawalRequestStatusEnum | 'ALL')[] = [
    'ALL',
    WithdrawalRequestStatusEnum.PENDING,
    WithdrawalRequestStatusEnum.APPROVED,
    WithdrawalRequestStatusEnum.COMPLETED,
    WithdrawalRequestStatusEnum.REJECTED,
    WithdrawalRequestStatusEnum.CANCELLED,
  ]

  return (
    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-border shadow-md mb-3 relative overflow-hidden group">
      {/* Decorative circle */}
      <div
        className="absolute w-32 h-32 -right-12 -top-12 rounded-full opacity-10 transform group-hover:scale-110 transition-transform duration-300"
        style={{ backgroundColor: 'var(--primary)' }}
      ></div>

      {/* Decorative dots pattern */}
      <div className="absolute w-full h-full opacity-[0.03] -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjwvc3ZnPg==')]"></div>

      <div className="flex items-center gap-2 mb-2 text-sm font-medium text-primary relative">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </div>
        {t('wallet.withdrawalRequests.filterByStatus', 'Filter by status')}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {statuses.map((status) => (
          <Badge
            key={status}
            variant={selectedStatus === status ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer py-1 px-3 rounded-full text-xs',
              selectedStatus !== status ? getStatusStyle(status) : '',
            )}
            onClick={() => onStatusChange(status)}
          >
            {getTranslatedStatus(status)}
          </Badge>
        ))}
      </div>
    </div>
  )
}

// Main withdrawal requests component
const WithdrawalRequests = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { successToast, errorToast } = useToast()
  const queryClient = useQueryClient()

  // Get status filter from URL or default to 'ALL'
  const statusParam = (searchParams.get('status') as WithdrawalRequestStatusEnum | 'ALL') || 'ALL'
  const pageParam = searchParams.get('page') || '1'

  const [selectedStatus, setSelectedStatus] = useState<WithdrawalRequestStatusEnum | 'ALL'>(statusParam)
  const [currentPage, setCurrentPage] = useState(parseInt(pageParam, 10))
  const limit = 10

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams)

    if (selectedStatus !== 'ALL') {
      params.set('status', selectedStatus)
    } else {
      params.delete('status')
    }

    params.set('page', currentPage.toString())
    setSearchParams(params)
  }, [selectedStatus, currentPage, setSearchParams, searchParams])

  // Handle status filter change
  const handleStatusChange = (status: WithdrawalRequestStatusEnum | 'ALL') => {
    setSelectedStatus(status)
    setCurrentPage(1)
  }

  // Get query parameters for API call
  const getQueryParams = () => {
    const params: WithdrawalRequestFilterParams = {
      page: currentPage,
      limit,
    }

    if (selectedStatus !== 'ALL') {
      params.statuses = [selectedStatus as WithdrawalRequestStatusEnum]
    }

    return params
  }

  // Fetch withdrawal requests
  const { data: requestsData, isLoading } = useQuery({
    queryKey: [getWithdrawalRequestsApi.queryKey, getQueryParams()],
    queryFn: getWithdrawalRequestsApi.fn,
  })

  // Cancel withdrawal request mutation
  const { mutate: cancelRequest, isPending: isCanceling } = useMutation({
    mutationKey: [cancelWithdrawalRequestApi.mutationKey],
    mutationFn: cancelWithdrawalRequestApi.fn,
    onSuccess: () => {
      successToast({
        message: t('wallet.withdrawalRequests.cancelSuccess', 'Request cancelled successfully'),
        description: t(
          'wallet.withdrawalRequests.cancelSuccessDescription',
          'Your withdrawal request has been cancelled',
        ),
      })
      queryClient.invalidateQueries({ queryKey: [getWithdrawalRequestsApi.queryKey] })
    },
    onError: () => {
      errorToast({
        message: t('wallet.withdrawalRequests.cancelError', 'Failed to cancel request'),
        description: t(
          'wallet.withdrawalRequests.cancelErrorDescription',
          'There was a problem cancelling your withdrawal request',
        ),
      })
    },
  })

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle canceling a withdrawal request
  const handleCancelRequest = (id: string) => {
    cancelRequest(id)
  }

  // Extract data from the response
  const totalPages = requestsData?.data?.totalPages || 1

  // Handle both data formats: array or items object inside data
  const withdrawalRequests: IWithdrawalRequest[] = (() => {
    if (!requestsData?.data) return []
    if (Array.isArray(requestsData.data)) return requestsData.data
    if (requestsData.data.items) return requestsData.data.items
    return []
  })()

  // Render withdrawal requests list
  const renderWithdrawalRequests = (requests: IWithdrawalRequest[]) => {
    if (requests.length === 0) {
      return (
        <div className="text-center py-8">
          <History className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {t('wallet.withdrawalRequests.empty.title', 'No withdrawal requests found')}
          </h3>
          <p className="text-muted-foreground">
            {t(
              'wallet.withdrawalRequests.empty.description',
              "You haven't made any withdrawal requests that match the current filters.",
            )}
          </p>
        </div>
      )
    }

    return requests.map((request) => (
      <WithdrawalRequestItem
        key={request.id}
        request={request}
        onCancel={handleCancelRequest}
        isCanceling={isCanceling}
      />
    ))
  }

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">
          {t('wallet.withdrawalRequests.title', 'Withdrawal Requests')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <StatusFilters selectedStatus={selectedStatus} onStatusChange={handleStatusChange} />

        {isLoading ? (
          <LoadingContentLayer label={t('wallet.withdrawalRequests.loading', 'Loading requests...')} />
        ) : (
          <>
            <div className="mb-4">{renderWithdrawalRequests(withdrawalRequests)}</div>

            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                    </PaginationItem>
                  )}

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum = currentPage - 2 + i
                    if (pageNum <= 0) pageNum = i + 1
                    if (pageNum > totalPages) return null

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink isActive={pageNum === currentPage} onClick={() => handlePageChange(pageNum)}>
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default WithdrawalRequests
