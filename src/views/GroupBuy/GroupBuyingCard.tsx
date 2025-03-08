import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { BoxIcon, ChevronLeft, ChevronRight, Hand, ImageIcon, TrendingUp, User } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import Button from '@/components/button'
import Copyable from '@/components/copyable'
import { FlexDatePicker } from '@/components/flexible-date-picker/FlexDatePicker'
import FormLabel from '@/components/form-label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from '@/components/ui/timeline'
import routes from '@/config/routes'
import useHandleServerError from '@/hooks/useHandleServerError'
import { createGroupBuyingApi } from '@/network/apis/group-product'
import { IBranch } from '@/types/brand'
import { DiscountTypeEnum } from '@/types/enum'
import { TGroupProduct } from '@/types/group-product'
import { formatCurrency, formatNumber } from '@/utils/number'
import { minifyString } from '@/utils/string'

const FormSchema = z.object({
  groupProductId: z.string(),
  criteriaId: z.string(),
  endTime: z.string().optional(),
})
type GroupBuyingCardProps = {
  brand: IBranch
  groupProduct: TGroupProduct
}

export default function GroupBuyingCard({ brand, groupProduct }: GroupBuyingCardProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { t } = useTranslation()
  const handleServerError = useHandleServerError()
  const navigate = useNavigate()
  const tiers = groupProduct.criterias.map((criteria) => {
    return {
      id: criteria.id,
      count: criteria.threshold,
      discount:
        criteria.voucher.discountType === DiscountTypeEnum.PERCENTAGE
          ? formatNumber(criteria.voucher.discountValue, '%')
          : formatCurrency(criteria.voucher.discountValue),
    }
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      groupProductId: groupProduct.id,
      criteriaId: tiers[0].id,
    },
  })
  const {
    mutateAsync: createGroupBuyingFn,
    isPending: isCreatingGroupBuying,
    data: groupBuyingInfo,
  } = useMutation({
    mutationKey: [createGroupBuyingApi.mutationKey],
    mutationFn: createGroupBuyingApi.fn,
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await createGroupBuyingFn(data)
    } catch (error) {
      handleServerError({
        error,
        form,
      })
    }
  }

  const products = groupProduct.products

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length)
  }

  return (
    <div className="w-full h-full">
      <Card className="bg-white dark:bg-slate-900 shadow-lg h-full">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 rounded-lg overflow-hidden">
                <AvatarImage src={brand?.logo} className="w-full h-full object-cover rounded-md" />
                <AvatarFallback className="w-full h-full object-cover rounded-md">
                  <ImageIcon />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl font-bold">{brand?.name}</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-300">{minifyString(brand?.description ?? '')}</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          {/* Carousel Section */}
          <div className="flex gap-2 max-md:flex-col">
            <div className="max-md:w-full w-7/12 flex flex-col gap-2 items-stretch">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex-1 h-40 overflow-y-scroll w-full">
                <h1 className="text-xl font-semibold mb-1">{groupProduct.name}</h1>
                <p className="text-xs font-light">{groupProduct.description}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex-1 h-40 overflow-y-scroll">
                <span className="font-semibold mb-2">{t('groupBuy.item.notice')}</span>
                <ul className="space-y-2">
                  <li className="flex items-center gap-1 text-sm">
                    <TrendingUp className="w-4 h-4" />{' '}
                    <span className="text-xs font-light">
                      {t('groupBuy.item.maxDiscount', {
                        discount: formatNumber(
                          groupProduct?.criterias
                            ? groupProduct?.criterias[groupProduct?.criterias.length - 1].voucher.discountValue
                            : 0,
                          groupProduct?.criterias[groupProduct?.criterias.length - 1].voucher.discountType ===
                            DiscountTypeEnum.PERCENTAGE
                            ? '%'
                            : 'đ',
                        ),
                      })}
                    </span>
                  </li>
                  <li className="flex items-center gap-1 text-sm">
                    <BoxIcon className="w-4 h-4" />
                    <span className="text-xs font-light">
                      {t('groupBuy.item.productAmount', {
                        amount: formatNumber(groupProduct?.products.length ?? 0),
                      })}
                    </span>
                  </li>
                  <li className="flex items-center gap-1 text-sm">
                    <Hand className="w-4 h-4" />
                    <span className="text-xs font-light">
                      {t('groupBuy.item.limitAmount', {
                        amount: formatNumber(groupProduct?.maxBuyAmountEachPerson ?? 0),
                      })}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="overflow-hidden rounded-lg aspect-video">
                  <div
                    className="flex transition-transform duration-300 ease-in-out h-full "
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {products.map((product) => (
                      <div key={product.id} className="min-w-full h-full relative">
                        <Avatar className="w-full rounded-lg overflow-hidden h-full">
                          <AvatarImage
                            src={product.images.length ? product.images[0].fileUrl : ''}
                            className="w-full h-full object-cover rounded-md"
                          />
                          <AvatarFallback className="w-full h-full object-contain rounded-md">
                            <ImageIcon />
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs w-full truncate">{product.name}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-slate-800/80 p-2 rounded-full shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-slate-800/80 p-2 rounded-full shadow-lg"
                >
                  <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {products.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full ${
                        currentSlide === index ? 'bg-primary text-primary ' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-1 justify-between self-stretch">
              <Timeline className="max-h-96 overflow-auto">
                {tiers.map((tier, index) => (
                  <TimelineItem status={'done'} key={index}>
                    <TimelineHeading>
                      <span className="flex items-center font-bold">
                        {tier.count} <User size={14} strokeWidth={'4'} />- {`${tier.discount}`}
                      </span>
                    </TimelineHeading>
                    <TimelineDot status={'done'} />
                    {index + 1 < tiers.length && <TimelineLine className="max-h-4" />}
                    <TimelineContent className="text-xs">
                      {t('groupBuy.item.tierDescription', {
                        count: tier.count,
                        discount: tier.discount,
                      })}
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
              <Dialog>
                <DialogTrigger>
                  <Button className="w-full">{t('groupBuy.createBtn')}</Button>
                </DialogTrigger>
                <DialogContent className="max-w-screen-md">
                  <DialogHeader>
                    <DialogTitle>
                      {t('groupBuy.item.dialogTitle', {
                        event: groupProduct.name,
                      })}
                    </DialogTitle>
                    <DialogDescription>{t('groupBuy.item.dialogDescription')}</DialogDescription>
                    <div className="pt-2">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                          <FormField
                            control={form.control}
                            name="criteriaId"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel required>{t('groupBuy.item.demandDiscountLabel')}</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid grid-cols-3"
                                  >
                                    {tiers.map((tier, index) => (
                                      <FormItem className="flex items-center space-x-2 space-y-0" key={index}>
                                        <FormControl>
                                          <RadioGroupItem value={tier.id} />
                                        </FormControl>
                                        <FormLabel className="flex items-center font-normal">
                                          {tier.count} <User size={14} strokeWidth={'2'} />- {`${tier.discount}`}
                                        </FormLabel>
                                      </FormItem>
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="col-span-1 sm:col-span-2 gap-4 grid grid-flow-row grid-cols-1">
                            <FormField
                              control={form.control}
                              name="endTime"
                              render={({ field, formState }) => {
                                return (
                                  <FormItem>
                                    <FormLabel required>{t('groupBuy.item.endTimeLabel')}</FormLabel>
                                    <FlexDatePicker
                                      showTime
                                      onlyFutureDates
                                      field={field}
                                      formState={{
                                        ...formState,
                                        ...form,
                                      }}
                                    />
                                    <FormMessage />
                                  </FormItem>
                                )
                              }}
                            />
                          </div>

                          {!groupBuyingInfo?.data.id ? (
                            <Button type="submit" className="w-full" loading={isCreatingGroupBuying}>
                              {t('groupBuy.item.createBtn')}
                            </Button>
                          ) : (
                            <div className="flex items-end gap-2">
                              <Copyable
                                className="flex-1"
                                content={
                                  window.origin +
                                  routes.groupBuyDetail
                                    .replace(':groupId', groupBuyingInfo?.data.id as string)
                                    .replace(':brandId', brand.id as string)
                                }
                                label={t('groupBuy.item.linkInviteLabel')}
                              />
                              <Button
                                type="button"
                                onClick={() => {
                                  navigate(
                                    routes.groupBuyDetail
                                      .replace(':groupId', groupBuyingInfo?.data.id as string)
                                      .replace(':brandId', brand.id as string),
                                  )
                                }}
                              >
                                {t('groupBuy.item.goToGroupBuy')}
                              </Button>
                            </div>
                          )}
                        </form>
                      </Form>
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
