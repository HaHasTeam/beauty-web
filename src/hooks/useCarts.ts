import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useShallow } from 'zustand/react/shallow'

import {
  createCartItemApi,
  deleteCartItemApi,
  removeAllCartItemApi,
  removeMultipleCartItemApi,
  updateCartItemApi,
} from '@/network/apis/cart'
import { useStore } from '@/store/store'

// Custom Hook
export const useCart = () => {
  const queryClient = useQueryClient()

  // Zustand store methods
  const { addProduct, removeProduct, incQty, decQty, setTotal, reset } = useStore(
    useShallow((state) => ({
      addProduct: state.addProduct,
      removeProduct: state.removeProduct,
      incQty: state.incQty,
      decQty: state.decQty,
      setTotal: state.setTotal,
      reset: state.reset,
    })),
  )

  // Mutations
  const addCartItemsMutation = useMutation({
    mutationKey: [createCartItemApi.mutationKey],
    mutationFn: createCartItemApi.fn,
    onSuccess(data, variables, context) {
      console.log(data, variables, context)
      addProduct(data.data)
    },
  })

  const removeCartItemMutation = useMutation({
    mutationKey: [deleteCartItemApi.mutationKey],
    mutationFn: deleteCartItemApi.fn,
  })

  const incQtyMutation = useMutation({
    mutationKey: [updateCartItemApi.mutationKey],
    mutationFn: updateCartItemApi.fn,
  })

  const decQtyMutation = useMutation({
    mutationKey: [updateCartItemApi.mutationKey],
    mutationFn: updateCartItemApi.fn,
  })

  const resetCartMutation = useMutation({
    mutationKey: [removeAllCartItemApi.mutationKey],
    mutationFn: removeAllCartItemApi.fn,
  })

  const removeMultipleCartItemMutation = useMutation({
    mutationKey: [removeMultipleCartItemApi.mutationKey],
    mutationFn: removeMultipleCartItemApi.fn,
  })
  // Return all mutations for usage
  return {
    addToCart: addCartItemsMutation.mutate,
    removeFromCart: removeCartItemMutation.mutate,
    incQty: incQtyMutation.mutate,
    decQty: decQtyMutation.mutate,
    resetCart: resetCartMutation.mutate,
    removeMultipleCartItems: removeMultipleCartItemMutation.mutate,
    addCartItemsIsLoading: addCartItemsMutation.isPending,
    removeCartItemsIsLoading: removeCartItemMutation.isPending,
    incQtyIsLoading: incQtyMutation.isPending,
    decQtyIsLoading: decQtyMutation.isPending,
    resetCartIsLoading: resetCartMutation.isPending,
    removeMultipleCartItemsIsLoading: removeMultipleCartItemMutation.isPending,
  }
}
