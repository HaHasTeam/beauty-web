import { useQuery } from '@tanstack/react-query'
import { ArrowRight, CalendarClock } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Empty from '@/components/empty/Empty'
import LoadingIcon from '@/components/loading-icon'
import PreOrderProductCard from '@/components/product/PreOrderProductCard'
import { getPreOrderProductFilterApi } from '@/network/apis/pre-order'
import { PreOrderProductEnum } from '@/types/pre-order'

function PreOrderProductSections() {
  const { t } = useTranslation()
  const [activeStatus, setActiveStatus] = useState<PreOrderProductEnum>(PreOrderProductEnum.ACTIVE)

  const { data: preOrderProductData, isLoading } = useQuery({
    queryKey: [getPreOrderProductFilterApi.queryKey, { page: 1, limit: 10, statuses: activeStatus }],
    queryFn: getPreOrderProductFilterApi.fn,
    select: (data) => data.data,
  })

  const hasProducts = preOrderProductData?.items && preOrderProductData.items.length > 0

  const handleStatusChange = (status: PreOrderProductEnum) => {
    setActiveStatus(status)
  }

  return (
    <div>
      <div className="flex flex-col w-full max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2 mb-8">
            <CalendarClock className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-primary">{t('home.preOrderTitle')}</h2>
          </div>

          <Link to="/pre-orders" className="flex items-center text-primary hover:no-underline">
            {t('button.seeAll')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="flex mb-6">
        <div className="flex items-center rounded-lg overflow-hidden">
          <button
            onClick={() => handleStatusChange(PreOrderProductEnum.ACTIVE)}
            className={`px-4 py-2 text-sm font-medium ${
              activeStatus === PreOrderProductEnum.ACTIVE
                ? 'bg-primary text-white border border-primary'
                : 'bg-white text-primary border-primary border rounded-tl-lg rounded-bl-lg hover:bg-primary/10'
            }`}
          >
            {t('home.status.active')}
          </button>
          <button
            onClick={() => handleStatusChange(PreOrderProductEnum.WAITING)}
            className={`px-4 py-2 text-sm font-medium ${
              activeStatus === PreOrderProductEnum.WAITING
                ? 'bg-primary text-white border border-primary'
                : 'bg-white text-primary border-primary border rounded-tr-lg rounded-br-lg hover:bg-primary/10'
            }`}
          >
            {t('home.status.waiting')}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="w-full flex justify-center items-center min-h-[200px]">
          <LoadingIcon color="primaryBackground" />
        </div>
      )}

      {!isLoading && !hasProducts && (
        <Empty
          title={t('empty.preOrder.title')}
          description={
            activeStatus === PreOrderProductEnum.ACTIVE
              ? t('empty.preOrder.description')
              : t('empty.preOrder.waitingDescription')
          }
        />
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
  )
}

export default PreOrderProductSections
