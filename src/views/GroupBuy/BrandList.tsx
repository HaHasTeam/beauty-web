import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { getBrandsHasGroupProductApi } from '@/network/apis/brand'

import CompactGroupBuyingCard from './CompactGroupBuyingCard'

const BrandList = () => {
  const { t } = useTranslation()

  const { data: brandList, isLoading: isFetching } = useQuery({
    queryKey: [getBrandsHasGroupProductApi.queryKey],
    queryFn: getBrandsHasGroupProductApi.fn,
  })

  return (
    <div className="flex w-full flex-col gap-10">
      {isFetching && <LoadingContentLayer />}
      <h1 className="capitalize font-bold text-primary text-2xl">{t('groupBuy.title')}</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {brandList?.data.map((brand, index) => <CompactGroupBuyingCard key={index} brand={brand} />)}
      </div>
      {!isFetching && !brandList?.data.length && (
        <Empty
          title={t('empty.brandHasGroupProduct.title')}
          description={t('empty.brandHasGroupProduct.description')}
        />
      )}
    </div>
  )
}

export default BrandList
