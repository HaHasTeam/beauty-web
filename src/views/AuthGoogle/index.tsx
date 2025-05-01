import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import configs from '@/config'
import { createFirebaseTokenApi } from '@/network/apis/firebase'
import { useStore } from '@/store/store'
import { signInWithToken } from '@/utils/firebase/auth-service'

function AuthGoogle() {
  const location = useLocation()
  const UrlParams = new URLSearchParams(location.search)
  const accessToken = UrlParams.get('accessToken') || ''
  const refreshToken = UrlParams.get('refreshToken') || ''
  const navigate = useNavigate()

  const { authenticate, setFirebaseToken } = useStore(
    useShallow((state) => ({
      authenticate: state.setAuthState,
      setFirebaseToken: state.setFirebaseToken,
    })),
  )

  const { mutateAsync: createToken, isPending: isLoading } = useMutation({
    mutationFn: createFirebaseTokenApi.fn,
    mutationKey: [createFirebaseTokenApi.mutationKey],
  })

  useEffect(() => {
    async function handleAuthentication() {
      try {
        // Check if both tokens exist
        if (!accessToken || !refreshToken) {
          console.error('Missing access token or refresh token')
          // Navigate to sign-in page if tokens are missing
          navigate(configs.routes.signIn)
          return
        }

        // Authenticate with the tokens
        authenticate({
          isAuthenticated: true,
          authData: {
            accessToken,
            refreshToken,
          },
        })

        // Create and set Firebase token
        const dataFirebase = await createToken()

        if (dataFirebase?.data?.token) {
          await signInWithToken(dataFirebase.data.token)
          setFirebaseToken(dataFirebase.data.token)

          // Navigate to home page
          navigate(configs.routes.home)
        } else {
          console.error('Failed to get Firebase token')
          navigate(configs.routes.signIn)
        }
      } catch (error) {
        console.error('Authentication error:', error)
        navigate(configs.routes.signIn)
      }
    }

    // Call the function
    handleAuthentication()
  }, [accessToken, refreshToken, authenticate, createToken, setFirebaseToken, navigate])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <p>Authenticating...</p>
      {accessToken && <p>Access Token: {accessToken.substring(0, 10)}...</p>}
      {refreshToken && <p>Refresh Token: {refreshToken.substring(0, 10)}...</p>}
    </div>
  )
}

export default AuthGoogle
