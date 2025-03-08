import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { getBrandByIdApi } from '@/network/apis/brand'
import { getGroupProductByBrandIdApi } from '@/network/apis/group-product'
import { IBranch } from '@/types/brand'

import GroupBuyingCard from './GroupBuyingCard'

const GroupBuyingOfBrand = () => {
  const { t } = useTranslation()

  const brandId = useParams().brandId
  const { data: groupProducts, isLoading: isGettingGroupProducts } = useQuery({
    queryKey: [getGroupProductByBrandIdApi.queryKey, brandId as string],
    queryFn: getGroupProductByBrandIdApi.fn,
  })
  const { data: brand, isLoading: isGettingBrand } = useQuery({
    queryKey: [getBrandByIdApi.queryKey, brandId as string],
    queryFn: getBrandByIdApi.fn,
  })

  const isFetching = isGettingGroupProducts || isGettingBrand
  return (
    <div className="w-full container mx-auto px-4 py-8 ">
      {isFetching && <LoadingContentLayer />}
      <div className="w-full lg:px-28 md:px-24 sm:px-16 px-10 space-y-12">
        <h1 className="capitalize font-bold text-primary text-2xl">
          {t('groupBuy.brandGroupBuy.title', {
            brand: brand?.data.name,
          })}
        </h1>
        <div
          className="
        grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {groupProducts?.data.map((group, index) => (
            <GroupBuyingCard key={index} brand={brand?.data as IBranch} groupProduct={group} />
          ))}
        </div>
        {!isFetching && !groupProducts?.data.length && (
          <Empty title={t('groupBuy.noGroupBuy')} description="groupBuy.noGroupBuyDes" />
        )}
      </div>
    </div>
  )
}

export default GroupBuyingOfBrand
