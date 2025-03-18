import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import { getRecommendProducts } from '@/network/apis/product'
import { buildOneWayResource } from '@/router'
import { DiscountTypeEnum, OrderEnum, ProductEnum, ProductTagEnum, StatusEnum } from '@/types/enum'
import { calculateDiscountPrice } from '@/utils/price'
import { getCheapestClassification } from '@/utils/product'

import LoadingIcon from '../loading-icon'
import ProductCard from '../product/ProductCard'

const RecommendProduct = () => {
  const { t } = useTranslation()

  const { data: products, isLoading } = useQuery({
    queryKey: [
      getRecommendProducts.queryKey,
      {
        search: '',
        tag: ProductTagEnum.BEST_SELLER,
        page: 1,
        limit: 3,
      },
    ],
    queryFn: getRecommendProducts.fn,
  })

  return (
    <div>
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-1 text-primary">
            {t('home.recommendProductsTitle')}
          </h2>
        </div>
        <Link
          to={buildOneWayResource(configs.routes.recommendProducts)}
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
      {!isLoading && products?.data?.items && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.data.items?.map((product) => {
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
                : productClassification?.productDiscount && productClassification?.status === StatusEnum.ACTIVE
                  ? OrderEnum.FLASH_SALE
                  : product.status === ProductEnum.OFFICIAL
                    ? ''
                    : product.status

            const mockProduct = {
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
                      productAmount: (productClassification?.productDiscount?.productClassifications ?? []).filter(
                        (classification) => classification?.status === StatusEnum.ACTIVE,
                      )?.[0].quantity,
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
                product={mockProduct}
                isProductDiscount={productTag === OrderEnum.FLASH_SALE}
              />
            )
          })}
        </div>
      )}
      <div className="flex justify-center mt-4">
        <Link
          to={configs.routes.recommendProducts}
          className="py-2 rounded-md bg-primary hover:bg-primary/70 text-primary-foreground px-12"
        >
          {t('button.viewAll')}
        </Link>
      </div>
    </div>
  )
}

export default RecommendProduct
