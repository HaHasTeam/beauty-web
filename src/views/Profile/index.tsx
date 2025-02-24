import { useTranslation } from 'react-i18next'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import ImageWithFallback from '@/components/ImageFallback'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function Profile() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col ">
      <main className="flex-1 p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold">{t('profile.myProfile')}</h3>
            <p className="text-sm text-gray-500">{t('profile.profileDescription')}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-[1fr_200px]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t('profile.username')}</Label>
                <Input id="username" placeholder={t('profile.usernamePlaceholder')} disabled />
                <p className="text-sm text-gray-500">{t('profile.usernameNote')}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">{t('profile.name')}</Label>
                <Input id="name" placeholder={t('profile.namePlaceholder')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('profile.email')}</Label>
                <div className="flex items-center gap-2">
                  <Input id="email" type="email" placeholder={t('profile.emailPlaceholder')} disabled />
                  <Button variant="outline" className="shrink-0 text-primary">
                    {t('profile.change')}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('profile.phone')}</Label>
                <div className="flex items-center gap-2">
                  <Input id="phone" type="tel" placeholder={t('profile.phonePlaceholder')} disabled />
                  <Button variant="outline" className="shrink-0 text-primary">
                    {t('profile.change')}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('profile.gender')}</Label>
                <RadioGroup defaultValue="male" className="flex gap-4">
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
                <Label htmlFor="birthday">{t('profile.birthday')}</Label>
                <div className="flex items-center gap-2">
                  <Input id="birthday" type="text" placeholder={t('profile.birthdayPlaceholder')} disabled />
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
                    src="/placeholder.svg"
                  />
                </div>
                <Button variant="outline">{t('profile.chooseImage')}</Button>
                <div className="text-center text-sm text-gray-500">
                  <p>{t('profile.fileSizeLimit')}</p>
                  <p>{t('profile.fileFormat')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
