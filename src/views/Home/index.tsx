import BeautyConsulting from '@/components/home/BeautyConsulting'
import BeautyOffers from '@/components/home/BeautyOffers'
import FlashSale from '@/components/home/FlashSale'
import RecommendProduct from '@/components/home/RecommendProduct'

function Home() {
  return (
    <div className="w-full container mx-auto px-4 py-8 space-y-12">
      <div className="w-full lg:px-44 md:px-40 sm:px-16 px-10">
        <BeautyConsulting />
        <BeautyOffers />
        <FlashSale />
        <RecommendProduct />
      </div>
    </div>
  )
}

export default Home
