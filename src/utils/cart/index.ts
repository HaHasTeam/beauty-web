import { ICartByBrand, ICartItem } from '@/types/cart'

export const createCheckoutItem = (cartItems: ICartItem[], selectedCartItems: string[]) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  if (selectedCartItems?.length > 0) {
    const filteredItems = cartItems?.filter((cart) => selectedCartItems?.includes(cart?.id))
    if (filteredItems?.length > 0) {
      return filteredItems.map((item) => ({
        classificationId: item?.productClassification?.id || '',
        quantity: item?.quantity || 0,
      }))
    }
  }
  return cartItems?.map((item) => ({
    classificationId: item?.productClassification?.id || '',
    quantity: item?.quantity || 0,
  }))
}

export const createCheckoutItems = (cartData: ICartByBrand, selectedCartItems: string[]) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Object.entries(cartData).map(([_brandName, cartItems]) => ({
    brandId:
      cartItems[0]?.productClassification?.productDiscount?.product?.brand?.id ??
      cartItems[0]?.productClassification?.preOrderProduct?.product?.brand?.id ??
      cartItems[0]?.productClassification?.product?.brand?.id ??
      '',
    brandItems: createCheckoutItem(cartItems, selectedCartItems),
  }))
}
