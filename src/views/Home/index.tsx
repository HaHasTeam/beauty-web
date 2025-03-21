import BeautyConsulting from '@/components/home/BeautyConsulting'
import BeautyOffers from '@/components/home/BeautyOffers'
import FlashSale from '@/components/home/FlashSale'
import HomeBanner from '@/components/home/HomeBanner'
import RecommendProduct from '@/components/home/RecommendProduct'

import PreOrderProductSections from '../PreOrderProduct'

function Home() {
  // const { mutateAsync: createToken } = useMutation({
  //   mutationFn: createFirebaseTokenApi.fn,
  //   mutationKey: [createFirebaseTokenApi.mutationKey],
  // })

  // useEffect(() => {
  //   ;(async () => {
  //     const data = await createToken()
  //     console.log('=================data===================')
  //     console.log(data)
  //     console.log('====================================')
  //     if (data.data.token) {
  //       try {
  //         await signInWithCustomToken(auth, data.data.token)

  //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //       } catch (error) {
  //         console.log('====================================')
  //         console.log(error)
  //         console.log('====================================')
  //       }
  //     }
  //   })()
  // }, [createToken])
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto sm:px-4 px-2 py-8">
        <div className="w-full lg:px-28 md:px-16 sm:px-4 px-0 space-y-16">
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
