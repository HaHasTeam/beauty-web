import { type ColumnDef } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, CreditCard, Wallet } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn, formatDate } from '@/lib/utils'
import { ITransaction, TransactionTypeEnum } from '@/types/transaction'
import { formatCurrency } from '@/utils/number'
import { getDisplayString, minifyString } from '@/utils/string'

export function getColumns(): ColumnDef<ITransaction>[] {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Transaction ID" />,
      cell: ({ row }) => {
        const id = row.getValue('id') as string
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className=" uppercase text-xs font-mono bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-full text-center w-fit mx-auto border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  {'#' + minifyString(id)}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-mono text-xs">{id}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
      size: 150,
      enableSorting: false,
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => {
        const type = row.getValue('type') as TransactionTypeEnum
        const { color, icon } = getTransactionTypeStyle(type)
        return (
          <Badge
            variant="outline"
            className={`capitalize border-none text-xs font-medium px-2.5 py-1 ${color} w-fit gap-1.5`}
          >
            {icon}
            {getDisplayString(type)}
          </Badge>
        )
      },
      size: 220,
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
      cell: ({ row }) => {
        const amount = row.getValue('amount') as number
        const type = row.getValue('type') as TransactionTypeEnum
        const isIncome = [
          TransactionTypeEnum.DEPOSIT,
          TransactionTypeEnum.BOOKING_REFUND,
          TransactionTypeEnum.ORDER_REFUND,
        ].includes(type)

        return (
          <div
            className={cn(
              'font-semibold flex items-center gap-1',
              isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
            )}
          >
            {isIncome ? (
              <ArrowUp className="h-3.5 w-3.5 opacity-80" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5 opacity-80" />
            )}
            {formatCurrency(amount)}
          </div>
        )
      },
      size: 120,
    },
    {
      accessorKey: 'balanceAfterTransaction',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Balance" />,
      cell: ({ row }) => {
        const balance = row.getValue('balanceAfterTransaction') as number
        return (
          <div className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1.5">
            <Wallet className="h-3.5 w-3.5 opacity-70" />
            {formatCurrency(balance)}
          </div>
        )
      },
      size: 120,
    },
    {
      accessorKey: 'paymentMethod',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Payment Method" />,
      cell: ({ row }) => {
        const method = row.getValue('paymentMethod') as string
        if (!method) return <div className="text-slate-400 italic text-xs">-</div>

        return (
          <div className="capitalize flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <CreditCard className="h-3.5 w-3.5 opacity-70" />
            {method?.toLowerCase().replace('_', ' ')}
          </div>
        )
      },
      size: 150,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      cell: ({ cell }) => (
        <div>
          {formatDate(cell.getValue() as Date, {
            hour: 'numeric',
            minute: 'numeric',
            month: '2-digit',
          })}
        </div>
      ),
      size: 260,
    },
  ]
}

function getTransactionTypeStyle(type: TransactionTypeEnum): { color: string; icon: JSX.Element } {
  switch (type) {
    case TransactionTypeEnum.DEPOSIT:
      return {
        color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
        icon: <ArrowUp className="h-3 w-3" />,
      }
    case TransactionTypeEnum.BOOKING_REFUND:
    case TransactionTypeEnum.ORDER_REFUND:
      return {
        color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
        icon: <ArrowUp className="h-3 w-3 rotate-45" />,
      }
    case TransactionTypeEnum.WITHDRAW:
      return {
        color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
        icon: <ArrowDown className="h-3 w-3" />,
      }
    case TransactionTypeEnum.ORDER_PURCHASE:
    case TransactionTypeEnum.BOOKING_PURCHASE:
      return {
        color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
        icon: <ArrowDown className="h-3 w-3" />,
      }
    case TransactionTypeEnum.ORDER_CANCEL:
    case TransactionTypeEnum.BOOKING_CANCEL:
      return {
        color: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400',
        icon: <ArrowDown className="h-3 w-3 rotate-45" />,
      }
    default:
      return {
        color: 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        icon: <span className="w-3 h-3 rounded-full bg-current opacity-50" />,
      }
  }
}
