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
import { ICreateCartItem } from '@/types/cart'

// Custom Hook
export const useCart = () => {
  const queryClient = useQueryClient()

  // Zustand store methods
  const { addProduct, removeProduct, incQty, decQty, setTotal, reset, authData, isAuthenticated } = useStore(
    useShallow((state) => ({
      addProduct: state.addProduct,
      removeProduct: state.removeProduct,
      incQty: state.incQty,
      decQty: state.decQty,
      setTotal: state.setTotal,
      reset: state.reset,
      authData: state.authData,
      isAuthenticated: state.isAuthenticated,
    })),
  )

  // Mutations
  const addCartItemsMutation = useMutation({
    mutationKey: [createCartItemApi.mutationKey],
    mutationFn: createCartItemApi.fn,
    onSuccess(data) {
      addProduct(data.data)
    },
  })

  const removeCartItemMutation = useMutation({
    mutationKey: [deleteCartItemApi.mutationKey],
    mutationFn: deleteCartItemApi.fn,
    onSuccess(_, variables) {
      removeProduct(variables)
    },
  })

  const incQtyMutation = useMutation({
    mutationKey: [updateCartItemApi.mutationKey],
    mutationFn: updateCartItemApi.fn,
    onSuccess(_, variables) {
      incQty(variables.id)
    },
  })

  const decQtyMutation = useMutation({
    mutationKey: [updateCartItemApi.mutationKey],
    mutationFn: updateCartItemApi.fn,
    onSuccess(_, variables) {
      decQty(variables.id)
    },
  })

  const resetCartMutation = useMutation({
    mutationKey: [removeAllCartItemApi.mutationKey],
    mutationFn: removeAllCartItemApi.fn,
    onSuccess() {
      reset()
    },
  })

  const removeMultipleCartItemMutation = useMutation({
    mutationKey: [removeMultipleCartItemApi.mutationKey],
    mutationFn: removeMultipleCartItemApi.fn,
    onSuccess(_, variables) {
      variables.itemIds.forEach((id) => removeProduct(id))
    },
  })

  // Helper functions
  const addToCart = (product: ICreateCartItem) => {
    if (authData && isAuthenticated) {
      addCartItemsMutation.mutate(product)
    } else {
      addProduct(product)
    }
  }

  const removeFromCart = (id: string) => {
    if (authData && isAuthenticated) {
      removeCartItemMutation.mutate(id)
    } else {
      removeProduct(id)
    }
  }

  const incrementQty = (cartItem: ICreateCartItem) => {
    if (authData && isAuthenticated) {
      incQtyMutation.mutate(cartItem)
    } else {
      incQty(cartItem.id)
    }
  }

  const decrementQty = (cartItem: ICreateCartItem) => {
    if (authData && isAuthenticated) {
      decQtyMutation.mutate(cartItem)
    } else {
      decQty(cartItem.id)
    }
  }

  const resetCart = () => {
    if (authData && isAuthenticated) {
      resetCartMutation.mutate()
    } else {
      reset()
    }
  }

  const removeMultipleCartItems = (ids) => {
    if (authData && isAuthenticated) {
      removeMultipleCartItemMutation.mutate({ ids })
    } else {
      ids.forEach((id) => removeProduct(id))
    }
  }

  return {
    addToCart,
    removeFromCart,
    incQty: incrementQty,
    decQty: decrementQty,
    resetCart,
    removeMultipleCartItems,
    addCartItemsIsLoading: addCartItemsMutation.isPending,
    removeCartItemsIsLoading: removeCartItemMutation.isPending,
    incQtyIsLoading: incQtyMutation.isPending,
    decQtyIsLoading: decQtyMutation.isPending,
    resetCartIsLoading: resetCartMutation.isPending,
    removeMultipleCartItemsIsLoading: removeMultipleCartItemMutation.isPending,
  }
}
