import BeautyConsulting from '@/components/home/BeautyConsulting'
import BeautyOffers from '@/components/home/BeautyOffers'

function Home() {
  return (
    <div className="w-[1200px] container mx-auto px-4 py-8 space-y-12">
      <BeautyConsulting />
      <BeautyOffers />
    </div>
  )
}

export default Home
