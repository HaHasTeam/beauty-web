import { Bell, CreditCard, Home, Lock, Package, Settings, User, Wallet } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

import { Button } from '@/components/ui/button'

function AccountLayout() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] max-w-7xl mx-auto">
      <div className="hidden border-r bg-gray-100/40 lg:block">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" to="#">
              <User className="h-6 w-6" />
              <span>g40i0070kd</span>
            </Link>
          </div>
          <div className="flex-1 px-3">
            <div className="space-y-1 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Tài Khoản Của Tôi</h2>
              <Button variant="ghost" className="w-full justify-start font-semibold text-primary">
                <User className="mr-2 h-4 w-4" />
                Hồ Sơ
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Wallet className="mr-2 h-4 w-4" />
                Ngân Hàng
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Địa Chỉ
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Lock className="mr-2 h-4 w-4" />
                Đổi Mật Khẩu
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Cài Đặt Thông Báo
              </Button>
            </div>
            <div className="space-y-1 py-2">
              <Button variant="ghost" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Đơn Mua
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Bell className="mr-2 h-4 w-4" />
                Thông Báo
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                Kho Voucher
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
