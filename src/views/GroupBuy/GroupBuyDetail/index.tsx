import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { getBrandByIdApi } from '@/network/apis/brand'
import { getGroupBuyingByIdApi } from '@/network/apis/group-buying'
import { IBranch } from '@/types/brand'

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
