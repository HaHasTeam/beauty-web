import { ArrowRight } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import ProductCard from '@/components/product/ProductCard'
import configs from '@/config'
import { buildOneWayResource } from '@/router'
import { TGroupBuying } from '@/types/group-buying'

type ProductsByCategoriesProps = {
  groupBuyingInfo: TGroupBuying
}
const ProductsByCategories = ({ groupBuyingInfo }: ProductsByCategoriesProps) => {
  const { t } = useTranslation()

  const allProducts = useMemo(() => {
    return groupBuyingInfo.groupProduct.products
  }, [groupBuyingInfo.groupProduct.products])

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-1 text-primary">
              {t('groupBuy.productListLabel', {
                amount: allProducts?.length ?? 0,
              })}
            </h2>
          </div>
          <Link
            to={buildOneWayResource(configs.routes.recommendProducts)}
            className="text-[#FF6B35] hover:opacity-80 transition-opacity flex items-center gap-1"
          >
            {t('button.seeAll')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {allProducts?.slice(0, 10)?.map((product) => {
            const productImages = product?.images ?? [{ id: '1', image: 'path/to/image1.png' }]
            const mockProduct = {
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
              certificates:product.certificates,
            }
            return <ProductCard key={product?.id} product={mockProduct} isInGroupBuying />
          })}
        </div>
      </div>
    </div>
  )
}

export default ProductsByCategories
