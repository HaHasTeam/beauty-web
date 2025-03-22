import { useQuery } from '@tanstack/react-query'
import { ChangeEvent, forwardRef, HTMLAttributes, useMemo } from 'react'

import { getFilteredTransactions } from '@/network/apis/transaction'
import { ITransaction } from '@/types/transaction'

import { InputProps } from '../ui/input'
import { TOption } from '../ui/react-select'
import AsyncSelect from '../ui/react-select/AsyncSelect'

type Props = HTMLAttributes<HTMLSelectElement> & InputProps

const getItemDisplay = (transaction: ITransaction) => {
  return (
    <div className='flex items-center gap-1'>
      <span>{transaction.id}</span>
    </div>
  )
}

const SelectTransaction = forwardRef<HTMLSelectElement, Props>((props) => {
  const { placeholder = 'Select a transaction', className, onChange, value, multiple = false } = props

  const { data: transactionList, isFetching: isGettingTransactionList } = useQuery({
    queryKey: [getFilteredTransactions.queryKey],
    queryFn: getFilteredTransactions.fn
  })

  const transactionOptions = useMemo(() => {
    if (!transactionList) return []
    return transactionList?.data.filter(()=>true).map((order) => ({
      value: order.id,
      label: order.id,
      display: getItemDisplay(order)
    }))
  }, [transactionList])

  const selectedOptions = useMemo(() => {
    if (multiple) {
      if (!value) return []
      const options = value as string[]
      return options.map((option) => {
        const transaction = transactionList?.data.find((transaction) => transaction.id === option)
        return {
          value: transaction?.id,
          label: transaction?.id,
          display: getItemDisplay(transaction as ITransaction)
        }
      })
    } else {
      if (!value) return null
      const transaction = transactionList?.data.find((transaction) => transaction.id === value)
      return {
        value: transaction?.id,
        label: transaction?.id,
        display: getItemDisplay(transaction as ITransaction)
      }
    }
  }, [value, transactionList?.data, multiple])

  return (
    <AsyncSelect
      defaultOptions={transactionOptions}
      isMulti={multiple}
      placeholder={placeholder}
      className={className}
      isLoading={isGettingTransactionList}
      isClearable
      value={selectedOptions}
      onChange={(options) => {
        if (multiple) {
          const optionValues = options as TOption[]
          if (onChange) onChange(optionValues.map((option) => option.value) as unknown as ChangeEvent<HTMLInputElement>)
        } else {
          const optionValues = options as TOption
          if (onChange) onChange(optionValues?.value as unknown as ChangeEvent<HTMLInputElement>)
        }
      }}
    />
  )
})

SelectTransaction.displayName = 'SelectTransaction'

export default SelectTransaction
