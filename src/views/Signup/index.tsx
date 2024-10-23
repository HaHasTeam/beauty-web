import { ChevronRight, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import Hero01 from '@/assets/images/hero01.png'
import OrVector from '@/assets/images/orVector.png'
import OrVector02 from '@/assets/images/orVector02.png'
import { Icons } from '@/components/Icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)

  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formValues, setFormValues] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submitted with values:', formValues)
    // Here you would typically send the form data to your backend
  }
  return (
    <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center p-4 relative">
      {/* <h1 className="text-5xl font-bold text-[#FFA07A] mb-6 absolute top-10 left-50% ">Allure</h1> */}
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
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
            <p className="text-gray-500 mb-6 text-center">
              Enter your details below to create your account and get started{' '}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input
                    type="text"
                    id="firstname"
                    name="firstname"
                    value={formValues.firstname}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={formValues.lastname}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formValues.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formValues.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formValues.acceptTerms}
                  onCheckedChange={(checked) => setFormValues((prev) => ({ ...prev, acceptTerms: checked as boolean }))}
                />
                <Label htmlFor="acceptTerms" className="text-sm">
                  I accept the{' '}
                  <Link to="/terms" className="text-[#FFA07A] hover:underline">
                    Terms and Conditions
                  </Link>
                </Label>
              </div>
              <Button type="submit" className="w-full bg-[#FFA07A] hover:bg-[#FF8C5A] text-white">
                Register
              </Button>
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
                Already have an account?{' '}
                <Link to="/signup" className="text-[#FFA07A] hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
