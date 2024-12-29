import { create } from 'zustand'

import { ICartByBrand } from '@/types/cart'
import { TVoucher } from '@/types/voucher'

export interface CartState {
  // Selected cart items
  selectedCartItem: ICartByBrand | null
  setSelectedCartItem: (cart: ICartByBrand | null) => void

  // Vouchers by brand
  chosenBrandVouchers: { [brandId: string]: TVoucher | null }
  setChosenBrandVouchers: (vouchers: { [brandId: string]: TVoucher | null }) => void
  updateBrandVoucher: (brandId: string, voucher: TVoucher | null) => void

  // Platform voucher
  chosenPlatformVoucher: TVoucher | null
  setChosenPlatformVoucher: (voucher: TVoucher | null) => void

  // Reset state
  resetCart: () => void
}

const initialState = {
  selectedCartItem: null,
  chosenBrandVouchers: {},
  chosenPlatformVoucher: null,
}

const useCartStore = create<CartState>((set) => ({
  // Initial state
  ...initialState,

  // Setters
  setSelectedCartItem: (cart) => set({ selectedCartItem: cart }),

  setChosenBrandVouchers: (vouchers) => set({ chosenBrandVouchers: vouchers }),

  updateBrandVoucher: (brandId, voucher) =>
    set((state) => ({
      chosenBrandVouchers: {
        ...state.chosenBrandVouchers,
        [brandId]: voucher,
      },
    })),

  setChosenPlatformVoucher: (voucher) => set({ chosenPlatformVoucher: voucher }),

  // Reset function
  resetCart: () => set(initialState),
}))

export default useCartStore

export const useSelectedCartItem = () => useCartStore((state) => state.selectedCartItem)
export const useChosenVouchersByBrand = () => useCartStore((state) => state.chosenBrandVouchers)
export const usePlatformChosenVoucher = () => useCartStore((state) => state.chosenPlatformVoucher)
