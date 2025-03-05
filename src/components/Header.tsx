import { CircleUserRound, HelpCircle, Menu, ShoppingCart, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/ui/button'
import configs from '@/config'
import useCartStore from '@/store/cart'
import { useStore } from '@/store/store'
import { ProjectInformationEnum } from '@/types/enum'

import LanguageSwitcher from './LanguageSwitcher'
import WebNotification from './notification/WebNotification'
import SearchBar from './search-bar/SearchBar'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

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
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, isLoading, authData, user } = useStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      authData: state.authData,
      user: state.user,
    })),
  )
  const { cartItems } = useCartStore()
  const totalItems = Object.values(cartItems).reduce((acc, items) => acc + items.length, 0)
  console.log(user)
  return (
    <header className="w-full bg-white relative shadow-lg">
      <div className="">
        <div className="px-4 flex items-center justify-between py-2 text-sm">
          <div className="flex space-x-4">
            <Link to={configs.routes.sellLanding} className="font-semibold">
              {t('sell.action')}
            </Link>
            <Link
              to={
                configs.externalLink.brandManagement +
                `?accessToken=${authData?.accessToken}&refreshToken=${authData?.refreshToken}`
              }
              replace
              className="border-l border-secondary px-3 font-semibold"
            >
              {t('professional.action')}
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to={configs.routes.helpCenter} className="flex gap-2 items-center text-black h-8 w-full px-2">
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm">{t('helpCenter.name')}</span>
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
        <div className="px-2 md:px-8 flex justify-between py-4 border-t border-secondary">
          <Link to={configs.routes.home} className="text-3xl font-bold text-primary hidden md:block">
            {ProjectInformationEnum.name}
          </Link>
          <SearchBar />
          {/* desktop menu */}
          <div className="md:flex gap-3 hidden items-center justify-center">
            <WebNotification
              notifications={notifications}
              notificationCount={notifications.length}
              onNotificationClick={handleNotificationClick}
            />
            {!isLoading && isAuthenticated ? (
              <Link
                to={configs.routes.profile}
                className="flex gap-1 justify-start text-base"
                onClick={() => {
                  setMenuOpen(false)
                }}
              >
                {user ? (
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback>{user.username?.charAt(0).toUpperCase() ?? 'A'}</AvatarFallback>
                  </Avatar>
                ) : (
                  <CircleUserRound />
                )}
                <span>{t('header.profile')}</span>
              </Link>
            ) : (
              <Link to={configs.routes.signIn} className="p-2 rounded-md text-background-foreground">
                {t('header.loginOrRegister')}
              </Link>
            )}

            <Link to={configs.routes.cart}>
              <div className="relative cursor-pointer">
                <ShoppingCart />
                {cartItems && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 rounded-full bg-primary text-white text-xs w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="sr-only">{t('header.shoppingCart')}</span>
            </Link>
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
          <div className="p-4 space-y-2">
            <div className="p-2 flex gap-2 items-center hover:bg-primary/10 rounded-md">
              <Link className="w-full flex gap-2" to={configs.routes.notification}>
                <WebNotification
                  notifications={notifications}
                  notificationCount={notifications.length}
                  onNotificationClick={handleNotificationClick}
                />
                <span> {t('header.notification')}</span>
              </Link>
            </div>
            <div className="w-full p-2 hover:bg-primary/10 rounded-md flex gap-2">
              <Link
                to={configs.routes.cart}
                className="w-full flex gap-2 items-center justify-start"
                onClick={() => {
                  setMenuOpen(false)
                }}
              >
                <div className="relative cursor-pointer">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItems && Object.keys(cartItems)?.length > 0 && (
                    <span className="absolute -top-1 -right-1 rounded-full bg-primary text-white text-xs w-4 h-4 flex items-center justify-center">
                      {Object.keys(cartItems)?.length}
                    </span>
                  )}
                </div>
                <span>{t('header.shoppingCart')}</span>
              </Link>
            </div>
            {!isLoading && isAuthenticated ? (
              <Link
                to={configs.routes.profile}
                className="w-full flex gap-2 items-center justify-start p-2 hover:bg-primary/10 rounded-md "
                onClick={() => {
                  setMenuOpen(false)
                }}
              >
                {user ? (
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback>{user.username?.charAt(0).toUpperCase() ?? 'A'}</AvatarFallback>
                  </Avatar>
                ) : (
                  <CircleUserRound className="h-5 w-5" />
                )}

                <span>{t('header.profile')}</span>
              </Link>
            ) : (
              <Link
                to={configs.routes.signIn}
                className="w-full text-background-foreground"
                onClick={() => {
                  setMenuOpen(false)
                }}
              >
                {t('header.loginOrRegister')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
