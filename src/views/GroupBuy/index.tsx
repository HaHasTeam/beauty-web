import Banner from './Banner'
import BrandList from './BrandList'

const GroupBuy = () => {
  return (
    <div className="w-full container mx-auto px-4 py-8 ">
      <div className="w-full lg:px-28 md:px-24 sm:px-16 px-10 space-y-12">
        <Banner />
        <BrandList />
      </div>
    </div>
  )
}

export default GroupBuy
