import BeautyConsulting from '@/components/home/BeautyConsulting'
import BeautyOffers from '@/components/home/BeautyOffers'
import FlashSale from '@/components/home/FlashSale'

function Home() {
  return (
    <div className="w-[1200px] container mx-auto px-4 py-8 space-y-12">
      <BeautyConsulting />
      <BeautyOffers />
      <FlashSale />
    </div>
  )
}

export default Home
