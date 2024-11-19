import { Fingerprint } from 'lucide-react'
import { Link } from 'react-router-dom'

import AuthUI from '@/components/auth/AuthUI'
import { Button } from '@/components/ui/button'

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/10 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Fingerprint className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Forgot password?</h1>
          <p className="text-sm text-muted-foreground">Enter your email for instructions.</p>
        </div>
        <div className="space-y-4">
          <AuthUI />
        </div>
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Sign in with email and password
          </Button>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
