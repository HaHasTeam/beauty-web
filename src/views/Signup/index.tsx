import { FaChevronLeft } from 'react-icons/fa'

import Hero01 from '@/assets/images/hero01.png'
import IconLogo from '@/assets/images/icon-logo.png'
import AuthUI from '@/components/auth/AuthUI'

const SignUp = () => {
  return (
    <div className="relative h-screen bg-secondary/20">
      <div className="mx-auto flex w-full flex-col justify-center px-5 pt-0 md:h-[unset] md:max-w-[66%] lg:h-[100vh] lg:max-w-[66%] lg:px-6 xl:pl-0 ">
        <a className="mt-5 w-fit text-zinc-950 dark:text-white" href="/">
          <div className="flex w-fit items-center lg:pl-0 lg:pt-0 xl:pt-0 hover:scale-110 transition-transform">
            <FaChevronLeft className="mr-3 h-[13px] w-[8px] text-primary dark:text-white" />
            <p className="ml-0 text-sm text-primary dark:text-white">Back to shopping</p>
          </div>
        </a>
        <AuthUI />
        <div className="absolute right-0 hidden h-full min-h-[100vh] xl:block xl:w-[50vw] 2xl:w-[44vw] rounded-bl-[450px] overflow-hidden">
          <img src={Hero01} className="w-full h-full  absolute right-0 left-0 object-cover   " alt="hero" />
          <div className="absolute flex h-full w-full flex-col items-end justify-center backdrop-brightness-50  bg-secondary/30">
            <div className={`mb-[100px] mt-8 flex w-full items-center justify-center `}>
              <div className="me-2 flex h-[76px] w-[76px] items-center justify-center  bg-white rounded-full ">
                <img src={IconLogo} alt="" className="object-cover rounded-full scale-125" />
              </div>
              <h5 className="text-4xl font-bold leading-5 text-white">Allure</h5>
            </div>
            <div className={`flex w-full flex-col items-center justify-center text-2xl font-bold text-white`}>
              <h4 className="mb-5 flex w-[600px] items-center justify-center rounded-md text-center text-2xl font-bold">
                "Allure is a premium e-commerce platform for beauty lovers. We offer certified beauty consultants,
                authentic products, and professional services to redefine your beauty journey. With trust, quality, and
                expertise, Allure helps young women embrace their unique beauty with confidence."
              </h4>
              <h5 className="text-xl font-medium leading-5 text-secondary">- Allure team -</h5>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </div>
  )
}

export default SignUp
