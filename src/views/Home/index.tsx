import BeautyConsulting from '@/components/home/BeautyConsulting'
import BeautyOffers from '@/components/home/BeautyOffers'
import FlashSale from '@/components/home/FlashSale'
import HomeBanner from '@/components/home/HomeBanner'
import RecommendProduct from '@/components/home/RecommendProduct'

import PreOrderProductSections from '../PreOrderProduct'

function Home() {
  return (
    <div className="w-full container mx-auto px-4 py-8 ">
      <div className="w-full lg:px-28 md:px-24 sm:px-16 px-10 space-y-12">
        <HomeBanner />
        <BeautyConsulting />
        <BeautyOffers />
        <FlashSale />
        <RecommendProduct />
        <PreOrderProductSections />
      </div>
    </div>
  )
}

export default Home
