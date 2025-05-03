import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Hero01 from '@/assets/images/hero01.png'
import OrVector from '@/assets/images/orVector.png'
import OrVector02 from '@/assets/images/orVector02.png'
import AuthUI from '@/components/auth/AuthUI'
import { Icons } from '@/components/Icons'
import { buttonVariants } from '@/components/ui/button'
import configs from '@/config'
import { getOauthGoogleUrl } from '@/config/contants'
import { cn } from '@/lib/utils'

const SignIn = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center p-4 relative">
      {/* <h1 className="text-5xl font-bold text-[#FFA07A] mb-6 absolute top-10 left-50% ">Allure</h1> */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 relative bg-blend-color-burn">
            <Link
              to={configs.routes.home}
              className="absolute  top-4 right-4 bg-white px-2 py-1 rounded text-sm flex cursor-pointer"
            >
              {t('button.backToShopping')} <ChevronRight className="text-primary" />
            </Link>
            <img
              src={Hero01}
              alt="Beauty product application"
              width={600}
              height={600}
              className="object-cover w-full h-full pointer-events-none"
            />
            {/* <div className="absolute bottom-4 right-1/2 bg-white px-2 py-1 rounded text-sm">
              Be beautiful right now!
            </div> */}
          </div>
          <div className="md:w-1/2 p-8">
            <h2 className="text-2xl font-medium mb-2 text-center text-primary">{t('welcome')}</h2>
            <p className="text-gray-500 mb-6 text-center">Unleash your inner beauty. Log in now.</p>

            {/* form sign in here  */}
            <AuthUI />
            <div className="mt-6 text-center">
              <div className="flex items-baseline justify-center gap-2">
                <img src={OrVector} alt="vector" />
                <p className="text-sm text-gray-600 mb-4">OR</p>
                <img src={OrVector02} alt="vector" />
              </div>
              <a
                href={getOauthGoogleUrl()}
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'w-full mb-4 flex items-center justify-center cursor-pointer',
                )}
              >
                <Icons.GoogleIcon />
                Continue with Google
              </a>
              <p className="mt-4 text-sm text-gray-600">
                Haven't an account yet?{' '}
                <Link to={configs.routes.signUp} className="text-primary hover:underline">
                  Create an Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
