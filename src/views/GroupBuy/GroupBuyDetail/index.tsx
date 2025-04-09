import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { getBrandByIdApi } from '@/network/apis/brand'
import { getGroupBuyingByIdApi } from '@/network/apis/group-buying'
import { IBranch } from '@/types/brand'
import { DiscountTypeEnum } from '@/types/enum'
import { GroupBuyingCriteria } from '@/types/group-product'
import { formatCurrency, formatNumber } from '@/utils/number'

import Banner from './Banner'
import ProductsByCategories from './ProductsByCategories'

const GroupDetails = () => {
  const brandId = useParams().brandId
  const groupId = useParams().groupId
  const { t } = useTranslation()
  const { data: brand, isLoading: isGettingBrand } = useQuery({
    queryKey: [getBrandByIdApi.queryKey, brandId as string],
    queryFn: getBrandByIdApi.fn,
  })

  const { data: groupBuyingInfo, isLoading: isGettingGroupBuyingInfo } = useQuery({
    queryKey: [getGroupBuyingByIdApi.queryKey, groupId as string],
    queryFn: getGroupBuyingByIdApi.fn,
    select: (data) => {
      if (!data?.data) return data;
      
      // Create a deep copy to avoid mutating the original data
      const formattedData = JSON.parse(JSON.stringify(data));
      
      // Format the criteria data
      if (formattedData.data.criteria && formattedData.data.criteria.voucher) {
        const voucher = formattedData.data.criteria.voucher;
        if (voucher.discountType === DiscountTypeEnum.PERCENTAGE) {
          // Convert from decimal to percentage (e.g. 0.1 to 10)
          const discountValue = voucher.discountValue * 100;
          voucher.formattedDiscount = formatNumber(discountValue, '%');
        } else {
          voucher.formattedDiscount = formatCurrency(voucher.discountValue);
        }
      }
      
      // Also format group product criteria if available
      if (formattedData.data.groupProduct && formattedData.data.groupProduct.criterias) {
        formattedData.data.groupProduct.criterias = formattedData.data.groupProduct.criterias.map((criteria: GroupBuyingCriteria) => {
          if (criteria.voucher) {
            const discountValue = criteria.voucher.discountType === DiscountTypeEnum.PERCENTAGE
              ? criteria.voucher.discountValue * 100  // Convert from decimal to percentage
              : criteria.voucher.discountValue;
              
            return {
              ...criteria,
              voucher: {
                ...criteria.voucher,
                formattedDiscount: criteria.voucher.discountType === DiscountTypeEnum.PERCENTAGE
                  ? formatNumber(discountValue, '%')
                  : formatCurrency(discountValue)
              }
            };
          }
          return criteria;
        });
      }
      
      return formattedData;
    }
  })

  const isLoading = isGettingBrand || isGettingGroupBuyingInfo
  return (
    <div className="w-full container mx-auto px-4 py-8 ">
      {isLoading && <LoadingContentLayer />}
      {!isLoading && (!brand?.data || !groupBuyingInfo?.data) && (
        <Empty title={t('empty.groupBuying.title')} description={t('empty.groupBuying.description')} />
      )}
      {!isLoading && brand?.data && groupBuyingInfo?.data && (
        <div className="w-full lg:px-28 md:px-24 sm:px-16 px-10 space-y-12">
          <Banner brand={brand?.data as IBranch} groupBuyingInfo={groupBuyingInfo?.data} />
          <ProductsByCategories groupBuyingInfo={groupBuyingInfo?.data} />
        </div>
      )}
    </div>
  )
}

export default GroupDetails
