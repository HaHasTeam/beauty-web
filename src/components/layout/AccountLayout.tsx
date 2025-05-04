import { Bell, Calendar, Flag, Home, Lock, LogOutIcon, Package, Ticket, User, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import configs from '@/config'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/store'

function AccountLayout() {
  const { unAuthenticate, user } = useStore(
    useShallow((state) => ({ unAuthenticate: state.unAuthenticate, user: state.user })),
  )
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  // Define navigation items
  const accountMenuItems = [
    {
      title: t('account.profile'),
      icon: <User className="mr-3 h-5 w-5" />,
      path: configs.routes.profile,
    },
    {
      title: t('account.walletAndTransactions'),
      icon: <Wallet className="mr-3 h-5 w-5" />,
      path: configs.routes.profileWallet,
    },
    {
      title: t('account.reports'),
      icon: <Flag className="mr-3 h-5 w-5" />,
      path: configs.routes.profileReport,
    },
    {
      title: t('account.address'),
      icon: <Home className="mr-3 h-5 w-5" />,
      path: configs.routes.profileAddress,
    },
    {
      title: t('account.changePassword'),
      icon: <Lock className="mr-3 h-5 w-5" />,
      path: configs.routes.profilePassword,
    },
  ]

  const serviceMenuItems = [
    {
      title: t('services.myOrders'),
      icon: <Package className="mr-3 h-5 w-5" />,
      path: configs.routes.profileOrder,
    },
    {
      title: t('services.myAppointments'),
      icon: <Calendar className="mr-3 h-5 w-5" />,
      path: configs.routes.profileBookings,
    },
    {
      title: t('services.notifications'),
      icon: <Bell className="mr-3 h-5 w-5" />,
      path: configs.routes.profileNotification,
    },
    {
      title: t('services.voucherStorage'),
      icon: <Ticket className="mr-3 h-5 w-5" />,
      path: configs.routes.profileVoucher,
    },
  ]

  // Check if a menu item is active
  const isActive = (path: string) => location.pathname === path

  // Navigation component for both desktop and mobile
  const AccountNavigation = () => (
    <ScrollArea className="flex h-full flex-col pb-4">
      <div className="flex h-[70px] items-center px-5 bg-gradient-to-r from-primary/80 to-primary/50 shadow-md">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src={user?.avatar || undefined} alt={user?.username || 'User'} />
            <AvatarFallback className="bg-white text-primary font-bold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-white">{user?.username}</p>
            <p className="text-xs text-white/80">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="space-y-1 py-1">
          <h3 className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider px-1">
            {t('account.title')}
          </h3>
          {accountMenuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                'w-full justify-start text-sm font-medium px-3 py-2.5 mb-0.5 relative rounded-md transition-all duration-200 hover:bg-muted/50',
                isActive(item.path)
                  ? 'bg-gradient-to-r from-primary/10 to-transparent text-primary font-semibold'
                  : 'hover:translate-x-0.5',
              )}
              onClick={() => navigate(item.path)}
            >
              <span
                className={cn(
                  'relative z-10 flex items-center transition-transform duration-200',
                  isActive(item.path) ? 'scale-105' : 'group-hover:scale-105',
                )}
              >
                <span
                  className={cn(
                    'flex-shrink-0 mr-2.5 transition-colors duration-200',
                    isActive(item.path) ? 'text-primary' : '',
                  )}
                >
                  {item.icon}
                </span>
                {item.title}
              </span>
              {isActive(item.path) && (
                <div className="absolute right-2 h-full flex items-center">
                  <div className="w-1 h-1 rounded-full bg-primary"></div>
                </div>
              )}
            </Button>
          ))}
        </div>

        <Separator className="my-3 bg-muted/60" />

        <div className="space-y-1 py-1">
          <h3 className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider px-1">
            {t('services.title')}
          </h3>
          {serviceMenuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                'w-full justify-start text-sm font-medium px-3 py-2.5 mb-0.5 relative rounded-md transition-all duration-200 hover:bg-muted/50',
                isActive(item.path)
                  ? 'bg-gradient-to-r from-primary/10 to-transparent text-primary font-semibold'
                  : 'hover:translate-x-0.5',
              )}
              onClick={() => navigate(item.path)}
            >
              <span
                className={cn(
                  'relative z-10 flex items-center transition-transform duration-200',
                  isActive(item.path) ? 'scale-105' : 'group-hover:scale-105',
                )}
              >
                <span
                  className={cn(
                    'flex-shrink-0 mr-2.5 transition-colors duration-200',
                    isActive(item.path) ? 'text-primary' : '',
                  )}
                >
                  {item.icon}
                </span>
                {item.title}
              </span>
              {isActive(item.path) && (
                <div className="absolute right-2 h-full flex items-center">
                  <div className="w-1 h-1 rounded-full bg-primary"></div>
                </div>
              )}
            </Button>
          ))}
        </div>

        <Separator className="my-3 bg-muted/60" />

        <Button
          variant="ghost"
          className="w-full justify-start text-sm font-medium px-3 py-2.5 mt-2 text-destructive hover:bg-destructive/10 transition-colors duration-200 rounded-md"
          onClick={() => {
            unAuthenticate()
          }}
        >
          <span className="flex-shrink-0 mr-2.5 text-destructive">
            <LogOutIcon className="h-5 w-5" />
          </span>
          {t('account.logout')}
        </Button>
      </div>
    </ScrollArea>
  )

  return (
    <div className="flex min-h-screen bg-background max-w-7xl mx-auto w-full">
      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden lg:block lg:w-[260px] sticky top-0 h-screen">
        <div className="h-full bg-card mr-4 shadow-lg rounded-r-lg overflow-hidden">
          <AccountNavigation />
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-md">
        <div className="flex justify-between items-center p-2 px-4">
          <Button
            variant="ghost"
            className={cn(
              'flex flex-col items-center py-1.5 h-auto text-xs rounded-md transition-all duration-200',
              isActive(configs.routes.profile) ? 'text-primary font-medium' : 'hover:text-primary',
            )}
            onClick={() => navigate(configs.routes.profile)}
          >
            <User className="h-5 w-5 mb-1" />
            {t('mobileNav.account')}
          </Button>

          <Button
            variant="ghost"
            className={cn(
              'flex flex-col items-center py-1.5 h-auto text-xs rounded-md transition-all duration-200',
              isActive(configs.routes.profileOrder) ? 'text-primary font-medium' : 'hover:text-primary',
            )}
            onClick={() => navigate(configs.routes.profileOrder)}
          >
            <Package className="h-5 w-5 mb-1" />
            {t('mobileNav.orders')}
          </Button>

          <Button
            variant="ghost"
            className={cn(
              'flex flex-col items-center py-1.5 h-auto text-xs rounded-md transition-all duration-200',
              isActive(configs.routes.profileNotification) ? 'text-primary font-medium' : 'hover:text-primary',
            )}
            onClick={() => navigate(configs.routes.profileNotification)}
          >
            <Bell className="h-5 w-5 mb-1" />
            {t('mobileNav.notifications')}
          </Button>

          <Button
            variant="ghost"
            className={cn(
              'flex flex-col items-center py-1.5 h-auto text-xs rounded-md transition-all duration-200',
              isActive(configs.routes.profileVoucher) ? 'text-primary font-medium' : 'hover:text-primary',
            )}
            onClick={() => navigate(configs.routes.profileVoucher)}
          >
            <Ticket className="h-5 w-5 mb-1" />
            {t('mobileNav.vouchers')}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:pl-0 pb-16 lg:pb-0">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
