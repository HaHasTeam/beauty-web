import { useQuery } from '@tanstack/react-query'
import { Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import Empty from '@/components/empty/Empty'
import LoadingIcon from '@/components/loading-icon'
import PreOrderProductCard from '@/components/product/PreOrderProductCard'
import { getPreOrderProductFilterApi } from '@/network/apis/pre-order'

function PreOrderProductSections() {
  const { t } = useTranslation()
  const { data: preOrderProductData, isLoading } = useQuery({
    queryKey: [getPreOrderProductFilterApi.queryKey, { page: 1, limit: 10 }],
    queryFn: getPreOrderProductFilterApi.fn,
    select: (data) => data.data,
  })

  const hasProducts = preOrderProductData?.items && preOrderProductData.items.length > 0

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Clock className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-primary">{t('home.preOrderTitle')}</h2>
        </div>

        {isLoading && (
          <div className="w-full flex justify-center items-center min-h-[200px]">
            <LoadingIcon color="primaryBackground" />
          </div>
        )}

        {!isLoading && !hasProducts && (
          <Empty title={t('empty.preOrder.title')} description={t('empty.preOrder.description')} />
        )}

        {!isLoading && hasProducts && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {preOrderProductData.items.map((preOrderProduct) => (
              <div key={preOrderProduct.id} className="h-full">
                <PreOrderProductCard preOrderProduct={preOrderProduct} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default PreOrderProductSections
