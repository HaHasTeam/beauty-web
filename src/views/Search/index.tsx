import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import emptySearch from '@/assets/images/NoSearchResult.png'
import CustomBreadcrumb from '@/components/breadcrumb/CustomBreadcrumb'
import Empty from '@/components/empty/Empty'
import ProductFilter from '@/components/filter/ProductFilter'
import LoadingIcon from '@/components/Loading'
import APIPagination from '@/components/pagination/Pagination'
import ProductCard from '@/components/product/ProductCard'
import ProductSort from '@/components/sort/ProductSort'
import { IProductCard } from '@/types/product-card.interface'

const SearchPage = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalPages, setTotalPages] = useState(0)
  const { t } = useTranslation()
  const [searchedProducts, setSearchedProducts] = useState<IProductCard[]>([])
  const location = useLocation()

  const query = new URLSearchParams(location.search).get('keyword') || ''

  useEffect(() => {
    if (query) {
      fetchProducts(query, currentPage)
    }
  }, [query, currentPage])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchProducts = async (_searchQuery: string, _page: number) => {
    // Simulated API call
    // const response = await fetch(`/api/products?query=${searchQuery}&page=${page}`)
    // const data = await response.json()
    setIsSearchLoading(true)
    setSearchedProducts([
      {
        id: '1',
        name: 'Cherry Blossom Serum',
        tag: 'Best Seller',
        price: 29.99,
        currentPrice: 20.09,
        images: [{ id: '1', image: 'path/to/image1.png' }],
        deal: 0.33,
        flashSale: {
          productAmount: 100,
          soldAmount: 65,
        },
        rating: 4.5,
        ratingAmount: 250,
        soldInPastMonth: 300,
      },
      {
        id: '2',
        name: 'Aloe Vera Moisturizer',
        tag: 'Limited Edition',
        price: 34.99,
        currentPrice: 24.84,
        images: [{ id: '1', image: 'path/to/image1.png' }],
        deal: 0.29,
        flashSale: {
          productAmount: 200,
          soldAmount: 120,
        },
        rating: 4.7,
        ratingAmount: 340,
        soldInPastMonth: 500,
      },
      {
        id: '3',
        name: 'Vitamin C Brightening Serum',
        tag: 'New Arrival',
        price: 19.99,
        currentPrice: 14.99,
        images: [{ id: '1', image: 'path/to/image1.png' }],
        deal: 0.25,
        rating: 4.6,
        ratingAmount: 180,
        soldInPastMonth: 220,
      },
      {
        id: '4',
        name: 'Hydrating Face Mist',
        tag: 'Hot Deal',
        price: 15.99,
        currentPrice: 12.79,
        images: [{ id: '1', image: 'path/to/image1.png' }],
        deal: 0.2,
        flashSale: {
          productAmount: 80,
          soldAmount: 50,
        },
        rating: 4.2,
        ratingAmount: 130,
        soldInPastMonth: 160,
      },
      {
        id: '5',
        name: 'Green Tea Cleanser',
        tag: 'Flash Sale',
        price: 12.99,
        currentPrice: 10.0,
        images: [{ id: '1', image: 'path/to/image1.png' }],
        deal: 0.23,
        flashSale: {
          productAmount: 50,
          soldAmount: 30,
        },
        rating: 4.8,
        ratingAmount: 95,
        soldInPastMonth: 120,
      },
      {
        id: '6',
        name: 'Hyaluronic Acid Serum',
        tag: 'Best Seller',
        price: 25.99,
        currentPrice: 20.79,
        images: [{ id: '1', image: 'path/to/image1.png' }],
        deal: 0.2,
        rating: 4.9,
        ratingAmount: 400,
        soldInPastMonth: 550,
      },
      {
        id: '7',
        name: 'Retinol Anti-Aging Cream',
        tag: 'Limited Edition',
        price: 49.99,
        currentPrice: 39.99,
        images: [{ id: '1', image: 'path/to/image1.png' }],
        deal: 0.2,
        rating: 4.4,
        ratingAmount: 210,
        soldInPastMonth: 310,
      },
      {
        id: '8',
        name: 'Rose Water Toner',
        tag: 'Hot Deal',
        price: 18.99,
        currentPrice: 15.19,
        images: [{ id: '1', image: 'path/to/image1.png' }],
        deal: 0.2,
        rating: 4.3,
        ratingAmount: 170,
        soldInPastMonth: 200,
      },
      {
        id: '9',
        name: 'Cherry Blossom Serum Cherry Blossom Serum Cherry Blossom Serum',
        tag: 'Best Seller',
        price: 29.99,
        currentPrice: 20.09,
        images: [{ id: '1', image: 'path/to/image1.png' }],
        deal: 0.33,
        flashSale: {
          productAmount: 100,
          soldAmount: 65,
        },
        rating: 4.5,
        ratingAmount: 250,
        soldInPastMonth: 300,
      },
      {
        id: '10',
        name: 'Cherry Blossom Serum',
        tag: 'Best Seller',
        price: 29.99,
        currentPrice: 20.09,
        images: [{ id: '1', image: 'path/to/image1.png' }],
        deal: 0.33,
        flashSale: {
          productAmount: 100,
          soldAmount: 65,
        },
        rating: 4.5,
        ratingAmount: 250,
        soldInPastMonth: 300,
      },
    ])
    setIsSearchLoading(false)
    // setTotalPages(data.totalPages)
  }
  return isSearchLoading ? (
    <LoadingIcon />
  ) : (
    <div className="w-full mx-auto pt-4 pb-8">
      <div className="w-full lg:px-28 md:px-24 sm:px-16 px-10">
        <div className="flex flex-col gap-2">
          <CustomBreadcrumb
            customSegments={{
              search: t('search.result', { total: searchedProducts.length }),
            }}
          />
          {searchedProducts?.length > 0 ? (
            <div className="flex gap-3">
              <div>
                <ProductFilter />
              </div>
              <div className="">
                <ProductSort />
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {searchedProducts?.map((product) => <ProductCard key={product?.id} product={product} />)}
                </div>
              </div>
            </div>
          ) : (
            <Empty title={t('empty.search.title')} description={t('empty.search.description')} icon={emptySearch} />
          )}
        </div>
        <APIPagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
    </div>
  )
}

export default SearchPage
