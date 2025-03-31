'use client'

import * as React from 'react'

import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'
import { ITransaction, TransactionStatusEnum, TransactionTypeEnum } from '@/types/transaction'
import { getDisplayString } from '@/utils/string'

import { getColumns } from './TransactionTableColumns'
import { TransactionTableToolbarActions } from './TransactionTableToolbarActions'

interface TransactionTableProps {
  data: ITransaction[]
  pageCount: number
  queryStates?: [
    DataTableQueryState<ITransaction>,
    React.Dispatch<React.SetStateAction<DataTableQueryState<ITransaction>>>,
  ]
}

export function TransactionTable({ data, pageCount, queryStates }: TransactionTableProps) {
  const columns = React.useMemo(() => getColumns(), [])

  // Define filter fields for the toolbar
  const filterFields: DataTableFilterField<ITransaction>[] = [
    {
      id: 'type',
      label: 'Type',
      options: Object.values(TransactionTypeEnum).map((type) => ({
        label: getDisplayString(type).toUpperCase(),
        value: type,
      })),
    },
    {
      id: 'status',
      label: 'Status',
      options: Object.values(TransactionStatusEnum).map((status) => ({ label: status, value: status })),
    },
  ]

  const { table } = useDataTable({
    queryStates,
    data,
    columns,
    pageCount,
    filterFields,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnVisibility: {
        buyer: false, // Hide buyer column by default
      },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <TransactionTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}
