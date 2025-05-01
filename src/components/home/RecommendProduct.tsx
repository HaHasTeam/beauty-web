import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import { getProductFilterApi } from '@/network/apis/product'
import { DiscountTypeEnum, OrderEnum, ProductEnum, StatusEnum } from '@/types/enum'
import { IResponseProduct } from '@/types/product'
import { calculateDiscountPrice } from '@/utils/price'
import { getCheapestClassification } from '@/utils/product'

import Empty from '../empty/Empty'
import LoadingIcon from '../loading-icon'
import ProductCard from '../product/ProductCard'

const RecommendProduct = () => {
  const { t } = useTranslation()

  const { data: products, isLoading } = useQuery({
    queryKey: [
      getProductFilterApi.queryKey,
      {
        page: 1,
        limit: 20,
      },
    ],
    queryFn: getProductFilterApi.fn,
  })

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
      salesLast30Days: Number(product.salesLast30Days),
      classifications: productClassifications,
      certificates: product.certificates,
    }

    return (
      <ProductCard key={product?.id} product={mockProduct} isProductDiscount={productTag === OrderEnum.FLASH_SALE} />
    )
  }

  const hasProducts = products?.data?.items && products.data.items.length > 0

  return (
    <div>
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold flex items-center gap-1 text-primary">
            {t('home.recommendProductsTitle')}
          </h2>
        </div>
        <Link
          to={configs.routes.recommendProducts}
          className="text-primary hover:opacity-80 transition-opacity flex items-center gap-1"
        >
          {t('button.seeAll')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading && (
        <div className="w-full flex justify-center items-center">
          <LoadingIcon color="primaryBackground" />
        </div>
      )}

      {!isLoading && !hasProducts && (
        <Empty title={t('empty.recommendProducts.title')} description={t('empty.recommendProducts.description')} />
      )}

      {!isLoading && hasProducts && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.data.items.map(renderProductCard)}
          </div>
        </>
      )}
    </div>
  )
}

export default RecommendProduct
