import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function Profile() {
  return (
    <div className="flex flex-col ">
      <main className="flex-1 p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold">Hồ Sơ Của Tôi</h3>
            <p className="text-sm text-gray-500">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
          </div>
          <div className="grid gap-6 md:grid-cols-[1fr_200px]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input id="username" placeholder="g40i0070kd" disabled />
                <p className="text-sm text-gray-500">Tên Đăng nhập chỉ có thể thay đổi một lần</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Tên</Label>
                <Input id="name" placeholder="Phạm Công Minh" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2">
                  <Input id="email" type="email" placeholder="m********@gmail.com" disabled />
                  <Button variant="outline" className="shrink-0 text-primary">
                    Thay Đổi
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <div className="flex items-center gap-2">
                  <Input id="phone" type="tel" placeholder="*******67" disabled />
                  <Button variant="outline" className="shrink-0 text-primary">
                    Thay Đổi
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Giới tính</Label>
                <RadioGroup defaultValue="nam" className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nam" id="nam" />
                    <Label htmlFor="nam">Nam</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nu" id="nu" />
                    <Label htmlFor="nu">Nữ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="khac" id="khac" />
                    <Label htmlFor="khac">Khác</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthday">Ngày sinh</Label>
                <div className="flex items-center gap-2">
                  <Input id="birthday" type="text" placeholder="**/05/20**" disabled />
                  <Button variant="outline" className="shrink-0 text-primary">
                    Thay Đổi
                  </Button>
                </div>
              </div>
              <Button className="bg-[#ee4d2d] hover:bg-[#ee4d2d]/90">Lưu</Button>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-32 w-32">
                  <img alt="Avatar" className="rounded-full object-cover" src="/placeholder.svg" />
                </div>
                <Button variant="outline">Chọn Ảnh</Button>
                <div className="text-center text-sm text-gray-500">
                  <p>Dung lượng file tối đa 1 MB</p>
                  <p>Định dạng: .JPEG, .PNG</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
