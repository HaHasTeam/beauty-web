import { CircleUserRound, Menu, ShoppingCart, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/ui/button'
import configs from '@/config'
import { useStore } from '@/store/store'
import { ProjectInformationEnum } from '@/types/enum'

import LanguageSwitcher from './LanguageSwitcher'
import WebNotification from './notification/WebNotification'
import SearchBar from './search-bar/SearchBar'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export default function Header({ totalItems }: { totalItems: number }) {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, isLoading, user } = useStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      authData: state.authData,
      user: state.user,
    })),
  )

  return (
    <header className="w-full bg-white relative shadow-lg">
      <div>
        <div className="px-2 md:px-8 flex justify-between py-4 border-t border-secondary">
          <Link to={configs.routes.home} className="text-3xl font-bold text-primary hidden md:block">
            {ProjectInformationEnum.name}
          </Link>
          <SearchBar />
          {/* desktop menu */}
          <div className="md:flex gap-3 hidden items-center justify-center">
            <WebNotification
            // notifications={notifications}
            // notificationCount={notifications.length}
            // onNotificationClick={handleNotificationClick}
            />
            {!isLoading && isAuthenticated ? (
              <Link
                to={configs.routes.profile}
                className="flex gap-1 justify-start text-base items-center"
                onClick={() => {
                  setMenuOpen(false)
                }}
              >
                {user ? (
                  <Avatar className="w-5 h-5">
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
                {Number(totalItems) > 0 ? (
                  <span className="absolute -top-1 -right-1 rounded-full bg-primary text-white text-xs w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                ) : null}
              </div>
              <span className="sr-only">{t('header.shoppingCart')}</span>
            </Link>
            <LanguageSwitcher />
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
                <WebNotification />
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
                  {totalItems > 0 ? (
                    <span className="absolute -top-1 -right-1 rounded-full bg-primary text-white text-xs w-4 h-4 flex items-center justify-center">
                      {totalItems}
                    </span>
                  ) : null}
                </div>
                <span>{t('header.shoppingCart')}</span>
              </Link>
            </div>
            <div>
              {!isLoading && isAuthenticated ? (
                <Link
                  to={configs.routes.profile}
                  className="w-full flex gap-2 items-center justify-start p-2 hover:bg-primary/10 rounded-md "
                  onClick={() => {
                    setMenuOpen(false)
                  }}
                >
                  {user ? (
                    <Avatar className="h-5 w-5">
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
                  className="w-full text-background-foreground p-2"
                  onClick={() => {
                    setMenuOpen(false)
                  }}
                >
                  {t('header.loginOrRegister')}
                </Link>
              )}
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  )
}
