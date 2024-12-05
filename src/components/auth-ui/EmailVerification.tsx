import { useQuery } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { CircleHelpIcon, LoaderCircle } from 'lucide-react'
import { MdMarkEmailRead } from 'react-icons/md'
import { SiMinutemailer } from 'react-icons/si'
import { Navigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { emailContact } from '@/config/contants'
import routes from '@/config/routes'
import { activateAccountApi } from '@/network/api/api'
import { useStore } from '@/store/store'
import { TEmailDecoded } from '@/types'

const EmailVerification = () => {
  const queryParams = new URLSearchParams(window.location.search)
  const email = queryParams.get('email')
  const code = queryParams.get('code')
  const { authData } = useStore(
    useShallow((state) => ({
      authData: state.authData,
    })),
  )
  const accountId = code ? jwtDecode<TEmailDecoded>(code).accountId : undefined

  const { data: activateAccountData, isFetching: isActivatingAccount } = useQuery({
    queryKey: ['activateAccount', accountId],
    queryFn: async () => {
      return activateAccountApi({ accountId })
    },
    enabled: !!accountId,
  })
  console.log('activateAccountData', activateAccountData)

  if (!authData && !email && !code) {
    return <Navigate to={routes.signIn} replace />
  }
  if (!authData) {
    return <Navigate to={routes.signIn} replace />
  }

  if (activateAccountData) {
    return <Navigate to={routes.home} replace />
  }

  if (accountId) {
    return (
      <div className="my-auto mb-auto  flex flex-col  md:max-w-full lg:max-w-[420px] items-center gap-4 ">
        {!isActivatingAccount ? (
          <LoaderCircle size={150} className="p-4 rounded-full bg-green-100 text-green-500 animate-spin" />
        ) : (
          <MdMarkEmailRead size={150} className="p-4 rounded-full bg-green-100 text-green-500 shadow-xl" />
        )}
        <a
          className="text-2xl flex items-center gap-2 font-thin py-2 bg-green-100 rounded-3xl px-8 cursor-pointer flex-col"
          href="https://mail.google.com/mail/u/0/#inbox"
        >
          {!isActivatingAccount ? 'Verification in progress' : 'Email Verified'}
        </a>
        <div className="flex items-center gap-2 mt-10">
          <CircleHelpIcon size={30} />
          <h2 className="text-lg font-extralight flex-1">
            Your email has been verified. Please wait while we redirect you to the dashboard. Contact{' '}
            <a
              href={`mailto:${emailContact}`}
              className="text-primary underline p-0.5 px-2 font-semibold text-sm rounded-3xl"
            >
              {emailContact}
            </a>{' '}
            if you need help.
          </h2>
        </div>
      </div>
    )
  }
  if (email) {
    return (
      <div className="my-auto mb-auto  flex flex-col  md:max-w-full lg:max-w-[420px] items-center gap-4 ">
        <MdMarkEmailRead size={150} className="p-4 rounded-full bg-green-100 text-green-500 shadow-xl" />
        <a
          className="text-2xl flex items-center gap-2 font-thin py-2 bg-green-100 rounded-3xl px-8 cursor-pointer flex-col"
          href="https://mail.google.com/mail/u/0/#inbox"
        >
          <span className="capitalize dark:text-black">Email Verification</span>
          <div className="flex gap-2 ">
            <SiMinutemailer size={30} className="p-1 rounded-full bg-green-500 animate-pulse text-white" />
            <span className="text-sm p-1 px-2 bg-green-500 text-white rounded-3xl shadow-md">{email}</span>
          </div>
        </a>
        <div className="flex items-center gap-2 mt-10">
          <CircleHelpIcon size={30} />
          <h2 className="text-lg font-extralight flex-1">
            Hi there!, to complete your registration, please check your <b className="underline text-sm">{email}</b>{' '}
            inbox. Contact{' '}
            <a
              href={`mailto:${emailContact}`}
              className="text-primary underline p-0.5 px-2 font-semibold text-sm rounded-3xl"
            >
              {emailContact}
            </a>{' '}
            if you need help.
          </h2>
        </div>
      </div>
    )
  }
}

export default EmailVerification
