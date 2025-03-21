import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import emptySearch from '@/assets/images/NoSearchResult.png'
import CustomBreadcrumb from '@/components/breadcrumb/CustomBreadcrumb'
import Empty from '@/components/empty/Empty'
import ProductFilter, { PriceRange } from '@/components/filter/ProductFilter'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import APIPagination from '@/components/pagination/Pagination'
import ProductCard from '@/components/product/ProductCard'
import ProductSort from '@/components/sort/ProductSort'
import { limit, page } from '@/constants/infor'
import { getProductFilterApi } from '@/network/apis/product'
import { DiscountTypeEnum, OrderEnum, ProductTagEnum, StatusEnum } from '@/types/enum'
import { ProductEnum } from '@/types/product'
import { calculateDiscountPrice } from '@/utils/price'
import { getCheapestClassification } from '@/utils/product'

const SearchPage = () => {
  const [currentPage, setCurrentPage] = useState(page)
  const { t } = useTranslation()
  const [sortOption, setSortOption] = useState<null | string>('priceLowToHigh')
  const location = useLocation()

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<ProductTagEnum[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<ProductEnum[]>([])
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>({ min: null, max: null })
  const query = new URLSearchParams(location.search).get('keyword') || ''
  const { data: productData, isFetching } = useQuery({
    queryKey: [
      getProductFilterApi.queryKey,
      {
        page: currentPage,
        limit: limit,
        search: query,
        order: sortOption == 'priceLowToHigh' ? 'ASC' : 'DESC',
        categoryId: selectedCategories.length > 0 ? selectedCategories.join() : undefined,
        // tags: selectedTags.length > 0 ? selectedTags : undefined,
        statuses: selectedStatuses.length > 0 ? selectedStatuses.join() : undefined,
        minPrice: selectedPriceRange.min !== null ? selectedPriceRange.min : undefined,
        maxPrice: selectedPriceRange.max !== null ? selectedPriceRange.max : 2147483647,
      },
    ],
    queryFn: getProductFilterApi.fn,
    select: (data) => data.data,
  })

  return (
    <>
      {isFetching && <LoadingContentLayer />}
      <div className="container w-full mx-auto sm:px-4 px-2 pt-4 pb-8 my-5">
        <div className="w-full lg:px-8 md:px-4 sm:px-2 px-0 space-y-8">
          <div className="flex flex-col gap-2">
            <CustomBreadcrumb
              customSegments={{
                search: t('search.result', { total: productData?.total, keyword: query }),
              }}
            />

            {/* Replace the existing flex gap-3 div with this responsive layout */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Filter section with responsive styling */}
              <div className="w-full md:w-64 lg:w-72 mb-4 md:mb-0">
                <ProductFilter
                  onCategoriesSelect={setSelectedCategories}
                  onTagsSelect={setSelectedTags}
                  onStatusSelect={setSelectedStatuses}
                  onPriceRangeSelect={setSelectedPriceRange}
                  selectedCategoryIds={selectedCategories}
                  selectedTags={selectedTags}
                  selectedStatuses={selectedStatuses}
                  selectedPriceRange={selectedPriceRange}
                />
              </div>

              {/* Results section */}
              <div className="flex-1">
                <ProductSort setSortOption={setSortOption} sortOption={sortOption} />

                {productData && productData.items?.length > 0 ? (
                  <div className="w-full p-4 mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 md:gap-4">
                    {productData.items?.map((product) => {
                      const productClassifications = product?.productClassifications.filter(
                        (classification) => classification.status === StatusEnum.ACTIVE,
                      )
                      // show cheapest classification
                      const productClassification = getCheapestClassification(product.productClassifications ?? [])
                      const currentPrice = calculateDiscountPrice(
                        productClassification?.price ?? 0,
                        productClassification?.productDiscount && productClassification?.status === StatusEnum.ACTIVE
                          ? productClassification?.productDiscount?.discount
                          : 0,
                        DiscountTypeEnum.PERCENTAGE,
                      )
                      const productTag =
                        productClassification?.preOrderProduct && productClassification?.status === StatusEnum.ACTIVE
                          ? OrderEnum.PRE_ORDER
                          : productClassification?.productDiscount &&
                              productClassification?.status === StatusEnum.ACTIVE
                            ? OrderEnum.FLASH_SALE
                            : product.status === ProductEnum.OFFICIAL
                              ? ''
                              : product.status

                      const formatProduct = {
                        id: product.id,
                        name: product.name,
                        tag: productTag,
                        price: productClassification?.price ?? -1,
                        currentPrice: currentPrice,
                        images: product.images,
                        deal:
                          productClassification?.productDiscount && productClassification?.status === StatusEnum.ACTIVE
                            ? productClassification?.productDiscount?.discount
                            : 0,
                        flashSale:
                          productClassification?.productDiscount && productClassification?.status === StatusEnum.ACTIVE
                            ? {
                                productAmount: (
                                  productClassification?.productDiscount?.productClassifications ?? []
                                ).filter((classification) => classification?.status === StatusEnum.ACTIVE)?.[0]
                                  .quantity,
                                soldAmount: 65,
                              }
                            : null,
                        description: product.description,
                        detail: product.detail,
                        rating: 4.5,
                        ratingAmount: 250,
                        soldInPastMonth: 300,
                        classifications: productClassifications,
                        certificates: product.certificates,
                      }
                      return (
                        <ProductCard
                          key={product?.id}
                          product={formatProduct}
                          isProductDiscount={productTag === OrderEnum.FLASH_SALE}
                        />
                      )
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
                    totalPages={productData?.total ? Math.ceil(Number(productData.total) / limit) : 0}
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
