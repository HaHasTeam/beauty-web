import { ICartByBrand } from '@/types/cart'

export const createCheckoutItems = (cartData: ICartByBrand, selectedCartItems: string[]) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Object.entries(cartData).map(([_brandName, cartItems]) => ({
    brandId:
      cartItems[0]?.productClassification?.productDiscount?.product?.brand?.id ??
      cartItems[0]?.productClassification?.preOrderProduct?.product?.brand?.id ??
      cartItems[0]?.productClassification?.product?.brand?.id ??
      '',
    brandItems:
      selectedCartItems?.length > 0
        ? cartItems?.filter((cart) => selectedCartItems?.includes(cart?.id))?.length > 0
          ? cartItems
              ?.filter((cart) => selectedCartItems?.includes(cart?.id))
              ?.map((item) => ({
                classificationId: item?.productClassification?.id || '',
                quantity: item?.quantity || 0,
              }))
          : cartItems?.map((item) => ({
              classificationId: item?.productClassification?.id || '',
              quantity: item?.quantity || 0,
            }))
        : cartItems?.map((item) => ({
            classificationId: item?.productClassification?.id || '',
            quantity: item?.quantity || 0,
          })),
  }))
}
