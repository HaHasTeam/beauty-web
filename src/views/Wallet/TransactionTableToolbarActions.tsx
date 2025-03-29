import { type Table } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Download, Printer } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { exportTableToCSV } from '@/lib/export'
import { ITransaction } from '@/types/transaction'

interface TransactionTableToolbarActionsProps {
  table: Table<ITransaction>
}

export function TransactionTableToolbarActions({ table }: TransactionTableToolbarActionsProps) {
  // Apply date range filter when it changes

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'Transactions_' + format(new Date(), 'yyyy-MM-dd'),
            excludeColumns: ['actions'],
          })
        }
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Export
      </Button>

      <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
        <Printer className="h-4 w-4" />
        Print
      </Button>
    </div>
  )
}
