'use client'

import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import ImageWithFallback from '@/components/ImageFallback'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useStore } from '@/store/store'

export default function Profile() {
  const { t } = useTranslation()
  const { isAuthenticated, user } = useStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
    })),
  )

  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [gender, setGender] = useState(user?.gender?.toLowerCase() || 'male')

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('profile.notAuthenticated')}</AlertTitle>
          <AlertDescription>{t('profile.pleaseLogin')}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1 p-6">
        <Card className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-semibold">{t('profile.myProfile')}</h3>
              <p className="text-sm text-gray-500">{t('profile.profileDescription')}</p>
            </div>
            {user?.status && (
              <Badge className={user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-500'}>{user.status}</Badge>
            )}
          </div>
          <div className="grid gap-6 md:grid-cols-[1fr_200px]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t('profile.username')}</Label>
                <Input
                  id="username"
                  value={user?.username || ''}
                  placeholder={t('profile.usernamePlaceholder')}
                  disabled
                />
                <p className="text-sm text-gray-500">{t('profile.usernameNote')}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('profile.firstName')}</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={t('profile.firstNamePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('profile.lastName')}</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={t('profile.lastNamePlaceholder')}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('profile.email')}</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      placeholder={t('profile.emailPlaceholder')}
                      disabled
                    />
                    {user?.isEmailVerify && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="shrink-0 text-primary">
                    {t('profile.change')}
                  </Button>
                </div>
                {user?.isEmailVerify && <p className="text-xs text-green-500">{t('profile.emailVerified')}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('profile.phone')}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="phone"
                    type="tel"
                    value={user?.phone || ''}
                    placeholder={t('profile.phonePlaceholder')}
                    disabled
                  />
                  <Button variant="outline" className="shrink-0 text-primary">
                    {t('profile.change')}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('profile.gender')}</Label>
                <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">{t('profile.male')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">{t('profile.female')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">{t('profile.other')}</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">{t('profile.dob')}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="dob"
                    type="text"
                    value={user?.dob || ''}
                    placeholder={t('profile.dobPlaceholder')}
                    disabled
                  />
                  <Button variant="outline" className="shrink-0 text-primary">
                    {t('profile.change')}
                  </Button>
                </div>
              </div>

              <Button className="bg-[#ee4d2d] hover:bg-[#ee4d2d]/90">{t('profile.save')}</Button>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-32 w-32">
                  <ImageWithFallback
                    fallback={fallBackImage}
                    alt={t('profile.avatar')}
                    className="rounded-full object-cover"
                    src={user?.avatar || '/placeholder.svg'}
                  />
                </div>
                <Button variant="outline">{t('profile.chooseImage')}</Button>
                <div className="text-center text-sm text-gray-500">
                  <p>{t('profile.fileSizeLimit')}</p>
                  <p>{t('profile.fileFormat')}</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">{t('profile.role')}</p>
                <Badge variant="outline" className="mt-1">
                  {user?.role || 'CUSTOMER'}
                </Badge>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">{t('profile.createdAt')}</p>
                <p className="font-medium text-sm">{user?.createdAt}</p>
              </div>
              {user?.addresses && user.addresses.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 text-center mb-2">{t('profile.addresses')}</p>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {user.addresses.map((address, index) => (
                      <div key={index} className="text-xs p-2 border rounded">
                        {address.fullAddress}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
