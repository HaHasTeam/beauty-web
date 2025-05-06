import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { cn } from '@/lib/utils'
import { getBrandByIdApi } from '@/network/apis/brand'
import { IBrand } from '@/types/brand'

import BrandOverview from './BrandOverview'

const Index = () => {
  const brandId = useParams().brandId
  const { t } = useTranslation()
  const { data: brand, isLoading: isFetching } = useQuery({
    queryKey: [getBrandByIdApi.queryKey, brandId as string],
    queryFn: getBrandByIdApi.fn,
    enabled: !!brandId,
  })

  return (
    <div className="w-full container mx-auto px-4 py-8 ">
      <div className="w-full lg:px-28 md:px-24 sm:px-16 px-10 space-y-12">
        {isFetching && <LoadingContentLayer />}
        {/* product information */}
        <div className={cn('w-full space-y-3 ')}>
          {!isFetching && brand && brand?.data && (
            <>
              <div className="flex gap-2 w-full flex-col">
                <BrandOverview brand={brand?.data as unknown as IBrand} />
              </div>
            </>
          )}
          {!isFetching && (!brand || !brand?.data) && (
            <Empty title={t('brand.empty.title')} description={t('brand.empty.description')} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Index
