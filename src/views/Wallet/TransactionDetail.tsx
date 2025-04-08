import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ArrowDown, ArrowUp, History, Wallet } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { filterTransactions, getFinancialSummary } from '@/network/apis/transaction'
import { ITransaction, TransactionTypeEnum } from '@/types/transaction'
import { formatCurrency } from '@/utils/number'
import { getDisplayString, minifyString } from '@/utils/string'

// Styled badge for transaction types
const TransactionTypeBadge = ({ type }: { type: TransactionTypeEnum }) => {
  const { t } = useTranslation()
  let bgColor = ''
  let textColor = ''

  switch (type) {
    case TransactionTypeEnum.DEPOSIT:
      bgColor = 'bg-emerald-100'
      textColor = 'text-green-700'
      break
    case TransactionTypeEnum.BOOKING_REFUND:
    case TransactionTypeEnum.ORDER_REFUND:
      bgColor = 'bg-sky-100'
      textColor = 'text-blue-700'
      break
    case TransactionTypeEnum.WITHDRAW:
      bgColor = 'bg-amber-100'
      textColor = 'text-amber-700'
      break
    case TransactionTypeEnum.ORDER_PURCHASE:
    case TransactionTypeEnum.BOOKING_PURCHASE:
      bgColor = 'bg-indigo-100'
      textColor = 'text-indigo-700'
      break
    case TransactionTypeEnum.ORDER_CANCEL:
    case TransactionTypeEnum.BOOKING_CANCEL:
      bgColor = 'bg-rose-100'
      textColor = 'text-red-700'
      break
    default:
      bgColor = 'bg-slate-100'
      textColor = 'text-slate-700'
  }

  // Get translation for transaction type
  const getTranslatedType = () => {
    const typeKey = `wallet.transaction.types.${type.toLowerCase()}`
    return t(typeKey, getDisplayString(type))
  }

  return (
    <Badge
      className={`${bgColor} ${textColor} hover:${bgColor} border-none px-1.5 py-0.5 h-5 font-medium text-xs rounded-md`}
    >
      {getTranslatedType()}
    </Badge>
  )
}

// Transaction item component
const TransactionItem = ({ transaction }: { transaction: ITransaction }) => {
  const { t } = useTranslation()
  const isIncome = [
    TransactionTypeEnum.DEPOSIT,
    TransactionTypeEnum.BOOKING_REFUND,
    TransactionTypeEnum.ORDER_REFUND,
  ].includes(transaction.type)

  // Function to get translated payment method
  const getTranslatedPaymentMethod = (method: string) => {
    const paymentMethodKey = `payment.methods.${method.toLowerCase()}`
    return t(paymentMethodKey, method.toLowerCase().replace('_', ' '))
  }

  // Get icon based on transaction type
  const getTransactionIcon = () => {
    switch (transaction.type) {
      case TransactionTypeEnum.DEPOSIT:
        return <ArrowUp className="w-4 h-4" />
      case TransactionTypeEnum.WITHDRAW:
        return <ArrowDown className="w-4 h-4" />
      case TransactionTypeEnum.ORDER_PURCHASE:
      case TransactionTypeEnum.BOOKING_PURCHASE:
        return (
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
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        )
      case TransactionTypeEnum.ORDER_REFUND:
      case TransactionTypeEnum.BOOKING_REFUND:
        return (
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
              d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
            />
          </svg>
        )
      case TransactionTypeEnum.ORDER_CANCEL:
      case TransactionTypeEnum.BOOKING_CANCEL:
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      default:
        return <History className="w-4 h-4" />
    }
  }

  // Get background color based on transaction type for the icon circle
  const getIconBgColor = () => {
    switch (transaction.type) {
      case TransactionTypeEnum.DEPOSIT:
        return 'bg-emerald-100 text-slate-900'
      case TransactionTypeEnum.WITHDRAW:
        return 'bg-amber-100 text-slate-900'
      case TransactionTypeEnum.ORDER_PURCHASE:
      case TransactionTypeEnum.BOOKING_PURCHASE:
        return 'bg-indigo-100 text-slate-900'
      case TransactionTypeEnum.ORDER_REFUND:
      case TransactionTypeEnum.BOOKING_REFUND:
        return 'bg-sky-100 text-slate-900'
      case TransactionTypeEnum.ORDER_CANCEL:
      case TransactionTypeEnum.BOOKING_CANCEL:
        return 'bg-rose-100 text-slate-900'
      default:
        return 'bg-slate-100 text-slate-900'
    }
  }

  // Get gradient background based on transaction type
  const getGradientBg = () => {
    switch (transaction.type) {
      case TransactionTypeEnum.DEPOSIT:
        return 'from-emerald-50/90 to-white'
      case TransactionTypeEnum.WITHDRAW:
        return 'from-amber-50/90 to-white'
      case TransactionTypeEnum.ORDER_PURCHASE:
      case TransactionTypeEnum.BOOKING_PURCHASE:
        return 'from-indigo-50/90 to-white'
      case TransactionTypeEnum.ORDER_REFUND:
      case TransactionTypeEnum.BOOKING_REFUND:
        return 'from-sky-50/90 to-white'
      case TransactionTypeEnum.ORDER_CANCEL:
      case TransactionTypeEnum.BOOKING_CANCEL:
        return 'from-rose-50/90 to-white'
      default:
        return 'from-slate-50/90 to-white'
    }
  }

  // Get accent color for text and icons
  const getAccentColors = () => {
    switch (transaction.type) {
      case TransactionTypeEnum.DEPOSIT:
        return {
          balance: 'text-green-600',
          payment: 'text-slate-900',
          order: 'text-slate-900',
          balanceIcon: 'text-slate-700',
          paymentIcon: 'text-slate-700',
          orderIcon: 'text-slate-700',
        }
      case TransactionTypeEnum.WITHDRAW:
        return {
          balance: 'text-red-600',
          payment: 'text-slate-900',
          order: 'text-slate-900',
          balanceIcon: 'text-slate-700',
          paymentIcon: 'text-slate-700',
          orderIcon: 'text-slate-700',
        }
      case TransactionTypeEnum.ORDER_PURCHASE:
      case TransactionTypeEnum.BOOKING_PURCHASE:
        return {
          balance: 'text-red-600',
          payment: 'text-slate-900',
          order: 'text-slate-900',
          balanceIcon: 'text-slate-700',
          paymentIcon: 'text-slate-700',
          orderIcon: 'text-slate-700',
        }
      case TransactionTypeEnum.ORDER_REFUND:
      case TransactionTypeEnum.BOOKING_REFUND:
        return {
          balance: 'text-green-600',
          payment: 'text-slate-900',
          order: 'text-slate-900',
          balanceIcon: 'text-slate-700',
          paymentIcon: 'text-slate-700',
          orderIcon: 'text-slate-700',
        }
      case TransactionTypeEnum.ORDER_CANCEL:
      case TransactionTypeEnum.BOOKING_CANCEL:
        return {
          balance: 'text-green-600',
          payment: 'text-slate-900',
          order: 'text-slate-900',
          balanceIcon: 'text-slate-700',
          paymentIcon: 'text-slate-700',
          orderIcon: 'text-slate-700',
        }
      default:
        return {
          balance: 'text-slate-900',
          payment: 'text-slate-900',
          order: 'text-slate-900',
          balanceIcon: 'text-slate-700',
          paymentIcon: 'text-slate-700',
          orderIcon: 'text-slate-700',
        }
    }
  }

  const accentColors = getAccentColors()

  return (
    <div
      className={`border border-border bg-gradient-to-r ${getGradientBg()} rounded-xl p-3 mb-3 transition-all duration-200 shadow-sm hover:shadow-lg relative overflow-hidden group`}
    >
      {/* Decorative pattern - reduced size */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5 rounded-full -mt-8 -mr-8 bg-black transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>

      <div className="flex flex-col sm:flex-row gap-2 relative">
        {/* Left side with icon and type */}
        <div className="flex items-center gap-2">
          <div className={`${getIconBgColor()} p-2 rounded-full flex items-center justify-center shadow-sm`}>
            {getTransactionIcon()}
          </div>
          <div className="flex flex-col">
            <TransactionTypeBadge type={transaction.type} />
            <span className="text-xs text-muted-foreground mt-0.5">
              {format(new Date(transaction.createdAt), 'dd/MM/yyyy HH:mm:ss')}
            </span>
          </div>
        </div>

        {/* Center with ID and description */}
        <div className="flex-grow flex flex-col justify-center my-1 sm:my-0">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="uppercase text-xs font-mono bg-white px-1.5 py-0.5 rounded-md text-center border border-slate-200 shadow-sm">
                    {'#' + minifyString(transaction.id)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-mono text-xs">{transaction.id}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {transaction.description && (
              <div className="text-sm text-slate-800 line-clamp-1 max-w-xs">{transaction.description}</div>
            )}
          </div>
        </div>

        {/* Right side with amount */}
        <div className="flex items-center">
          <div
            className={cn(
              'font-semibold text-lg px-3 py-1.5 rounded-lg backdrop-blur-sm shadow-sm',
              isIncome ? 'text-green-600 bg-emerald-100/80' : 'text-red-600 bg-rose-100/80',
            )}
          >
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </div>
        </div>
      </div>

      {/* Transaction details in a more compact card format */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-slate-100/70">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <svg
              className={`w-3.5 h-3.5 ${accentColors.balanceIcon}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <span className="text-xs font-medium text-slate-700">
              {t('wallet.transaction.balanceAfter', 'Số dư sau giao dịch')}
            </span>
          </div>
          <span className={`font-semibold ${accentColors.balance} text-base`}>
            {formatCurrency(transaction.balanceAfterTransaction)}
          </span>
        </div>

        {transaction.paymentMethod && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-1">
              <svg
                className={`w-3.5 h-3.5 ${accentColors.paymentIcon}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-xs font-medium text-slate-700">
                {t('wallet.transaction.paymentMethod', 'Phương thức thanh toán')}
              </span>
            </div>
            <span className="font-semibold text-slate-900 text-base capitalize">
              {getTranslatedPaymentMethod(transaction.paymentMethod)}
            </span>
          </div>
        )}

        {transaction.order && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-1">
              <svg
                className={`w-3.5 h-3.5 ${accentColors.orderIcon}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="text-xs font-medium text-slate-700">
                {t('wallet.transaction.relatedOrder', 'Đơn hàng liên quan')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="uppercase text-xs font-mono bg-white/70 px-1.5 py-0.5 rounded-md border border-slate-200">
                #{minifyString(transaction.order.id)}
              </span>
              <Button variant="link" className="h-auto p-0 text-primary font-medium text-xs" asChild>
                <a href={`/orders/${transaction.order.id}`}>{t('wallet.transaction.viewOrder', 'Xem đơn hàng')}</a>
              </Button>
            </div>
          </div>
        )}
      </div>

      {transaction.description && (
        <div className="mt-2 text-sm bg-white rounded-lg p-2 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-1.5 mb-0.5 text-muted-foreground text-xs font-medium">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {t('wallet.transaction.description', 'Mô tả')}
          </div>
          <p className="text-sm text-slate-900">{transaction.description}</p>
        </div>
      )}
    </div>
  )
}

// Card for financial metrics with more compact layout
const MetricCard = ({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueColor: string
}) => {
  // Convert background colors to use richer colors but keep original text colors
  const getRichBgColor = (color: string) => {
    if (color.includes('green')) return color.replace('text-green', 'bg-emerald').replace('-600', '-100')
    if (color.includes('blue')) return color.replace('text-blue', 'bg-sky').replace('-600', '-100')
    if (color.includes('red')) return color.replace('text-red', 'bg-rose').replace('-600', '-100')
    return color.replace('text-', 'bg-').replace('-600', '-100')
  }

  const richBgColor = getRichBgColor(valueColor)

  return (
    <Card className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-border hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div
        className="absolute w-32 h-32 -right-12 -top-12 rounded-full opacity-10 transform group-hover:scale-110 transition-transform duration-300"
        style={{
          backgroundColor: valueColor.replace('text-', '').includes('primary')
            ? 'var(--primary)'
            : `var(--${richBgColor.replace('bg-', '').replace('-100', '-200')})`,
        }}
      ></div>

      {/* Decorative dots pattern */}
      <div className="absolute w-full h-full opacity-[0.03] -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjwvc3ZnPg==')]"></div>

      <CardContent className="p-4 relative">
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-lg ${richBgColor} text-slate-900 shadow-sm`}
          >
            {icon}
          </div>
          <p className="text-muted-foreground font-medium text-sm">{label}</p>
        </div>
        <p className={`${valueColor} font-bold text-2xl tracking-tight`}>{value}</p>
      </CardContent>
    </Card>
  )
}

// Main transaction list component with OrderDetail-like layout
const TransactionDetail = () => {
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useQueryState('type')
  const [currentPageString, setCurrentPageString] = useQueryState('page')
  const currentPageNumber = currentPageString ? parseInt(currentPageString, 10) : 0
  const [perPage] = useState<number>(10)

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab)
    setCurrentPageString('0') // Reset to first page when changing tabs
  }

  // Derive query params based on selected tab
  const getQueryParams = () => {
    const params: {
      types?: TransactionTypeEnum[]
      page: number
      limit: number
      sortBy: string
      order: 'ASC' | 'DESC'
    } = {
      page: currentPageNumber + 1, // API uses 1-based indexing
      limit: perPage,
      sortBy: 'createdAt',
      order: 'DESC',
    }

    // Add type filter based on selected tab
    if (selectedTab && selectedTab !== 'all') {
      const typeMap: Record<string, TransactionTypeEnum> = {
        deposit: TransactionTypeEnum.DEPOSIT,
        withdraw: TransactionTypeEnum.WITHDRAW,
        orderPurchase: TransactionTypeEnum.ORDER_PURCHASE,
        bookingPurchase: TransactionTypeEnum.BOOKING_PURCHASE,
        orderRefund: TransactionTypeEnum.ORDER_REFUND,
        bookingRefund: TransactionTypeEnum.BOOKING_REFUND,
        orderCancel: TransactionTypeEnum.ORDER_CANCEL,
        bookingCancel: TransactionTypeEnum.BOOKING_CANCEL,
      }

      if (typeMap[selectedTab]) {
        params.types = [typeMap[selectedTab]]
      }
    }

    return params
  }

  // Fetch transactions with filtering and pagination
  const { data: transactionData, isLoading: isLoadingTransactions } = useQuery({
    queryKey: [filterTransactions.queryKey, getQueryParams()],
    queryFn: filterTransactions.fn,
  })

  // Fetch financial summary data
  const { data: financialSummaryData, isLoading: isLoadingFinancialSummary } = useQuery({
    queryKey: [getFinancialSummary.queryKey],
    queryFn: getFinancialSummary.fn,
  })

  const transactions = transactionData?.data?.items || []
  const totalPages = transactionData?.data?.totalPages || 1
  const financialSummary = financialSummaryData?.data || {
    totalAmountFromDeposit: 0,
    totalAmountFromWithDrawal: 0,
    balance: 0,
  }

  const isLoading = isLoadingTransactions || isLoadingFinancialSummary

  // Render transactions list with optional filtering
  const renderTransactions = (transactionList: ITransaction[]) => {
    if (transactionList.length === 0) {
      return (
        <div className="py-6 text-center bg-white/60 rounded-lg border border-slate-100 shadow-sm">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shadow-sm">
              <History className="w-6 h-6 text-slate-500" />
            </div>
          </div>
          <p className="text-slate-700 font-medium">
            {t('wallet.transaction.noTransactions', 'Không có giao dịch nào')}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('wallet.transaction.tryDifferentFilter', 'Hãy thử bộ lọc khác')}
          </p>
        </div>
      )
    }

    return (
      <>
        <div className="space-y-3">
          {transactionList.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-4 flex justify-center">
            <PaginationContent className="bg-white rounded-lg px-2 py-1 shadow-sm border border-slate-100 flex flex-wrap gap-1 justify-center">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPageString(Math.max(0, currentPageNumber - 1).toString())}
                  className={cn(
                    'h-8 min-w-[32px] p-0 flex items-center justify-center',
                    currentPageNumber === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-muted/20',
                  )}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show first page, last page, current page and pages around current
                let pageToShow: number
                if (totalPages <= 5) {
                  pageToShow = i
                } else if (currentPageNumber <= 1) {
                  pageToShow = i
                } else if (currentPageNumber >= totalPages - 2) {
                  pageToShow = totalPages - 5 + i
                } else {
                  pageToShow = currentPageNumber - 2 + i
                }

                return (
                  <PaginationItem key={pageToShow}>
                    <PaginationLink
                      onClick={() => setCurrentPageString(pageToShow.toString())}
                      isActive={currentPageNumber === pageToShow}
                      className="h-8 min-w-[32px] p-0 flex items-center justify-center text-sm"
                    >
                      {pageToShow + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPageString(Math.min(totalPages - 1, currentPageNumber + 1).toString())}
                  className={cn(
                    'h-8 min-w-[32px] p-0 flex items-center justify-center',
                    currentPageNumber >= totalPages - 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer hover:bg-muted/20',
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </>
    )
  }

  return (
    <div className="">
      {isLoading && <LoadingContentLayer />}
      <div className="w-full max-w-screen-xl mx-auto space-y-4 pt-5">
        {/* Header with title */}

        {/* Metrics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            icon={<ArrowUp className="w-4 h-4" />}
            label={t('wallet.transaction.totalDeposits', 'Tổng tiền nạp')}
            value={formatCurrency(financialSummary.totalAmountFromDeposit)}
            valueColor="text-green-600"
          />

          <MetricCard
            icon={<ArrowDown className="w-4 h-4" />}
            label={t('wallet.transaction.totalWithdrawals', 'Tổng tiền rút')}
            value={formatCurrency(financialSummary.totalAmountFromWithDrawal)}
            valueColor="text-amber-600"
          />

          <MetricCard
            icon={<Wallet className="w-4 h-4" />}
            label={t('wallet.transaction.currentBalance', 'Số dư hiện tại')}
            value={formatCurrency(financialSummary.balance)}
            valueColor="text-primary"
          />
        </div>

        {/* Transaction tabs */}
        <Card className="w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-border overflow-hidden">
          <CardHeader className="pb-1 pt-3 px-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary shadow-sm">
                <History className="w-4 h-4" />
              </div>
              <CardTitle className="font-medium text-base">
                {t('wallet.transaction.recentTransactions', 'Giao dịch gần đây')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-2">
            <Tabs defaultValue={selectedTab || 'all'} onValueChange={handleTabChange} className="w-full">
              <TabsList className="flex flex-wrap h-auto p-1 mb-3 bg-gradient-to-r from-slate-100/90 to-indigo-50/50 rounded-lg">
                <TabsTrigger
                  value="all"
                  className="text-xs whitespace-nowrap h-7 px-3 data-[state=active]:shadow-md data-[state=active]:bg-white rounded-md"
                >
                  {t('wallet.transaction.tabs.all', 'Tất cả')}
                </TabsTrigger>
                <TabsTrigger
                  value="deposit"
                  className="text-xs whitespace-nowrap h-7 px-3 data-[state=active]:shadow-md data-[state=active]:bg-white rounded-md"
                >
                  {t('wallet.transaction.tabs.deposit', 'Nạp tiền')}
                </TabsTrigger>
                <TabsTrigger
                  value="withdraw"
                  className="text-xs whitespace-nowrap h-7 px-3 data-[state=active]:shadow-md data-[state=active]:bg-white rounded-md"
                >
                  {t('wallet.transaction.tabs.withdraw', 'Rút tiền')}
                </TabsTrigger>
                <TabsTrigger
                  value="orderPurchase"
                  className="text-xs whitespace-nowrap h-7 px-3 data-[state=active]:shadow-md data-[state=active]:bg-white rounded-md"
                >
                  {t('wallet.transaction.tabs.orderPurchase', 'Mua hàng')}
                </TabsTrigger>
                <TabsTrigger
                  value="bookingPurchase"
                  className="text-xs whitespace-nowrap h-7 px-3 data-[state=active]:shadow-md data-[state=active]:bg-white rounded-md"
                >
                  {t('wallet.transaction.tabs.bookingPurchase', 'Đặt lịch')}
                </TabsTrigger>
                <TabsTrigger
                  value="orderRefund"
                  className="text-xs whitespace-nowrap h-7 px-3 data-[state=active]:shadow-md data-[state=active]:bg-white rounded-md"
                >
                  {t('wallet.transaction.tabs.orderRefund', 'Hoàn tiền đơn hàng')}
                </TabsTrigger>
                <TabsTrigger
                  value="bookingRefund"
                  className="text-xs whitespace-nowrap h-7 px-3 data-[state=active]:shadow-md data-[state=active]:bg-white rounded-md"
                >
                  {t('wallet.transaction.tabs.bookingRefund', 'Hoàn tiền đặt lịch')}
                </TabsTrigger>
                <TabsTrigger
                  value="orderCancel"
                  className="text-xs whitespace-nowrap h-7 px-3 data-[state=active]:shadow-md data-[state=active]:bg-white rounded-md"
                >
                  {t('wallet.transaction.tabs.orderCancel', 'Hủy đơn hàng')}
                </TabsTrigger>
                <TabsTrigger
                  value="bookingCancel"
                  className="text-xs whitespace-nowrap h-7 px-3 data-[state=active]:shadow-md data-[state=active]:bg-white rounded-md"
                >
                  {t('wallet.transaction.tabs.bookingCancel', 'Hủy đặt lịch')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">{renderTransactions(transactions)}</TabsContent>
              <TabsContent value="deposit">
                {renderTransactions(transactions.filter((t) => t.type === TransactionTypeEnum.DEPOSIT))}
              </TabsContent>
              <TabsContent value="withdraw">
                {renderTransactions(transactions.filter((t) => t.type === TransactionTypeEnum.WITHDRAW))}
              </TabsContent>
              <TabsContent value="orderPurchase">
                {renderTransactions(transactions.filter((t) => t.type === TransactionTypeEnum.ORDER_PURCHASE))}
              </TabsContent>
              <TabsContent value="bookingPurchase">
                {renderTransactions(transactions.filter((t) => t.type === TransactionTypeEnum.BOOKING_PURCHASE))}
              </TabsContent>
              <TabsContent value="orderRefund">
                {renderTransactions(transactions.filter((t) => t.type === TransactionTypeEnum.ORDER_REFUND))}
              </TabsContent>
              <TabsContent value="bookingRefund">
                {renderTransactions(transactions.filter((t) => t.type === TransactionTypeEnum.BOOKING_REFUND))}
              </TabsContent>
              <TabsContent value="orderCancel">
                {renderTransactions(transactions.filter((t) => t.type === TransactionTypeEnum.ORDER_CANCEL))}
              </TabsContent>
              <TabsContent value="bookingCancel">
                {renderTransactions(transactions.filter((t) => t.type === TransactionTypeEnum.BOOKING_CANCEL))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TransactionDetail
