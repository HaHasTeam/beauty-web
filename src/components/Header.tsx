import { ChevronDown, HelpCircle, Search, ShoppingBag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import configs from '@/config'

import WebNotification from './notification/WebNotification'

export default function Header() {
  const notifications = [
    { id: 1, message: 'New comment on your post', url: 'post/:123' },
    { id: 2, message: 'You have a new follower', url: 'post/:123' },
    { id: 3, message: 'Your order has been shipped', url: 'post/:123' },
  ]

  const handleNotificationClick = (id: number) => {
    console.log(`Notification ${id} clicked`)
    // Perform any other action like marking as read or navigating
  }
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <header className="w-full bg-white">
      <div className="">
        <div className="px-4 flex items-center justify-between py-2 text-sm">
          <div className="flex space-x-4">
            <Link to={configs.routes.sellLanding} className="font-semibold">
              {t('sell.action')}
            </Link>
            <Link to={configs.routes.professionalLanding} className="border-l border-secondary px-3 font-semibold">
              {t('professional.action')}
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-black h-8 w-full px-2"
              onClick={() => navigate(configs.routes.helpCenter)}
            >
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm">{t('helpCenter.name')}</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <span className="text-sm">{t('language.english')}</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="px-4 flex items-center justify-between py-4 border-t border-secondary">
          <Link to={configs.routes.home} className="text-3xl font-bold text-primary">
            Allure
          </Link>
          <div className="flex-1 px-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input type="search" placeholder="Search..." className="w-full pl-10 pr-4" defaultValue="mask" />
            </div>
            <div className="mt-1 flex space-x-4 text-sm text-gray-500">
              <span>mask</span>
              <span>toner</span>
              <span>cushion</span>
              <span>lipstick</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <WebNotification
              notifications={notifications}
              notificationCount={notifications.length}
              className="text-blue-500"
              style={{ fontSize: '1.25rem' }}
              onNotificationClick={handleNotificationClick}
            />
            <Button
              variant="default"
              className="text-primary-foreground"
              onClick={() => navigate(configs.routes.signIn)}
            >
              {t('header.loginOrRegister')}
            </Button>

            <Button variant="ghost" size="icon" onClick={() => navigate(configs.routes.cart)}>
              <ShoppingBag className="h-6 w-6" />
              <span className="sr-only">{t('header.shoppingCart')}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
