import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { getAllBrandsApi } from '@/network/apis/brand'
import { RoleEnum } from '@/types/enum'
import { createChat, sendMessage } from '@/utils/firebase/chat-service'

export default function NewChat() {
  const { user, isLoading } = useAuth()
  //   const [brands, setBrands] = useState([])
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [initialMessage, setInitialMessage] = useState('')
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()
  const { data: brands } = useQuery({
    queryKey: [getAllBrandsApi.queryKey],
    queryFn: getAllBrandsApi.fn,
  })
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/signin')
      } else if (user.role !== RoleEnum.CUSTOMER) {
        console.log('====================================')
        console.log(user)
        console.log('====================================')
      }
    }
  }, [isLoading, navigate, user])

  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedBrand || !initialMessage.trim() || !user) return

    setCreating(true)
    try {
      const selectedBrandData = (brands && brands.data.find((brand) => brand.id === selectedBrand)) || null
      if (!selectedBrandData) {
        throw new Error('Selected brand not found')
      }

      // Create the chat
      const chatId = await createChat(user.id, user.email, selectedBrandData.id, selectedBrandData.name)

      // Send the initial message
      await sendMessage(chatId, user.id, user.email, user.role, initialMessage.trim())

      // Navigate to the chat
      navigate(`/chat/${chatId}`)
    } catch (err) {
      console.error('Error creating chat:', err)
      setError('Failed to create chat')
      setCreating(false)
    }
  }

  if (isLoading || !user) {
    return <LoadingContentLayer />
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Start a New Chat</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <form onSubmit={handleCreateChat} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Select a Brand</Label>
              <select
                id="brand"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                required
              >
                <option value="">Select a brand</option>
                {brands &&
                  brands.data.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Initial Message</Label>
              <textarea
                id="message"
                value={initialMessage}
                onChange={(e) => setInitialMessage(e.target.value)}
                className="w-full p-2 border rounded-md bg-background min-h-[100px]"
                placeholder="How can we help you today?"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={creating || !selectedBrand || !initialMessage.trim()}>
              {creating ? 'Creating Chat...' : 'Start Chat'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
