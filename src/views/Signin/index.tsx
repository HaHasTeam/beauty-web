import { ChevronRight, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import Hero01 from '@/assets/images/hero01.png'
import OrVector from '@/assets/images/orVector.png'
import OrVector02 from '@/assets/images/orVector02.png'
import { Icons } from '@/components/Icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center p-4 relative">
      {/* <h1 className="text-5xl font-bold text-[#FFA07A] mb-6 absolute top-10 left-50% ">Allure</h1> */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 relative bg-blend-color-burn">
            <div className="absolute  top-4 right-4 bg-white px-2 py-1 rounded text-sm flex cursor-pointer">
              Back to shopping <ChevronRight className="text-[#FFA07A]" />
            </div>
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
            <h2 className="text-2xl font-medium mb-2 text-center text-[#FFA07A]">Welcome to Allure</h2>
            <p className="text-gray-500 mb-6 text-center">Unleash your inner beauty. Log in now.</p>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" placeholder="Email" className="w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="">
                  <div className="relative">
                    <Input type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full pr-10" />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-xs sm:text-sm text-[#FFA07A] hover:underline block text-right mt-1"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <Button className="w-full bg-[#FFA07A] hover:bg-[#FF8C5A] text-white">Log in</Button>
            </form>
            <div className="mt-6 text-center">
              <div className="flex items-baseline justify-center gap-2">
                <img src={OrVector} alt="vector" />
                <p className="text-sm text-gray-600 mb-4">OR</p>
                <img src={OrVector02} alt="vector" />
              </div>
              <a
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
                <Link to="/signup" className="text-[#FFA07A] hover:underline">
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
