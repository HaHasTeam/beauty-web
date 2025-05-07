import { Fingerprint } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import AuthUI from '@/components/auth/AuthUI'
import { Button } from '@/components/ui/button'
import configs from '@/config'
import routes from '@/config/routes'

const ForgotPassword = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/10 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Fingerprint className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('forgotPasswordTitle')}</h1>
          <p className="text-sm text-muted-foreground">{t('forgotPasswordInstructions')}</p>
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
              <span className="bg-background px-2 text-muted-foreground">{t('orDivider')}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={() => navigate(routes.signIn)}>
            {t('signInWithEmailPassword')}
          </Button>
        </div>
        <div className="text-center text-sm">
          {t('noAccountQuestion')}{' '}
          <Link to={configs.routes.signUp} className="font-semibold text-primary hover:underline">
            {t('signUpLink')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
