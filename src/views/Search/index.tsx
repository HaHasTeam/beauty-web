import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import emptySearch from '@/assets/images/NoSearchResult.png'
import CustomBreadcrumb from '@/components/breadcrumb/CustomBreadcrumb'
import Empty from '@/components/empty/Empty'
import ProductFilter from '@/components/filter/ProductFilter'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import APIPagination from '@/components/pagination/Pagination'
import ProductCard from '@/components/product/ProductCard'
import ProductSort from '@/components/sort/ProductSort'
import { limit, page } from '@/constants/infor'
import { getProductFilterApi } from '@/network/apis/product'

const SearchPage = () => {
  const [currentPage, setCurrentPage] = useState(page)
  const { t } = useTranslation()
  const [sortOption, setSortOption] = useState<null | string>('priceLowToHigh')
  const location = useLocation()

  const query = new URLSearchParams(location.search).get('keyword') || ''
  const { data: productData, isFetching } = useQuery({
    queryKey: [
      getProductFilterApi.queryKey,
      { page: currentPage, limit: limit, search: query, order: sortOption == 'priceLowToHigh' ? 'ASC' : 'DESC' },
    ],
    queryFn: getProductFilterApi.fn,
    select: (data) => data.data,
  })
  console.log('productData', productData)

  return (
    <>
      {isFetching && <LoadingContentLayer />}
      <div className="container w-full mx-auto pt-4 pb-8 my-10">
        <div className="w-full  px-1">
          <div className="flex flex-col gap-2">
            <CustomBreadcrumb
              customSegments={{
                search: t('search.result', { total: productData?.total, keyword: query }),
              }}
            />

            <div className="flex gap-3">
              <ProductFilter />

              <div className="flex-1">
                <ProductSort setSortOption={setSortOption} sortOption={sortOption} />

                {productData && productData.items?.length > 0 ? (
                  <div className=" w-full mt-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
                    {productData.items?.map((product) => {
                      const productImages = product.images ?? [{ id: '1', image: 'path/to/image1.png' }]
                      const formatProduct = {
                        id: product.id,
                        name: product.name,
                        tag: 'Best Seller',
                        price: 20.09,
                        currentPrice: product.productClassifications[0].price,
                        images: productImages,
                        deal: 0.33,
                        flashSale: {
                          productAmount: 100,
                          soldAmount: 65,
                        },
                        description: product.description,
                        detail: product.detail,
                        rating: 4.5,
                        ratingAmount: 250,
                        soldInPastMonth: 300,
                        classifications: product.productClassifications,
                      }
                      return <ProductCard key={product?.id} product={formatProduct} />
                    })}
                  </div>
                ) : (
                  <Empty
                    title={t('empty.search.title')}
                    description={t('empty.search.description')}
                    icon={emptySearch}
                  />
                )}

                <div className="my-6">
                  <APIPagination
                    totalPages={Number(productData?.total) || 10}
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

export default SearchPage
