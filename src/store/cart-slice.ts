import { StateCreator } from 'zustand'

import { CartItems } from '@/types'
import { ICartItem } from '@/types/cart'

type CartState = {
  cartItems: CartItems[]
  total: number
}

type CartActions = {
  addProduct: (product: ICartItem) => void
  removeProduct: (productId: string) => void
  removeAllCartItems: () => void
  removeMultipleCartItems: (productIds: string[]) => void
  incQty: (productId: string) => void
  decQty: (productId: string) => void
  getProductById: (productId: string) => CartItems | undefined
  setTotal: (total: number) => void
  reset: () => void
}

export type CartSlice = CartState & CartActions

const initialState: CartState = {
  cartItems: [],
  total: 0,
}

export const createCartSlice: StateCreator<CartSlice, [['zustand/immer', never]]> = (set, get) => ({
  ...initialState,
  incQty: (productId) =>
    set((state) => {
      const foundProduct = state.cartItems.find((product) => product.productClassification.id === productId)
      if (foundProduct) {
        foundProduct.quantity += 1
        state.total += 1 // Increment total
      }
    }),
  decQty: (productId) =>
    set((state) => {
      const foundIndex = state.cartItems.findIndex((product) => product.id === productId)

      if (foundIndex !== -1) {
        const product = state.cartItems[foundIndex]

        if (product.quantity === 1) {
          state.total -= 1 // Decrease total
          state.cartItems.splice(foundIndex, 1) // Remove product
        } else {
          product.quantity -= 1
          state.total -= 1 // Decrease total
        }

        // Reset the cart if the last product was removed
        if (state.cartItems.length === 0) {
          state.total = 0
        }
      }
    }),
  addProduct: (product) =>
    set((state) => {
      const existingItem = state.cartItems.find(
        (item) => item.productClassification.id === product.productClassification.id,
      )
      if (existingItem) {
        existingItem.quantity += 1
        state.total += 1
      } else {
        state.cartItems.push({ ...product, classification: 'hello', quantity: 1 })
        state.total += 1
      }
    }),
  removeProduct: (productId) =>
    set((state) => {
      const productToRemove = state.cartItems.find((product) => product.productClassification.id === productId)

      if (productToRemove) {
        state.total -= productToRemove.quantity // Update total
        state.cartItems = state.cartItems.filter((product) => product.productClassification.id !== productId)

        // Reset the cart if it was the last product
        if (state.cartItems.length === 0) {
          state.total = 0 // Reset total
        }
      }
    }),
  removeAllCartItems: () =>
    set(() => ({
      products: [],
      total: 0,
    })),
  getProductById: (productId) => get().cartItems.find((product) => product.productClassification.id === productId),
  setTotal: (total) =>
    set((state) => {
      state.total = total
    }),
  reset: () => set(() => initialState),
  removeMultipleCartItems: (productIds) =>
    set((state) => {
      state.cartItems = state.cartItems.filter((product) => !productIds.includes(product.productClassification.id))
      state.total = state.cartItems.reduce((acc, product) => acc + product.quantity, 0) // Recalculate total
    }),
})
