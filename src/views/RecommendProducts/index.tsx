import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CustomBreadcrumb from '@/components/breadcrumb/CustomBreadcrumb'
import APIPagination from '@/components/pagination/Pagination'
import ProductCard from '@/components/product/ProductCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { getRecommendProducts } from '@/network/apis/product'
import { DiscountTypeEnum, OrderEnum, ProductTagEnum, StatusEnum } from '@/types/enum'
import { IResponseProduct, ProductEnum } from '@/types/product'
import { calculateDiscountPrice } from '@/utils/price'
import { getCheapestClassification } from '@/utils/product'

export default function RecommendedProductsPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const { t } = useTranslation()

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setCurrentPage(1) // Reset to first page on new search
    }, 500)

    return () => clearTimeout(timer)
  }, [search])
  const [selectedTag, setSelectedTag] = useState<ProductTagEnum>(ProductTagEnum.BEST_SELLER)

  // Fetch products with React Query
  const { data: productData, isLoading } = useQuery({
    queryKey: [
      getRecommendProducts.queryKey,
      {
        search: debouncedSearch,
        tag: selectedTag,
        page: currentPage,
        limit: 10,
      },
    ],
    queryFn: getRecommendProducts.fn,
  })

  const products = productData?.data.items || []
  // const totalItems = Number(productData?.data?.total) || 0
  const totalPages = Number(productData?.data.totalPages) || 0

  const renderProductCard = (product: IResponseProduct) => {
    const productClassifications = product?.productClassifications?.filter(
      (classification) => classification.status === StatusEnum.ACTIVE,
    )
    const productClassification = getCheapestClassification(product.productClassifications ?? [])
    const isActive = productClassification?.status === StatusEnum.ACTIVE
    const hasDiscount = isActive && productClassification?.productDiscount
    const hasPreOrder = isActive && productClassification?.preOrderProduct

    const currentPrice = calculateDiscountPrice(
      productClassification?.price ?? 0,
      hasDiscount ? productClassification?.productDiscount?.discount : 0,
      DiscountTypeEnum.PERCENTAGE,
    )

    const productTag = hasPreOrder
      ? OrderEnum.PRE_ORDER
      : hasDiscount
        ? OrderEnum.FLASH_SALE
        : product.status === ProductEnum.OFFICIAL
          ? ''
          : product.status

    const mockProduct = {
      id: product.id,
      name: product.name,
      tag: productTag,
      price: productClassification?.price ?? -1,
      currentPrice,
      images: product.images,
      deal: hasDiscount ? productClassification?.productDiscount?.discount : 0,
      flashSale: hasDiscount
        ? {
            productAmount: (productClassification?.productDiscount?.productClassifications ?? []).filter(
              (classification) => classification?.status === StatusEnum.ACTIVE,
            )?.[0].quantity,
            soldAmount: 65,
          }
        : null,
      description: product.description,
      detail: product.detail,
      rating: Number(product.averageRating),
      ratingAmount: Number(product.totalRatings),
      soldInPastMonth: Number(product.salesLast30Days),
      classifications: productClassifications,
      certificates: product.certificates,
    }

    return (
      <ProductCard key={product?.id} product={mockProduct} isProductDiscount={productTag === OrderEnum.FLASH_SALE} />
    )
  }

  return (
    <div className="container mx-auto sm:px-4 px-2 py-8">
      <div className="w-full lg:px-28 md:px-16 px-4  ">
        <CustomBreadcrumb
          customSegments={{
            search: t('search.result', { total: productData?.data.total, keyword: search }),
          }}
        />
        <div className="flex justify-center gap-3 mb-8">
          <div className="inline-flex items-center justify-center p-1 bg-muted rounded-lg">
            <Button
              variant={selectedTag === ProductTagEnum.BEST_SELLER ? 'default' : 'ghost'}
              onClick={() => setSelectedTag(ProductTagEnum.BEST_SELLER)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                selectedTag === ProductTagEnum.BEST_SELLER
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Best Sellers
            </Button>
            <Button
              variant={selectedTag === ProductTagEnum.HOT ? 'default' : 'ghost'}
              onClick={() => setSelectedTag(ProductTagEnum.HOT)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                selectedTag === ProductTagEnum.HOT
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Hot Products
            </Button>
            <Button
              variant={selectedTag === ProductTagEnum.NEW ? 'default' : 'ghost'}
              onClick={() => setSelectedTag(ProductTagEnum.NEW)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                selectedTag === ProductTagEnum.NEW
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              New Arrivals
            </Button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {Array.from({ length: Number(10) }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardContent className="pt-4">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-8 bg-muted rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            {/* Products grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
              {products.map((product) => renderProductCard(product))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <APIPagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">We couldn't find any products matching your search criteria.</p>
            {debouncedSearch && (
              <Button onClick={() => setSearch('')} variant="outline">
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
