import { Bell, Heart, Home, Lock, LogOutIcon, Package, Ticket, User, Wallet } from 'lucide-react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/ui/button'
import configs from '@/config'
import { useStore } from '@/store/store'

function AccountLayout() {
  const { unAuthenticate } = useStore(useShallow((state) => ({ unAuthenticate: state.unAuthenticate })))
  const navigate = useNavigate()
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] max-w-7xl mx-auto">
      <div className="hidden border-r  md:block">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" to={configs.routes.profile}>
              <User className="h-6 w-6" />
              <span>account name</span>
            </Link>
          </div>
          <div className="flex-1 px-3">
            <div className="space-y-1 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Tài Khoản Của Tôi</h2>
              <Button
                variant="ghost"
                className="w-full justify-start font-semibold text-primary"
                onClick={() => {
                  navigate(configs.routes.profile)
                }}
              >
                <User className="mr-2 h-4 w-4" />
                Hồ Sơ
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Wallet className="mr-2 h-4 w-4" />
                Ngân Hàng
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate(configs.routes.profileAddress)
                }}
              >
                <Home className="mr-2 h-4 w-4" />
                Địa Chỉ
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate(configs.routes.profilePassword)
                }}
              >
                <Lock className="mr-2 h-4 w-4" />
                Đổi Mật Khẩu
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate(configs.routes.profileWishlist)
                }}
              >
                <Heart className="mr-2 h-4 w-4" />
                wishlist
              </Button>
            </div>
            <div className="space-y-1 py-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate(configs.routes.profileOrder)
                }}
              >
                <Package className="mr-2 h-4 w-4" />
                Đơn Hàng Của Tôi
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate(configs.routes.profileNotification)
                }}
              >
                <Bell className="mr-2 h-4 w-4" />
                Thông Báo
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate(configs.routes.profileVoucher)
                }}
              >
                <Ticket className="mr-2 h-4 w-4" />
                Kho Voucher
              </Button>

              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => {
                  console.log('đăng xuất')
                  unAuthenticate()
                }}
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  )
}

export default AccountLayout
