import { ICartByBrand } from '@/types/cart'

export const createCheckoutItems = (cartData: ICartByBrand) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Object.entries(cartData).map(([_brandName, cartItems]) => ({
    brandId: cartItems[0]?.productClassification?.product?.brand?.id || '',
    brandItems: cartItems?.map((item) => ({
      classificationId: item?.productClassification?.id || '',
      quantity: item?.quantity || 0,
    })),
  }))
}
