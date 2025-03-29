import BeautyConsulting from '@/components/home/BeautyConsulting'
import BeautyOffers from '@/components/home/BeautyOffers'
import FlashSale from '@/components/home/FlashSale'
import HomeBanner from '@/components/home/HomeBanner'
import RecommendProduct from '@/components/home/RecommendProduct'

import PreOrderProductSections from '../PreOrderProduct'

function Home() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto sm:px-4 px-2 py-8">
        <div className="w-full lg:px-28 md:px-3 sm:px-4 px-0 space-y-16">
          <HomeBanner />
          <div className="space-y-16 animate-fadeIn">
            <BeautyConsulting />
            <BeautyOffers />
            <FlashSale />
            <RecommendProduct />
            <PreOrderProductSections />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
