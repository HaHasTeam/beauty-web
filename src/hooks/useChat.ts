import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { useStore } from '@/store/store'
import { UserRoleEnum } from '@/types/role'

interface PendingChatInfo {
  customerId: string
  customerName: string
  customerEmail: string
  customerRole: UserRoleEnum | string
  brandId: string
  brandName: string
  brandLogo?: string
}

export function useChat() {
  const [isNavigating, setIsNavigating] = useState(false)
  const navigate = useNavigate()

  const { userSystem } = useStore(
    useShallow((state) => ({
      userSystem: state.user,
    })),
  )

  const startChat = async (brandId: string, brandName: string, brandLogo?: string) => {
    if (!userSystem) {
      navigate('/signin')
      return
    }

    setIsNavigating(true)

    try {
      // Store chat info in localStorage instead of creating it immediately
      const pendingChatInfo: PendingChatInfo = {
        customerId: userSystem.id,
        customerName: userSystem.email,
        customerEmail: userSystem.email,
        customerRole: userSystem.role,
        brandId,
        brandName,
        brandLogo,
      }

      localStorage.setItem('pendingChat', JSON.stringify(pendingChatInfo))

      // Navigate to the new chat page
      navigate('/chat/new')
    } catch (error) {
      console.error('Failed to prepare chat:', error)
      // You might want to show an error notification here
    } finally {
      setIsNavigating(false)
    }
  }

  return {
    startChat,
    isNavigating,
  }
}
