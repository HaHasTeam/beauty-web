import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { BoxIcon, CircleHelp, Hand, TrendingUp, User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import Button from '@/components/button'
import Copyable from '@/components/copyable'
import { FlexDatePicker } from '@/components/flexible-date-picker/FlexDatePicker'
import FormLabel from '@/components/form-label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from '@/components/ui/timeline'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import routes from '@/config/routes'
import useHandleServerError from '@/hooks/useHandleServerError'
import { createGroupBuyingApi } from '@/network/apis/group-product'
import { IBranch } from '@/types/brand'
import { DiscountTypeEnum } from '@/types/enum'
import { TGroupProduct } from '@/types/group-product'
import { formatCurrency, formatNumber } from '@/utils/number'

const FormSchema = z.object({
  groupProductId: z.string(),
  endTime: z.string().optional(),
})
type GroupBuyingCardProps = {
  brand: IBranch
  groupProduct: TGroupProduct
}

export default function GroupBuyingCard({ brand, groupProduct }: GroupBuyingCardProps) {
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

  return (
    <div className="w-full h-full">
      <div className="bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white  overflow-hidden relative flex items-stretch h-72  border-2 border-primary/50 rounded-[12px] border-l-0">
          {/* Left border colors */}
          <div className="absolute left-0 top-0 h-full w-2 flex flex-col">
            <div className="h-1/4 bg-yellow-400"></div>
            <div className="h-1/4 bg-green-500"></div>
            <div className="h-1/4 bg-red-500"></div>
            <div className="h-1/4 bg-blue-500"></div>
          </div>

          <div className="p-4 pl-6">
            <span className="text-xl font-semibold flex items-center gap-2 mb-4">
              {groupProduct.name}
              <Tooltip>
                <TooltipTrigger>
                  <CircleHelp className="w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent>{groupProduct.description}</TooltipContent>
              </Tooltip>
            </span>

            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg flex-1 h-30 overflow-y-scroll">
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

            <div className="flex items-stretch gap-2 overflow-auto flex-nowrap mt-4">
              {products.slice(0, 6).map((product) => (
                <Tooltip>
                  <TooltipTrigger
                    className="overflow-hidden rounded-md shadow-md cursor-pointer w-fit border p-0.5"
                    key={product.id}
                  >
                    <img
                      src={
                        product.images[0]?.fileUrl ||
                        'https://icons.veryicon.com/png/o/miscellaneous/fu-jia-intranet/product-29.png'
                      }
                      alt={product.name}
                      className="object-cover w-10 aspect-square transition-transform duration-300"
                    />
                  </TooltipTrigger>
                  <TooltipContent>{product.name}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          <div className="w-56 bg-primary/10 shadow-md p-2 border-primary/50  rounded-[10px] backdrop:blur-2xl h-full overflow-auto flex flex-col justify-between ml-auto">
            <div className="flex-1 overflow-auto">
              <Timeline className="flex-1">
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
            </div>
            <Dialog>
              <DialogTrigger>
                <Button className="w-full mt-2">{t('groupBuy.createBtn')}</Button>
              </DialogTrigger>
              <DialogContent className="max-w-screen-sm">
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
      </div>
    </div>
  )
}
