import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ChangeEvent, forwardRef, HTMLAttributes, useMemo } from 'react'

import { getAllOrderListApi } from '@/network/apis/order'
import { IOrder } from '@/types/order'
import { minifyStringId } from '@/utils/string'

import { Badge } from '../ui/badge'
import { InputProps } from '../ui/input'
import { TOption } from '../ui/react-select'
import AsyncSelect from '../ui/react-select/AsyncSelect'

type Props = HTMLAttributes<HTMLSelectElement> & InputProps

// Extended order interface to include additional properties
interface ExtendedOrder extends IOrder {
  totalAmount?: number
}

// Function to get appropriate status color
const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    COMPLETED: 'bg-green-500',
    PENDING: 'bg-amber-500',
    CANCELLED: 'bg-red-500',
    PROCESSING: 'bg-blue-500',
    SHIPPING: 'bg-purple-500',
    DEFAULT: 'bg-gray-500',
  }

  return statusMap[status] || statusMap.DEFAULT
}

// Simple money formatter function
const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

const getOrderItemDisplay = (order: IOrder) => {
  // Cast to extended type with proper typing
  const extendedOrder = order as ExtendedOrder

  // Format the date if available
  const formattedDate = extendedOrder?.createdAt ? format(new Date(extendedOrder.createdAt), 'dd MMM yyyy') : 'N/A'

  // Get order status for display
  const status = extendedOrder?.status || 'PENDING'

  // Get total amount from totalPrice field
  const total = typeof extendedOrder.totalPrice === 'number' ? extendedOrder.totalPrice : 0

  // Use children field if available, otherwise try orderDetails
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orderItems = extendedOrder.children || extendedOrder.orderDetails || []

  // Check if there are order items
  const hasOrderItems = Array.isArray(orderItems) && orderItems.length > 0

  return (
    <div className="flex items-center gap-2 py-1 w-full">
      {/* Order Icon with ID */}
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
        </svg>
      </div>

      {/* Order ID */}
      <div className="font-medium text-sm whitespace-nowrap">{minifyStringId(extendedOrder?.id)}</div>

      {/* Status Badge */}
      <Badge className={`${getStatusColor(status)} text-white text-xs px-1.5 py-0.5 h-5`}>{status}</Badge>

      {/* Date - only show on wider displays */}
      <div className="text-xs text-gray-500 hidden sm:block">{formattedDate}</div>

      {/* Spacer to push price to right */}
      <div className="flex-grow"></div>

      {/* Product Thumbnails - simplified */}
      {hasOrderItems && (
        <div className="flex -space-x-1.5 mr-2">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {orderItems.slice(0, 2).map((item: any, index) => {
            // Try to get the product image from different possible structures
            const productImage = item.productImage || (item.product && item.product.images && item.product.images[0])

            return (
              <div
                key={index}
                className="w-5 h-5 rounded-full border border-white bg-gray-200 flex items-center justify-center text-xs overflow-hidden"
              >
                {productImage ? (
                  <img src={productImage} alt="Product" className="w-full h-full object-cover" />
                ) : (
                  <span>P</span>
                )}
              </div>
            )
          })}
          {orderItems.length > 2 && (
            <div className="w-5 h-5 rounded-full border border-white bg-gray-100 flex items-center justify-center text-xs">
              +{orderItems.length - 2}
            </div>
          )}
        </div>
      )}

      {/* Price */}
      <div className="text-xs font-semibold whitespace-nowrap">{formatMoney(total)}</div>
    </div>
  )
}

const SelectOrder = forwardRef<HTMLSelectElement, Props>((props) => {
  const { placeholder = 'Select an order', className, onChange, value, multiple = false } = props

  const { data: orderList, isFetching: isGettingOrderList } = useQuery({
    queryKey: [getAllOrderListApi.queryKey],
    queryFn: getAllOrderListApi.fn,
  })

  console.log(orderList?.data)

  const orderOptions = useMemo(() => {
    if (!orderList) return []
    return orderList?.data
      .filter(() => true)
      .map((order) => ({
        value: order.id,
        label: minifyStringId(order.id),
        display: getOrderItemDisplay(order),
      }))
  }, [orderList])

  const selectedOptions = useMemo(() => {
    if (multiple) {
      if (!value) return []
      const options = value as string[]
      return options.map((option) => {
        const order = orderList?.data.find((order) => order.id === option)
        return {
          value: order?.id,
          label: minifyStringId(order?.id ?? ''),
          display: getOrderItemDisplay(order as IOrder),
        }
      })
    } else {
      if (!value) return null
      const order = orderList?.data.find((order) => order.id === value)
      return {
        value: order?.id,
        label: minifyStringId(order?.id ?? ''),
        display: getOrderItemDisplay(order as IOrder),
      }
    }
  }, [value, orderList?.data, multiple])

  return (
    <AsyncSelect
      defaultOptions={orderOptions}
      isMulti={multiple}
      placeholder={placeholder}
      className={className}
      isLoading={isGettingOrderList}
      isClearable
      value={selectedOptions}
      filterOption={(option, inputValue) => {
        // Check if option's data matches our search criteria
        if (!inputValue) return true

        const searchTerms = inputValue.toLowerCase().trim().split(' ')
        const order = orderList?.data.find((o) => o.id === option.value) as ExtendedOrder
        if (!order) return false

        // Check each search term against the order data
        return searchTerms.every((term) => {
          // Search in order ID
          if (order.id?.toLowerCase().includes(term)) return true

          // Search in status
          if (order.status?.toLowerCase().includes(term)) return true

          // Search in date
          const formattedDate = order.createdAt ? format(new Date(order.createdAt), 'dd MMM yyyy').toLowerCase() : ''
          if (formattedDate.includes(term)) return true

          // Search in total amount
          const totalAmount = String(order.totalPrice || '')
          if (totalAmount.includes(term)) return true

          // Search in product names through children or orderDetails
          const orderItems = order.children || order.orderDetails || []
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          if (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            orderItems.some((item: any) => {
              const productName = item.productName || (item.product && item.product.name) || ''
              return productName.toLowerCase().includes(term)
            })
          )
            return true

          return false
        })
      }}
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

SelectOrder.displayName = 'SelectOrder'

export default SelectOrder
