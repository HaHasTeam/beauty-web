import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import { IProductCard } from '@/types/product'

import ProductCard from '../product/ProductCard'

const RecommendProduct = () => {
  const { t } = useTranslation()
  const recommendProducts: IProductCard[] = [
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
  ]

  return (
    <div>
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-1 text-primary">
            {t('home.recommendProductsTitle')}
          </h2>
        </div>
        <Link
          to={configs.routes.recommendProducts}
          className="text-[#FF6B35] hover:opacity-80 transition-opacity flex items-center gap-1"
        >
          {t('button.seeAll')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {recommendProducts?.map((product) => <ProductCard key={product?.id} product={product} />)}
      </div>
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
