import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import EmailSignIn from '@/components/auth-ui/EmailSignIn'
import ForgotPassword from '@/components/auth-ui/ForgotPassword'
import PasswordSignIn from '@/components/auth-ui/PasswordSignIn'
import SignUp from '@/components/auth-ui/Signup'
import UpdatePassword from '@/components/auth-ui/UpdatePassword'

type Props = {
  viewProp: string
  allowEmail: boolean
  allowPassword: boolean
  allowOauth: boolean
  disableButton: boolean
}

// const AuthPaths = ['email_signin', 'sign-in', 'signup', 'forgot-password', 'update_password']

export default function AuthUI() {
  const viewProp = useLocation().pathname.split('/').pop()
  console.log('viewProp', viewProp)

  const props: Props = useMemo(() => {
    if (!viewProp)
      return { viewProp: '', allowEmail: false, allowPassword: false, allowOauth: false, disableButton: false }

    return {
      viewProp,
      allowEmail: viewProp === 'email_signin' || viewProp === 'sign-up' || viewProp === 'forgot-password',
      allowPassword: viewProp === 'sign-in' || viewProp === 'sign-up' || viewProp === 'email_signin',
      allowOauth:
        viewProp === 'email_signin' ||
        viewProp === 'signup' ||
        viewProp === 'forgot-password' ||
        viewProp === 'sign-in',
      disableButton: viewProp === 'email_signin' || viewProp === 'sign-up' || viewProp === 'forgot-password',
    }
  }, [viewProp])

  // useEffect(() => {
  //   if (!viewProp || !AuthPaths.includes(viewProp)) {
  //     window.location.href = '/auth/signin/password_signin'
  //   }
  // })

  return (
    <div className="  lg:max-w-[520px]  md:max-w-full">
      {props.viewProp === 'sign-in' && <PasswordSignIn />}
      {props.viewProp === 'email_signin' && (
        <EmailSignIn allowPassword={props.allowPassword} disableButton={props.disableButton} />
      )}
      {props.viewProp === 'forgot-password' && <ForgotPassword />}
      {props.viewProp === 'reset-pass' && <UpdatePassword />}
      {props.viewProp === 'sign-up' && <SignUp />}
    </div>
  )
}
