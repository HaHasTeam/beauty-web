import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { BoxIcon, InfoIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import Button from '@/components/button'
import Copyable from '@/components/copyable'
import { FlexDatePicker } from '@/components/flexible-date-picker/FlexDatePicker'
import FormLabel from '@/components/form-label'
import { ImagePreviewThumbnail } from '@/components/image-preview/ImagePreviewThumbnail'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
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
    const discountValue = criteria.voucher.discountType === DiscountTypeEnum.PERCENTAGE
      ? criteria.voucher.discountValue * 100  // Convert from decimal (0.1) to percentage (10)
      : criteria.voucher.discountValue
    
    const discountDisplay = 
      criteria.voucher.discountType === DiscountTypeEnum.PERCENTAGE
        ? formatNumber(discountValue, '%')  // Now we're formatting the already multiplied value
        : formatCurrency(discountValue)
    
    return {
      id: criteria.id,
      count: criteria.threshold,
      discount: discountDisplay
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

  return (
    <div className="w-full border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden bg-white relative">
      {/* Card header with name and max discount */}
   
      {/* Main content area with tiers and products */}
      <div className="flex flex-col">
        {/* Discount tier panel */}
        <div className="p-3">
          <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-purple-100/30 rounded-xl p-4 mb-3 relative">
            {/* Brand badge in top right corner of the discount card */}
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm border border-primary/10">
              <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                {brand.logo ? (
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-pink-500 to-primary flex items-center justify-center text-white text-[8px] font-bold">${brand.name.substring(0, 1).toUpperCase()}</div>`;
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
            
            {/* Discount title */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-xl font-bold text-primary mb-1">
                  {t('groupBuy.discountTitle', { maxDiscount: tiers.length > 0 ? tiers[tiers.length - 1].discount : '0%' })}
                </h3>
                <p className="text-sm text-gray-600 font-medium">{t('groupBuy.inviteMembers')}</p>
              </div>
            </div>

            {/* Enhanced Tier stepper */}
            <div className="relative mt-4">
              {/* Tier indicators as text row */}
              <div className="flex items-center overflow-x-auto no-scrollbar gap-1.5 py-1">
                {tiers.map((tier, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50 border-green-200 text-green-700 px-1.5 py-0.5 text-[9px]">
                   <span className="font-semibold max-w-[60px] truncate" title={tier.discount}>
                      {tier.discount}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <span className="text-[10px] text-gray-500">{t('groupBuy.when')}</span>
                      <div className="flex items-center justify-center min-w-[18px] h-[18px]  rounded-full text-[9px] font-semibold flex-shrink-0">
                        {tier.count}
                      </div>
                      <span className="text-[10px] text-gray-500">{t('groupBuy.people')}</span>
                    </div>
                </Badge>
               
                ))}
              </div>
              
              {/* Mini description */}
              <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                <span>{t('groupBuy.tierTitle')}</span>
                <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700 px-1.5 py-0.5 text-[9px]">
                  {t('groupBuy.tiers', { count: tiers.length })}
                </Badge>
              </div>
            </div>
          </div>
                 <div className=" mb-3">
          <Accordion type="single" collapsible className="w-full rounded-lg border border-gray-100 overflow-hidden">
            <AccordionItem value="details" className="border-0 bg-gray-50/50">
              <AccordionTrigger className="px-3 py-2 text-sm hover:no-underline">
                <div className="flex items-center gap-2 text-gray-700">
                  <InfoIcon className="w-4 h-4 text-primary/70" />
                  <span className="font-medium">{t('groupBuy.details')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 text-sm">
                <div className="space-y-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">{t('groupBuy.programName')}:</h4>
                    <p className="text-gray-600">{groupProduct.name}</p>
                  </div>
                  
                  {groupProduct.description && (
                    <div>
                      <h4 className="font-semibold text-gray-800">{t('groupBuy.description')}:</h4>
                      <p className="text-gray-600 whitespace-pre-line">{groupProduct.description}</p>
                    </div>
                  )}
                  
                  {brand.id && (
                    <div>
                      <h4 className="font-semibold text-gray-800">{t('groupBuy.brandName')}:</h4>
                      <p className="text-gray-600">{brand.name}</p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
          {/* Product thumbnails */}
          <div className="mb-4 border border-gray-100 rounded-xl p-3 shadow-sm bg-gray-50/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary/10 flex items-center justify-center rounded-md">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 3H4C2.89543 3 2 3.89543 2 5V15C2 16.1046 2.89543 17 4 17H20C21.1046 17 22 16.1046 22 15V5C22 3.89543 21.1046 3 20 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M2 7H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-800">{t('groupBuy.products')} ({products.length})</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {products.slice(0, 6).map((product) => (
                <div key={product.id} className="flex-shrink-0">
                  <div className="relative aspect-square overflow-hidden rounded-md border border-gray-200 h-[60px] w-[60px]">
                    <ImagePreviewThumbnail 
                      imageUrl={product.images[0]?.fileUrl || ''} 
                      alt={product.name} 
                    />
                    {!product.images[0]?.fileUrl && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                          <BoxIcon className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {products.length > 6 && (
                <div className="flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 h-[60px] w-[60px] text-xs font-medium text-gray-500">
                  +{products.length - 6}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Purchase limit indicator */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 border border-pink-100">
              <div className="w-10 h-10 bg-pink-100 flex items-center justify-center rounded-xl text-pink-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 11V7C7 5.93913 7.42143 4.92172 8.17157 4.17157C8.92172 3.42143 9.93913 3 11 3H13C14.0609 3 15.0783 3.42143 15.8284 4.17157C16.5786 4.92172 17 5.93913 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold text-gray-800">{t('groupBuy.purchaseLimit')}</span>
                <div className="text-xs text-gray-500">
                  {t('groupBuy.item.limitAmount', { amount: groupProduct.maxBuyAmountEachPerson || 1 })}
                </div>
              </div>
              <div className="flex items-center justify-center min-w-[32px] h-8 bg-pink-100 rounded-full px-3 text-sm font-bold text-pink-600">
                {groupProduct.maxBuyAmountEachPerson || 1}
              </div>
            </div>

            {/* Individual payment indicator */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
              <div className="w-10 h-10 bg-green-100 flex items-center justify-center rounded-xl text-green-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4C11.1109 4 10.2355 4.20693 9.45863 4.5941C8.68179 4.98127 8.02334 5.53582 7.5359 6.20845C7.04846 6.88108 6.75138 7.65394 6.67197 8.46249C6.59256 9.27104 6.73344 10.0858 7.08117 10.8197C7.4289 11.5537 7.97109 12.1818 8.65404 12.6418C9.33699 13.1019 10.1351 13.3773 10.9625 13.4332C11.79 13.4891 12.6178 13.3234 13.3596 12.9551C14.1013 12.5867 14.7391 12.0277 15.2073 11.333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14.472 7.33301C14.8347 7.14767 15.241 7.05063 15.6534 7.05063C16.0658 7.05063 16.4721 7.14767 16.8347 7.33301C17.1973 7.51836 17.5046 7.78608 17.7323 8.11329C17.96 8.4405 18.1011 8.81763 18.1437 9.20871C18.1864 9.5998 18.1291 9.99578 17.9767 10.3583C17.8243 10.7209 17.5799 11.0387 17.2689 11.2789C16.958 11.5191 16.5901 11.6742 16.2005 11.7316C15.8109 11.7889 15.4136 11.7468 15.0474 11.6086C14.6812 11.4704 14.3577 11.24 14.108 10.9404" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 19.6897C6.50412 18.4918 7.33637 17.4492 8.39897 16.6953C9.46158 15.9414 10.7119 15.5043 12 15.4376M18 19.6897C17.4959 18.4918 16.6636 17.4492 15.601 16.6953C14.5384 15.9414 13.2881 15.5043 12 15.4376M12 15.4376V20.9996" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold text-gray-800">{t('groupBuy.individualPayment')}</span>
                <div className="text-xs text-gray-500">
                  {t('groupBuy.separatePayment', 'Mỗi thành viên thanh toán phần của mình')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details accordion */}
 

        {/* Action button */}
        <div className="px-3 pb-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-white rounded-xl font-medium shadow-sm">
                {t('groupBuy.createBtn')}
              </Button>
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
                                  .replace(':brandId', brand.id as string)
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
  )
}
