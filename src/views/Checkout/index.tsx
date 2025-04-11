import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pen, Ticket } from 'lucide-react'
import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import AddressSection from '@/components/address/AddressSection'
import CheckoutHeader from '@/components/checkout/CheckoutHeader'
import CheckoutItem from '@/components/checkout/CheckoutItem'
import CheckoutTotal from '@/components/checkout/CheckoutTotal'
import { OrderItemCreation } from '@/components/checkout/OrderItemsCreation'
import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { QRCodeAlertDialog } from '@/components/payment'
import PaymentSelection from '@/components/payment/PaymentSelection'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import VoucherDialog from '@/components/voucher/VoucherDialog'
import configs from '@/config'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getMyAddressesApi } from '@/network/apis/address'
import { getMyCartApi } from '@/network/apis/cart'
import { updateOrderGroupBuyingApi } from '@/network/apis/group-buying'
import { createGroupOderApi, createOderApi } from '@/network/apis/order'
import { PAY_TYPE } from '@/network/apis/transaction/type'
import { getUserProfileApi } from '@/network/apis/user'
import { getBestPlatformVouchersApi, getBestShopVouchersApi } from '@/network/apis/voucher'
import { getCreateOrderSchema } from '@/schemas/order.schema'
import useCartStore from '@/store/cart'
import { IAddress } from '@/types/address'
import { DiscountTypeEnum, PaymentMethod, ProjectInformationEnum, ResultEnum } from '@/types/enum'
import { ICreateGroupOrder, ICreateOrder, IOrder, IUpdateGroupOrder } from '@/types/order'
import { IBrandBestVoucher, ICheckoutItem, IPlatformBestVoucher, TVoucher } from '@/types/voucher'
import { createCheckoutItem, createCheckoutItems } from '@/utils/cart'
import {
  calculateCartTotals,
  calculatePlatformVoucherDiscount,
  calculateTotalBrandVoucherDiscount,
  calculateTotalCheckoutBrandVoucherDiscount,
} from '@/utils/price'
import { minifyStringId } from '@/utils/string'

import { flattenObject, hasPreOrderProduct } from '../../utils/product/index'

const Checkout = () => {
  const { t } = useTranslation()
  const formId = useId()
  const {
    selectedCartItem,
    chosenPlatformVoucher,
    setChosenPlatformVoucher,
    setChosenBrandVouchers,
    chosenBrandVouchers,
    resetCart,
    groupBuyingOrder,
    groupBuying,
  } = useCartStore()
  const isInGroupBuying = !!groupBuying
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [myAddresses, setMyAddresses] = useState<IAddress[]>([])
  const [bestBrandVouchers, setBestBrandVouchers] = useState<IBrandBestVoucher[]>([])
  const [bestPlatformVoucher, setBestPlatformVoucher] = useState<IPlatformBestVoucher | null>(null)
  const queryClient = useQueryClient()
  const CreateOrderSchema = getCreateOrderSchema()

  const selectedCartItems = useMemo(() => {
    return selectedCartItem
      ? Object.values(selectedCartItem).flatMap((cartBrandItems) => cartBrandItems.map((item) => item.id))
      : []
  }, [selectedCartItem])
  const voucherMap = bestBrandVouchers.reduce<{ [key: string]: IBrandBestVoucher }>((acc, voucher) => {
    acc[voucher.brandId] = voucher
    return acc
  }, {})

  const { totalProductCost, totalProductDiscount, totalLivestreamDiscount, totalPrice } = useMemo(() => {
    return calculateCartTotals(selectedCartItems, selectedCartItem)
  }, [selectedCartItem, selectedCartItems])

  // Calculate total voucher discount
  // const totalBrandDiscount = useMemo(() => {
  //   return calculateTotalBrandVoucherDiscount(selectedCartItem, selectedCartItems, chosenBrandVouchers)
  // }, [chosenBrandVouchers, selectedCartItems, selectedCartItem])
  const totalBrandBEDiscount = useMemo(() => {
    return calculateTotalCheckoutBrandVoucherDiscount(chosenBrandVouchers)
  }, [chosenBrandVouchers])
  const totalBrandDiscount = useMemo(() => {
    return calculateTotalBrandVoucherDiscount(selectedCartItem, selectedCartItems, chosenBrandVouchers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCartItem, chosenBrandVouchers, selectedCartItems])
  const platformVoucherDiscount = useMemo(() => {
    return calculatePlatformVoucherDiscount(
      selectedCartItem,
      selectedCartItems,
      chosenPlatformVoucher,
      chosenBrandVouchers,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCartItem, selectedCartItems, chosenPlatformVoucher, totalBrandDiscount, chosenBrandVouchers])
  console.log(totalBrandBEDiscount)
  console.log(platformVoucherDiscount)
  // Calculate platform voucher discount
  // const totalPlatformDiscount = useMemo(() => {
  //   return calculatePlatformVoucherDiscount(chosenPlatformVoucher)
  // }, [chosenPlatformVoucher])

  // Total saved price (product discounts + brand vouchers + platform voucher)
  const totalSavings =
    totalProductDiscount + totalBrandDiscount + (platformVoucherDiscount ?? 0) + totalLivestreamDiscount
  const totalPayment = totalPrice - totalBrandDiscount - (platformVoucherDiscount ?? 0)

  const defaultOrderValues = {
    orders: [],
    addressId: '',
    paymentMethod: isInGroupBuying ? PaymentMethod.WALLET : PaymentMethod.CASH,
    platformVoucherId: '', // Optional field, default to an empty string
  }

  const form = useForm<z.infer<typeof CreateOrderSchema>>({
    resolver: zodResolver(CreateOrderSchema),
    defaultValues: defaultOrderValues,
  })

  const { data: useProfileData, isFetching: isGettingProfile } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn,
  })

  const { data: useMyAddressesData, isFetching: isGettingAddress } = useQuery({
    queryKey: [getMyAddressesApi.queryKey],
    queryFn: getMyAddressesApi.fn,
  })
  // const { data: useMyCartData, isFetching: isGettingCart } = useQuery({
  //   queryKey: [getMyCartApi.queryKey],
  //   queryFn: getMyCartApi.fn,
  // })
  const { mutateAsync: callBestBrandVouchersFn } = useMutation({
    mutationKey: [getBestShopVouchersApi.mutationKey],
    mutationFn: getBestShopVouchersApi.fn,
    onSuccess: (data) => {
      console.log(data)
      setBestBrandVouchers(data?.data)
    },
  })
  const { mutateAsync: callBestPlatformVouchersFn } = useMutation({
    mutationKey: [getBestPlatformVouchersApi.mutationKey],
    mutationFn: getBestPlatformVouchersApi.fn,
    onSuccess: (data) => {
      setBestPlatformVoucher(data?.data)
    },
  })

  const [isOpenQRCodePayment, setIsOpenQRCodePayment] = useState(false)
  const [paymentId, setPaymentId] = useState<string | undefined>(undefined)
  const [orderData, setOrderData] = useState<IOrder | undefined>(undefined)
  const handleReset = useCallback(() => {
    form.reset()
  }, [form])
  const onPaymentSuccess = useCallback(() => {
    successToast({
      message: t('order.success'),
    })

    resetCart()
    handleReset()
    console.log('payment success')
    console.log(orderData, 'orderData')

    navigate(configs.routes.checkoutResult, { state: { orderData, status: ResultEnum.SUCCESS } })
  }, [navigate, orderData, resetCart, handleReset, t, successToast])

  console.log(orderData, 'orderData')

  const { mutateAsync: createOrderFn } = useMutation({
    mutationKey: [createOderApi.mutationKey],
    mutationFn: createOderApi.fn,
    onSuccess: (orderData) => {
      if (orderData.data.paymentMethod === PaymentMethod.BANK_TRANSFER) {
        setIsOpenQRCodePayment(true)
        setPaymentId(orderData.data.id)
        setOrderData(orderData.data as IOrder)
        return
      }
      successToast({
        message: t('order.success'),
      })
      resetCart()

      handleReset()
      navigate(configs.routes.checkoutResult, { state: { orderData, status: ResultEnum.SUCCESS } })
    },
  })

  const { mutateAsync: createGroupOrderFn } = useMutation({
    mutationKey: [createGroupOderApi.mutationKey],
    mutationFn: createGroupOderApi.fn,
    onSuccess: (orderData) => {
      successToast({
        message: t('order.success'),
      })
      queryClient.invalidateQueries({
        queryKey: [getMyCartApi.queryKey],
      })

      handleReset()
      navigate(configs.routes.checkoutResult, { state: { orderData, status: ResultEnum.SUCCESS } })
    },
  })

  const { mutateAsync: updateGroupOrder } = useMutation({
    mutationKey: [updateOrderGroupBuyingApi.mutationKey],
    mutationFn: updateOrderGroupBuyingApi.fn,
    onSuccess: (orderData) => {
      successToast({
        message: t('order.success'),
      })
      queryClient.invalidateQueries({
        queryKey: [getMyCartApi.queryKey],
      })

      handleReset()
      navigate(configs.routes.checkoutResult, { state: { orderData, status: ResultEnum.SUCCESS } })
    },
  })
  async function onSubmit(values: z.infer<typeof CreateOrderSchema>) {
    try {
      setIsLoading(true)
      const orders = OrderItemCreation({ values, selectedCartItem, chosenBrandVouchers })
      if (groupBuying) {
        if (groupBuyingOrder) {
          const formData: IUpdateGroupOrder = {
            orderId: groupBuyingOrder.id,
            addressId: values.addressId,
            items: orders[0].items,
          }
          await updateGroupOrder(formData)
          return
        }
        if (!groupBuying.id) {
          throw new Error('Group buying ID is missing')
        }
        const formData: ICreateGroupOrder = {
          addressId: values.addressId,
          groupBuyingId: groupBuying.id,
          items: orders[0].items,
        }
        await createGroupOrderFn(formData)
      } else {
        const formData: ICreateOrder = {
          ...values,
          orders,
          platformVoucherId: chosenPlatformVoucher?.id ?? '', // Optional
        }

        await createOrderFn(formData)
      }

      setIsLoading(false)
    } catch (error) {
      console.log(error, 'error')
      setIsLoading(false)

      console.log('error', error)

      handleServerError({
        error,
        form,
      })
    }
  }

  const handleVoucherSelection = (brandId: string, voucher: TVoucher | null) => {
    setChosenBrandVouchers({ ...chosenBrandVouchers, [brandId]: voucher })
  }

  useEffect(() => {
    if (useProfileData?.data && useMyAddressesData?.data) {
      setMyAddresses(useMyAddressesData?.data)
    }
  }, [useProfileData, useMyAddressesData])

  useEffect(() => {
    async function handleShowBestBrandVoucher() {
      try {
        if (selectedCartItem) {
          const checkoutItems = createCheckoutItems(selectedCartItem, selectedCartItems)
          await callBestBrandVouchersFn({
            checkoutItems: checkoutItems,
          })
        }
      } catch (error) {
        console.error(error)
      }
    }
    async function handleShowBestPlatformVoucher() {
      try {
        let checkoutItems: ICheckoutItem[] = []
        if (selectedCartItem) {
          checkoutItems = Object.entries(selectedCartItem)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(([_brandName, cartItems]) => createCheckoutItem(cartItems, selectedCartItems))
            .flat()
        }

        await callBestPlatformVouchersFn({
          checkoutItems: checkoutItems,
        })
      } catch (error) {
        console.error(error)
      }
    }

    handleShowBestBrandVoucher()
    handleShowBestPlatformVoucher()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCartItem, selectedCartItems])

  return (
    <>
      <QRCodeAlertDialog
        amount={totalPayment}
        open={isOpenQRCodePayment}
        onOpenChange={setIsOpenQRCodePayment}
        type={PAY_TYPE.ORDER}
        paymentId={paymentId}
        onSuccess={onPaymentSuccess}
      />
      {(isGettingProfile || isGettingAddress) && <LoadingContentLayer />}
      {selectedCartItem && Object.keys(selectedCartItem)?.length > 0 && (
        <div className="relative w-full mx-auto py-5 ">
          <div className="w-full xl:px-28 lg:px-12 sm:px-2 px-1 space-y-3">
            <Form {...form}>
              <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
                className="w-full grid gap-4 mb-8"
                id={`form-${formId}`}
              >
                <h2 className="uppercase font-bold text-xl">
                  {isInGroupBuying ? (
                    groupBuyingOrder ? (
                      <span>
                        {t('cart.editGroupOrder')}{' '}
                        <b className="text-primary">#{minifyStringId(groupBuyingOrder?.id)}</b>
                      </span>
                    ) : (
                      t('cart.confirmGroupOrder')
                    )
                  ) : (
                    t('cart.checkout')
                  )}
                </h2>
                <div className="w-full flex gap-3 lg:flex-row md:flex-col flex-col">
                  <div className="space-y-2 w-full md:w-full lg:w-[calc(65%-6px)] xl:w-[calc(70%-6px)]">
                    <CheckoutHeader />
                    {selectedCartItem &&
                      Object.keys(selectedCartItem).map((brandName, index) => {
                        const brand =
                          selectedCartItem[brandName]?.[0]?.productClassification?.productDiscount?.product?.brand ??
                          selectedCartItem[brandName]?.[0]?.productClassification?.preOrderProduct?.product?.brand ??
                          selectedCartItem[brandName]?.[0]?.productClassification?.product?.brand
                        const brandId = brand?.id ?? ''
                        const bestVoucherForBrand = voucherMap[brandId] || null
                        const chosenVoucherForBrand = chosenBrandVouchers[brandId] || null

                        return (
                          <CheckoutItem
                            isInGroupBuying={isInGroupBuying}
                            key={`${brandName}_${index}`}
                            brand={brand}
                            brandName={brandName}
                            cartBrandItem={selectedCartItem[brandName]}
                            onVoucherSelect={handleVoucherSelection}
                            bestVoucherForBrand={bestVoucherForBrand}
                            chosenBrandVoucher={chosenVoucherForBrand}
                            index={index}
                            form={form}
                          />
                        )
                      })}
                  </div>
                  <div className="w-full md:full lg:w-[calc(35%-6px)] xl:w-[calc(30%-6px)] flex flex-col gap-3">
                    <AddressSection form={form} addresses={myAddresses} />
                    {/* Voucher Section */}
                    {/* {!isInGroupBuying && (
                      <div className="flex items-center gap-4 justify-between p-4 bg-white rounded-md shadow-sm">
                        <div className="flex gap-2 items-center">
                          <Ticket className="text-red-500" />
                          <span className="text-lg font-semibold">
                            {ProjectInformationEnum.name} {t('cart.voucher')}
                          </span>
                        </div>
                        <VoucherDialog
                          triggerComponent={
                            <Button
                              type="button"
                              variant="link"
                              className="text-blue-500 h-auto p-0 hover:no-underline"
                            >
                              {chosenPlatformVoucher ? (
                                chosenPlatformVoucher?.discountType === DiscountTypeEnum.AMOUNT &&
                                chosenPlatformVoucher?.discountValue ? (
                                  <div className="flex gap-2 items-center">
                                    {t('voucher.discountAmount', { amount: chosenPlatformVoucher?.discountValue })}
                                    <Pen />
                                  </div>
                                ) : (
                                  <div className="flex gap-2 items-center">
                                    {t('voucher.discountPercentage', {
                                      percentage: chosenPlatformVoucher?.discountValue * 100,
                                    })}
                                    <Pen />
                                  </div>
                                )
                              ) : (
                                t('cart.selectVoucher')
                              )}
                            </Button>
                          }
                          onConfirmVoucher={setChosenPlatformVoucher}
                          selectedCartItems={selectedCartItems}
                          chosenPlatformVoucher={chosenPlatformVoucher}
                          cartByBrand={selectedCartItem}
                          bestPlatFormVoucher={bestPlatformVoucher}
                        />
                      </div>
                    )} */}
                    {!isInGroupBuying && (
                      <div className="flex items-center gap-4 justify-between p-4 bg-white rounded-md shadow-sm">
                        <div className="flex gap-2 items-center">
                          <Ticket className="text-red-500" />
                          <span className="text-lg font-semibold">
                            {ProjectInformationEnum.name} {t('cart.voucher')}
                          </span>
                        </div>
                        <VoucherDialog
                          triggerComponent={
                            <Button variant="link" className="text-blue-500 h-auto p-0 hover:no-underline">
                              {chosenPlatformVoucher ? (
                                chosenPlatformVoucher?.discountType === DiscountTypeEnum.AMOUNT &&
                                platformVoucherDiscount > 0 ? (
                                  <div className="flex gap-2 items-center">
                                    {t('voucher.discountAmount', { amount: platformVoucherDiscount })}
                                    <Pen />
                                  </div>
                                ) : (
                                  <div className="flex gap-2 items-center">
                                    {t('voucher.discountAmount', { amount: platformVoucherDiscount })}
                                    <Pen />
                                  </div>
                                )
                              ) : bestPlatformVoucher?.bestVoucher ? (
                                bestPlatformVoucher?.bestVoucher?.discountType === DiscountTypeEnum.AMOUNT &&
                                bestPlatformVoucher?.bestVoucher?.discountValue ? (
                                  t('voucher.bestDiscountAmountDisplay', {
                                    amount: bestPlatformVoucher?.bestVoucher?.discountValue,
                                  })
                                ) : (
                                  t('voucher.bestDiscountPercentageDisplay', {
                                    percentage: bestPlatformVoucher?.bestVoucher?.discountValue * 100,
                                  })
                                )
                              ) : (
                                t('cart.selectVoucher')
                              )}
                            </Button>
                          }
                          onConfirmVoucher={setChosenPlatformVoucher}
                          selectedCartItems={selectedCartItems}
                          chosenPlatformVoucher={chosenPlatformVoucher}
                          cartByBrand={selectedCartItem}
                          bestPlatFormVoucher={bestPlatformVoucher}
                        />
                      </div>
                    )}
                    {/* Payment Section */}
                    {!isInGroupBuying && (
                      <div className="w-full">
                        <PaymentSelection
                          form={form}
                          hasPreOrderProduct={hasPreOrderProduct(flattenObject(selectedCartItem))}
                          totalPayment={totalPayment}
                        />
                      </div>
                    )}
                    <div>
                      <CheckoutTotal
                        isLoading={isLoading}
                        totalProductDiscount={totalProductDiscount}
                        totalProductCost={totalProductCost}
                        totalBrandDiscount={totalBrandDiscount}
                        totalPlatformDiscount={platformVoucherDiscount ?? 0}
                        totalLivestreamDiscount={totalLivestreamDiscount}
                        totalSavings={totalSavings}
                        totalPayment={totalPayment}
                        formId={`form-${formId}`}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
      {(!selectedCartItem || Object.keys(selectedCartItem)?.length === 0) && (
        <div className="my-10 w-full h-full flex flex-col justify-center">
          <Empty
            title={t('empty.checkout.title')}
            description={t('empty.checkout.description')}
            link={configs.routes.home}
            linkText={t('empty.checkout.button')}
          />
        </div>
      )}
    </>
  )
}

export default Checkout
