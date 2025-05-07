import AuthUI from '@/components/auth/AuthUI'

function ChangePassword() {
  return (
    <div className="p-6 flex-1">
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
