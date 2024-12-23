import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Pen, Ticket } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import AddressSection from '@/components/address/AddressSection'
import CheckoutHeader from '@/components/checkout/CheckoutHeader'
import CheckoutItem from '@/components/checkout/CheckoutItem'
import CheckoutTotal from '@/components/checkout/CheckoutTotal'
import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import PaymentSelection from '@/components/payment/PaymentSelection'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import VoucherDialog from '@/components/voucher/VoucherDialog'
import configs from '@/config'
import { useToast } from '@/hooks/useToast'
import { getMyAddressesApi } from '@/network/apis/address'
import { getMyCartApi } from '@/network/apis/cart'
import { createOderApi } from '@/network/apis/order'
import { getUserProfileApi } from '@/network/apis/user'
import CreateOrderSchema from '@/schemas/order.schema'
import { IAddress } from '@/types/address'
import { ICartByBrand } from '@/types/cart'
import { PaymentMethod, ProjectInformationEnum } from '@/types/enum'

const Checkout = () => {
  const { t } = useTranslation()
  const formId = useId()
  const { successToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [chosenVoucher, setChosenVoucher] = useState('')
  const [myAddresses, setMyAddresses] = useState<IAddress[]>([])
  const [cartByBrand, setCartByBrand] = useState<ICartByBrand | undefined>(undefined)
  const defaultOrderValues = {
    orders: [
      {
        shopVoucherId: '', // Optional field
        items: [
          {
            productClassificationId: '',
            quantity: 0,
          },
        ],
      },
    ],
    addressId: '',
    paymentMethod: PaymentMethod?.CASH,
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
  const { data: useMyCartData, isFetching: isGettingCart } = useQuery({
    queryKey: [getMyCartApi.queryKey],
    queryFn: getMyCartApi.fn,
  })
  const handleReset = () => {
    form.reset()
  }
  const { mutateAsync: createOrderFn } = useMutation({
    mutationKey: [createOderApi.mutationKey],
    mutationFn: createOderApi.fn,
    onSuccess: () => {
      successToast({
        message: t('order.success'),
      })
      handleReset()
    },
  })

  async function onSubmit(values: z.infer<typeof CreateOrderSchema>) {
    try {
      setIsLoading(true)
      console.log(values, useMyAddressesData, createOrderFn)
      // await createProductFn(values)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
      // handleServerError({
      //   error,
      //   form,
      // })
    }
  }

  useEffect(() => {
    console.log(useProfileData?.data)
    if (useProfileData?.data && useMyAddressesData?.data) {
      setMyAddresses(useMyAddressesData?.data)
    }
  }, [useProfileData, useMyAddressesData])
  console.log(useMyAddressesData?.data)
  useEffect(() => {
    if (useMyCartData && useMyCartData?.data) {
      setCartByBrand(useMyCartData?.data)
    }
  }, [useMyCartData])

  return isGettingProfile || isGettingCart || isGettingAddress ? (
    <LoadingContentLayer />
  ) : cartByBrand && Object.keys(cartByBrand)?.length > 0 ? (
    <div className="relative w-full mx-auto py-5 ">
      <div className="w-full xl:px-28 lg:px-12 sm:px-2 px-1 space-y-3">
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(form.getValues(), e))}
            className="w-full grid gap-4 mb-8"
            id={`form-${formId}`}
          >
            <h2 className="uppercase font-bold text-xl">{t('cart.checkout')}</h2>
            <div className="w-full flex gap-3 lg:flex-row md:flex-col flex-col">
              <div className="w-full md:w-full lg:w-[calc(65%-6px)] xl:w-[calc(70%-6px)]">
                <CheckoutHeader />
                {cartByBrand &&
                  Object.keys(cartByBrand).map((brandName, index) => (
                    <CheckoutItem
                      key={`${brandName}_${index}`}
                      brandName={brandName}
                      cartBrandItem={cartByBrand[brandName]}
                      totalPrice={1598483}
                      numberOfProducts={20}
                    />
                  ))}
              </div>
              <div className="w-full md:full lg:w-[calc(35%-6px)] xl:w-[calc(30%-6px)] flex flex-col gap-3">
                <AddressSection form={form} addresses={myAddresses} />
                {/* Voucher Section */}
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
                        {chosenVoucher ? (
                          <div className="flex gap-2 items-center">
                            <span>{chosenVoucher}</span>
                            <Pen />
                          </div>
                        ) : (
                          t('cart.selectVoucher')
                        )}
                      </Button>
                    }
                    onConfirmVoucher={setChosenVoucher}
                  />
                </div>
                {/* Payment Section */}
                <div className="w-full">
                  <PaymentSelection form={form} />
                </div>
                <div>
                  <CheckoutTotal
                    totalCost={158998483}
                    totalDiscount={1234567}
                    totalPayment={11111}
                    savings={38478}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  ) : (
    <Empty
      title={t('empty.checkout.title')}
      description={t('empty.checkout.description')}
      link={configs.routes.home}
      linkText={t('empty.checkout.button')}
    />
  )
}

export default Checkout
