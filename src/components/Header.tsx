import { Bell, HelpCircle, Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import configs from '@/config'
import { ProjectInformationEnum } from '@/types/enum'

import LanguageSwitcher from './LanguageSwitcher'
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
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="w-full bg-white relative">
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
            <LanguageSwitcher />
          </div>
        </div>
        <div className="px-2 md:px-4 flex items-center justify-between py-4 border-t border-secondary">
          <Link to={configs.routes.home} className="text-3xl font-bold text-primary hidden md:block">
            {ProjectInformationEnum.name}
          </Link>
          <div className="flex-1 px-2 md:px-12">
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
          {/* desktop menu */}
          <div className="md:flex items-center space-x-3 hidden">
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
          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)} className={`transition-colors `}>
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute z-20 top-full left-0 w-full bg-white shadow-md border-t">
          <div className="p-4">
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate(configs.routes.notification)}>
                <Bell className="text-gray-700" />
                <span> {t('header.notification')}</span>
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="flex justify-start"
                onClick={() => {
                  setMenuOpen(false)
                  navigate(configs.routes.cart)
                }}
              >
                <ShoppingBag className="h-5 w-5" />
                <span>{t('header.shoppingCart')}</span>
              </Button>
            </div>
            <Button
              variant="default"
              className="w-full text-primary-foreground"
              onClick={() => {
                setMenuOpen(false)
                navigate(configs.routes.signIn)
              }}
            >
              {t('header.loginOrRegister')}
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
