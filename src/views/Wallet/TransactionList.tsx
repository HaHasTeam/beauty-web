import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { Shell } from '@/components/ui/shell'
import { filterTransactions } from '@/network/apis/transaction'
import { DataTableQueryState } from '@/types/table'
import { ITransaction, TransactionStatusEnum, TransactionTypeEnum } from '@/types/transaction'

import { TransactionTable } from './TransactionTable'

// Using a generic type for now - proper typing would be done in a real project
type TransactionQueryState = DataTableQueryState<ITransaction>

export default function TransactionList() {
  const { t } = useTranslation()
  // Set up URL query states for pagination, filters, and sorting

  // Set up query states for data table
  const queryStates = useState<TransactionQueryState>({ fieldFilters: {} } as TransactionQueryState)

  // Fetch transactions with filtering and pagination
  const { data: transactionData, isLoading } = useQuery({
    // Using an array of primitive values for the query key
    queryKey: [
      filterTransactions.queryKey,
      {
        page: queryStates[0].page,
        limit: queryStates[0].perPage,
        sortBy: queryStates[0].sort?.[0]?.id,
        order: queryStates[0].sort?.[0]?.desc ? 'DESC' : 'ASC',
        statuses: (queryStates[0].fieldFilters?.status ?? []) as TransactionStatusEnum[],
        types: (queryStates[0].fieldFilters?.type ?? []) as TransactionTypeEnum[],
      },
    ],
    queryFn: filterTransactions.fn,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gray-600 text-lg font-normal">
          {t('transaction.history', 'Transaction History')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Shell className="p-0">
          {isLoading ? (
            <DataTableSkeleton
              columnCount={7}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={['150px', '150px', '120px', '120px', '120px', '150px', '120px']}
            />
          ) : (
            <TransactionTable
              data={(transactionData?.data.items as ITransaction[]) ?? []}
              pageCount={transactionData?.data.totalPages ?? 1}
              queryStates={queryStates}
            />
          )}
        </Shell>
      </CardContent>
    </Card>
  )
}
