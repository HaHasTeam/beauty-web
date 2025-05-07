import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { BoxIcon, LockIcon, TagIcon, User2Icon, Users2Icon, UsersIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import Button from '@/components/button'
import Copyable from '@/components/copyable'
import { FlexDatePicker } from '@/components/flexible-date-picker/FlexDatePicker'
import FormLabel from '@/components/form-label'
import ImageWithFallback from '@/components/ImageFallback'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
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
  const { t } = useTranslation('common')
  const handleServerError = useHandleServerError()
  const navigate = useNavigate()

  // Format the tiers with discount values
  const tiers = groupProduct.criterias.map((criteria) => {
    // Fix percentage display by multiplying by 100
    const discountValue =
      criteria.voucher.discountType === DiscountTypeEnum.PERCENTAGE
        ? criteria.voucher.discountValue * 100 // Convert from decimal (0.1) to percentage (10)
        : criteria.voucher.discountValue

    const discountDisplay =
      criteria.voucher.discountType === DiscountTypeEnum.PERCENTAGE
        ? formatNumber(discountValue, '%') // Now we're formatting the already multiplied value
        : formatCurrency(discountValue)

    return {
      id: criteria.id,
      count: criteria.threshold,
      discount: discountDisplay,
    }
  })

  const products = groupProduct.products

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

  // Get the maximum discount tier for display
  const maxDiscount = tiers.length > 0 ? tiers[tiers.length - 1].discount : '0%'

  return (
    <Dialog>
      <DialogTrigger className="text-start w-full">
        <Card className="h-full border border-rose-100 shadow-md hover:shadow-xl hover:border-rose-200 transition-all duration-300 rounded-xl overflow-hidden">
          <CardContent className="p-0 relative cursor-pointer overflow-hidden h-full flex flex-col">
            {/* Discount badge in top left corner */}
            <div className="absolute top-3 left-3 z-10">
              <Badge
                className="bg-gradient-to-r from-rose-500 to-red-500 text-white px-2.5 py-1 text-xs font-medium rounded-md shadow-sm"
                variant="outline"
              >
                {t('layout:groupBuy.getUpToDiscount', { discount: maxDiscount })}
              </Badge>
            </div>

            {/* Brand badge in top right corner */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg border border-primary/10">
              <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden shadow-sm">
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      const parent = e.currentTarget.parentElement
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-pink-500 to-primary flex items-center justify-center text-white text-[8px] font-bold">${brand.name.substring(0, 1).toUpperCase()}</div>`
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-500 to-primary flex items-center justify-center text-white text-[8px] font-bold">
                    {brand.name.substring(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-xs font-medium truncate max-w-[80px]">{brand.name}</span>
            </div>

            {/* Masonry image layout - reduced height from 400px to 350px */}
            <div className="relative h-[320px] overflow-hidden">
              {products.length > 0 ? (
                <div className="grid grid-cols-4 grid-rows-4 h-full gap-0.5 p-0.5">
                  {/* Layout với nhiều sản phẩm */}
                  {products.length >= 4 ? (
                    <>
                      {/* Sản phẩm 1: chiếm 2/3 trên cùng */}
                      <div className="col-span-3 row-span-3">
                        <ImageWithFallback
                          src={products[0]?.images[0]?.fileUrl}
                          fallback={fallBackImage}
                          alt={products[0]?.name}
                          className="object-cover w-full h-full rounded-tl-xl"
                        />
                      </div>

                      {/* Sản phẩm 2: chiếm 1/3 góc phải trên */}
                      <div className="col-span-1 row-span-2">
                        <ImageWithFallback
                          src={products[1]?.images[0]?.fileUrl}
                          fallback={fallBackImage}
                          alt={products[1]?.name}
                          className="object-cover w-full h-full rounded-tr-xl"
                        />
                      </div>

                      {/* Sản phẩm 3: chiếm 1/3 góc phải giữa */}
                      <div className="col-span-1 row-span-1">
                        <ImageWithFallback
                          src={products[2]?.images[0]?.fileUrl}
                          fallback={fallBackImage}
                          alt={products[2]?.name}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* Sản phẩm 4: chiếm 1/3 góc trái dưới */}
                      <div className="col-span-1 row-span-1">
                        <ImageWithFallback
                          src={products[3]?.images[0]?.fileUrl}
                          fallback={fallBackImage}
                          alt={products[3]?.name}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* Sản phẩm 5 hoặc nhiều hơn: chiếm 2/3 góc phải dưới */}
                      <div className="col-span-3 row-span-1 relative">
                        {products.length > 4 ? (
                          <>
                            <ImageWithFallback
                              src={products[4]?.images[0]?.fileUrl}
                              fallback={fallBackImage}
                              alt={products[4]?.name}
                              className="object-cover w-full h-full"
                            />
                            {/* Nếu có hơn 5 sản phẩm, hiển thị overlay */}
                            {products.length > 5 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium">
                                +{products.length - 5} {t('groupBuy.moreProducts')}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                            <BoxIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </>
                  ) : products.length === 3 ? (
                    <>
                      {/* Layout với 3 sản phẩm */}
                      <div className="col-span-4 row-span-2">
                        <ImageWithFallback
                          src={products[0]?.images[0]?.fileUrl}
                          fallback={fallBackImage}
                          alt={products[0]?.name}
                          className="object-cover w-full h-full rounded-t-xl"
                        />
                      </div>
                      <div className="col-span-2 row-span-2">
                        <ImageWithFallback
                          src={products[1]?.images[0]?.fileUrl}
                          fallback={fallBackImage}
                          alt={products[1]?.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="col-span-2 row-span-2">
                        <ImageWithFallback
                          src={products[2]?.images[0]?.fileUrl}
                          fallback={fallBackImage}
                          alt={products[2]?.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </>
                  ) : products.length === 2 ? (
                    <>
                      {/* Layout với 2 sản phẩm */}
                      <div className="col-span-4 row-span-2">
                        <ImageWithFallback
                          src={products[0]?.images[0]?.fileUrl}
                          fallback={fallBackImage}
                          alt={products[0]?.name}
                          className="object-cover w-full h-full rounded-t-xl"
                        />
                      </div>
                      <div className="col-span-4 row-span-2">
                        <ImageWithFallback
                          src={products[1]?.images[0]?.fileUrl}
                          fallback={fallBackImage}
                          alt={products[1]?.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </>
                  ) : (
                    // Chỉ 1 sản phẩm
                    <div className="col-span-4 row-span-4">
                      <ImageWithFallback
                        src={products[0]?.images[0]?.fileUrl}
                        fallback={fallBackImage}
                        alt={products[0]?.name}
                        className="object-cover w-full h-full rounded-t-xl"
                      />
                    </div>
                  )}
                </div>
              ) : (
                // Không có sản phẩm
                <div className="w-full h-full flex items-center justify-center">
                  <BoxIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Card content with info similar to ProductCard but with group buying info */}
            <div className="w-full p-3">
              <div>
                <div className="line-clamp-2 text-sm font-semibold mb-1">{groupProduct.name}</div>

                {/* Description */}
                <div className="mt-1 text-xs text-gray-700 line-clamp-2 h-[32px]">{groupProduct.description}</div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-2"></div>

                {/* Tiers display */}
                <div className="mb-2">
                  <div className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                    <TagIcon className="w-3.5 h-3.5 text-primary" />
                    {t('groupBuy.tierTitle')}
                  </div>
                  <div className="flex items-center flex-wrap gap-2 py-1">
                    {tiers.map((tier, index) => (
                      <TooltipProvider key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className={`
                                ${
                                  index === 0
                                    ? 'bg-gradient-to-r from-rose-400 to-pink-400 border-rose-400 text-white'
                                    : index === 1
                                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 border-rose-500 text-white'
                                      : 'bg-gradient-to-r from-rose-600 to-pink-600 border-rose-600 text-white'
                                }
                                px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap cursor-help
                                shadow hover:shadow-md transition-all
                              `}
                            >
                              <div className="flex items-center gap-2">
                                {index === 0 ? (
                                  <User2Icon className="w-4 h-4" />
                                ) : index === 1 ? (
                                  <UsersIcon className="w-4 h-4" />
                                ) : (
                                  <Users2Icon className="w-4 h-4" />
                                )}
                                <div className="flex items-center gap-1">
                                  <span className="font-bold">{tier.discount}</span>
                                  <span className="font-bold">{tier.count}+</span>
                                </div>
                              </div>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              {t('groupBuy.discountAppliedWith', {
                                discount: tier.discount,
                                count: tier.count,
                              })}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>

                {/* Group info */}
                <div className="flex flex-col gap-1.5 mt-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <User2Icon className="w-3.5 h-3.5 text-rose-400" />
                    <span className="line-clamp-1">
                      {t('groupBuy.minPeople', {
                        count: tiers.length > 0 ? tiers[0].count : 1,
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <LockIcon className="w-3.5 h-3.5 text-rose-500" />
                    <span className="line-clamp-1">
                      {t('groupBuy.maxLimit', {
                        count: groupProduct.maxBuyAmountEachPerson || 1,
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <BoxIcon className="w-3.5 h-3.5 text-rose-600" />
                    <span className="line-clamp-1">
                      {t('groupBuy.productsCount', {
                        count: products.length,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center w-full mt-3 pt-2 border-t border-gray-100">
                <div className="flex gap-1 items-center">
                  <span className="text-red-500 text-xs font-medium">
                    {tiers.length > 0 ? tiers[0].discount : '0%'} {t('groupBuy.maxDiscount')}
                  </span>
                </div>
                <Button size="sm" variant="outline" className="px-2.5 py-1 h-auto text-xs border-primary text-primary">
                  {t('groupBuy.createBtn')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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
  )
}
