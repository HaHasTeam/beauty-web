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

// const AuthPaths = ['email_signin', 'sign-in', 'signup', 'forgot_password', 'update_password']

export default function AuthUI() {
  const viewProp = useLocation().pathname.split('/').pop()
  console.log('viewProp', viewProp)

  const props: Props = useMemo(() => {
    if (!viewProp)
      return { viewProp: '', allowEmail: false, allowPassword: false, allowOauth: false, disableButton: false }

    return {
      viewProp,
      allowEmail: viewProp === 'email_signin' || viewProp === 'signup' || viewProp === 'forgot_password',
      allowPassword: viewProp === 'sign-in' || viewProp === 'signup' || viewProp === 'email_signin',
      allowOauth:
        viewProp === 'email_signin' ||
        viewProp === 'signup' ||
        viewProp === 'forgot_password' ||
        viewProp === 'sign-in',
      disableButton: viewProp === 'email_signin' || viewProp === 'signup' || viewProp === 'forgot_password',
    }
  }, [viewProp])

  // useEffect(() => {
  //   if (!viewProp || !AuthPaths.includes(viewProp)) {
  //     window.location.href = '/auth/signin/password_signin'
  //   }
  // })

  return (
    <div className="my-auto mb-auto mt-8 flex flex-col md:mt-[70px] md:max-w-full lg:mt-[130px] lg:max-w-[420px]">
      {props.viewProp === 'sign-in' && <PasswordSignIn />}
      {props.viewProp === 'email_signin' && (
        <EmailSignIn allowPassword={props.allowPassword} disableButton={props.disableButton} />
      )}
      {props.viewProp === 'forgot_password' && (
        <ForgotPassword allowEmail={props.allowEmail} disableButton={props.disableButton} />
      )}
      {props.viewProp === 'update_password' && <UpdatePassword />}
      {props.viewProp === 'signup' && <SignUp allowEmail={props.allowEmail} />}
    </div>
  )
}
