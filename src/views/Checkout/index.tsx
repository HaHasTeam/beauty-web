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
import PaymentSelection from '@/components/payment/PaymentSelection'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import VoucherDialog from '@/components/voucher/VoucherDialog'
import { useToast } from '@/hooks/useToast'
import { getAllAddressesApi } from '@/network/apis/address'
import { createOderApi } from '@/network/apis/order'
import { getUserProfileApi } from '@/network/apis/user'
import CreateOrderSchema from '@/schemas/order.schema'
import { ICart } from '@/types/cart'
import { PaymentMethod, ProjectInformationEnum } from '@/types/enum'

const Checkout = () => {
  const { t } = useTranslation()
  const formId = useId()
  const { successToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [chosenVoucher, setChosenVoucher] = useState('')
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
  const { data: useProfileData } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn,
  })
  const { data: useAllAddressData } = useQuery({
    queryKey: [getAllAddressesApi.queryKey],
    queryFn: getAllAddressesApi.fn,
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
  const carts: ICart[] = [
    {
      id: '1',
      brandName: 'Romand',
      products: [
        {
          id: '1',
          image: 'https://i.pinimg.com/736x/c9/74/71/c97471cc7179e3164dfacba52cf957ea.jpg',
          name: 'Romand Lip Tint',
          classifications: [
            { id: '0', name: 'Rose', image: 'https://example.com/color1.jpg', selected: true },
            { id: '1', name: 'Black', image: 'https://example.com/color1.jpg', selected: false },
            { id: '2', name: 'White', image: 'https://example.com/color1.jpg', selected: false },
            { id: '3', name: 'Green', image: 'https://example.com/color1.jpg', selected: false },
            { id: '4', name: 'Blue', image: 'https://example.com/color1.jpg', selected: false },
          ],
          currentPrice: 10000,
          price: 12000,
          totalPrice: 1233000,
          eventType: 'LiveStream',
          quantity: 1000,
        },
        {
          id: '2',
          image: 'https://i.pinimg.com/736x/c9/74/71/c97471cc7179e3164dfacba52cf957ea.jpg',
          name: 'Romand Lip Gloss',
          classifications: [{ id: '2', name: 'Shine', image: 'https://example.com/shine2.jpg', selected: true }],
          currentPrice: 9500,
          price: 11000,
          eventType: 'LiveStream',
          quantity: 3,
        },
      ],
    },
    {
      id: '2',
      brandName: 'Another Brand',
      products: [
        {
          id: '3',
          image: 'https://i.pinimg.com/736x/c9/74/71/c97471cc7179e3164dfacba52cf957ea.jpg',
          name: 'Another Brand Lipstick',
          classifications: [{ id: '3', name: 'Matte', image: 'https://example.com/matte3.jpg', selected: true }],
          currentPrice: 8000,
          price: 10000,
          eventType: 'PreOrder',
          quantity: 1,
        },
        {
          id: '4',
          image: 'https://i.pinimg.com/736x/c9/74/71/c97471cc7179e3164dfacba52cf957ea.jpg',
          name: 'Another Brand Lip Balm',
          classifications: [
            { id: '4', name: 'Hydrating', image: 'https://example.com/hydrating4.jpg', selected: true },
          ],
          currentPrice: 5000,
          price: 6000,
          eventType: 'GroupBuying',
          quantity: 5,
        },
      ],
    },
  ]
  async function onSubmit(values: z.infer<typeof CreateOrderSchema>) {
    try {
      setIsLoading(true)
      console.log(values, useAllAddressData, createOrderFn)
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
  }, [useProfileData])
  return (
    <div className="relative w-full mx-auto py-5 ">
      <div className="w-full xl:px-12 lg:px-6 sm:px-2 px-1 space-y-3">
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(form.getValues(), e))}
            className="w-full grid gap-4 mb-8"
            id={`form-${formId}`}
          >
            <h2 className="uppercase font-bold text-xl">{t('cart.checkout')}</h2>
            <div className="w-full flex gap-3 lg:flex-row md:flex-col flex-col">
              <div className="w-full md:w-full lg:w-[calc(65%-6px)] xl:w-[calc(70%-6px)] shadow-sm">
                <CheckoutHeader />
                {carts.map((cart) => (
                  <CheckoutItem
                    key={cart.id}
                    brandName={cart.brandName}
                    brandId={cart.id}
                    products={cart.products}
                    totalPrice={1598483}
                    numberOfProducts={20}
                  />
                ))}
              </div>
              <div className="w-full md:full lg:w-[calc(35%-6px)] xl:w-[calc(30%-6px)] flex flex-col gap-3">
                <AddressSection
                  fullName={'Nguyen Van A'}
                  phone={'0987654321'}
                  address={'D1 Long Thanh My, Q9'}
                  isDefault
                />
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
                  <PaymentSelection />
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
  )
}

export default Checkout
