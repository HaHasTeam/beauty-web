import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import emptySearch from '@/assets/images/NoSearchResult.png'
import BrandSection from '@/components/brand/BrandSection'
import CustomBreadcrumb from '@/components/breadcrumb/CustomBreadcrumb'
import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import APIPagination from '@/components/pagination/Pagination'
import { limit, page } from '@/constants/infor'
import { getBrandFilterApi } from '@/network/apis/brand'
import { BrandStatusEnum } from '@/types/brand'

const SearchBrand = () => {
  const [currentPage, setCurrentPage] = useState(page)
  const { t } = useTranslation()
  const location = useLocation()
  const query = new URLSearchParams(location.search).get('keyword') || ''

  const { data: brandData, isFetching: isFetchingBrand } = useQuery({
    queryKey: [
      getBrandFilterApi.queryKey,
      {
        page: currentPage,
        limit: limit,
        order: 'ASC',
        statuses: [BrandStatusEnum.ACTIVE] as unknown as string & BrandStatusEnum[],
        name: query,
      },
    ],
    queryFn: getBrandFilterApi.fn,
  })
  console.log(brandData)

  return (
    <>
      {isFetchingBrand && <LoadingContentLayer />}
      <div className="container w-full mx-auto sm:px-4 px-2 pt-4 pb-8 my-5">
        <div className="w-full lg:px-8 md:px-4 sm:px-2 px-0 space-y-8">
          <div className="flex flex-col gap-2">
            <CustomBreadcrumb
              dynamicSegments={[
                {
                  segment: t('search.result', { total: brandData?.data?.total ?? 0, keyword: query }),
                },
              ]}
            />

            {/* Replace the existing flex gap-3 div with this responsive layout */}
            <div>
              {/* Results section */}
              <div className="flex-1">
                {/* Brand result */}
                {!isFetchingBrand && brandData && brandData.data.items.length > 0 && (
                  <div className="pb-5 space-y-3">
                    {brandData.data.items.map((brand) => (
                      <BrandSection brand={brand} key={brand.id} />
                    ))}
                  </div>
                )}

                {!isFetchingBrand && (!brandData || (brandData && brandData?.data?.items?.length === 0)) && (
                  <Empty
                    title={t('empty.search.title')}
                    description={t('empty.search.description')}
                    icon={emptySearch}
                  />
                )}
                <div className="my-6">
                  <APIPagination
                    totalPages={brandData?.data?.total ? Math.ceil(Number(brandData?.data.total) / limit) : 0}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchBrand
