import AuthUI from '@/components/auth/AuthUI'

function ChangePassword() {
  return (
    <div className="flex items-start justify-center mt-[60px] px-10 w-full">
      <div className="w-full space-y-6 flex-1">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cập nhật mật khẩu</h1>
        </div>
        <AuthUI />
      </div>
    </div>
  )
}

export default ChangePassword
