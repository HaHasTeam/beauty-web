'use client'

import { formatDistanceToNow } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStore } from '@/store/store'
import { Chat, Message } from '@/types/chat'
import { RoleEnum } from '@/types/enum'
import { auth } from '@/utils/firebase/auth'
import { getChat, listenToChatMessages, sendMessage } from '@/utils/firebase/chat-service'

export default function ChatPage() {
  const [user] = useAuthState(auth)
  const { userSystem } = useStore(
    useShallow((state) => {
      return {
        userSystem: state.user,
      }
    }),
  )

  const { id } = useParams<{ id: string }>()
  const chatId = id || ''
  const [chat, setChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user && !userSystem) {
      navigate('/signin')
    }
  }, [navigate, user, userSystem])

  useEffect(() => {
    const fetchChatData = async () => {
      if (chatId && user) {
        try {
          const chatData = await getChat(chatId)
          if (!chatData) {
            navigate('/dashboard')
            return
          }

          // Check if user has access to this chat
          const hasAccess =
            (userSystem?.role === RoleEnum.CUSTOMER && chatData.customerId === userSystem?.id) ||
            (userSystem?.role === RoleEnum.MANAGER &&
              userSystem?.brands &&
              userSystem.brands.length > 0 &&
              chatData.brandId === userSystem.brands[0].id) ||
            (userSystem?.role === RoleEnum.STAFF &&
              userSystem?.brands &&
              userSystem.brands.length > 0 &&
              chatData.brandId === userSystem.brands[0].id) // Staff can access all brand chats

          if (!hasAccess) {
            navigate('/dashboard')
            return
          }

          setChat(chatData)
        } catch (err) {
          console.error('Error fetching chat:', err)
          navigate('/dashboard')
        }
      }
    }

    fetchChatData()
  }, [chatId, navigate, user, userSystem?.role, userSystem?.id, userSystem?.brands])

  useEffect(() => {
    if (chatId) {
      const unsubscribe = listenToChatMessages(chatId, (updatedMessages) => {
        console.log('===============updatedMessages=====================')
        console.log(updatedMessages)
        console.log('====================================')
        setMessages(updatedMessages)
      })

      return () => unsubscribe()
    }
  }, [chatId])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !userSystem || !chat) return

    setSending(true)
    try {
      await sendMessage(chatId, userSystem.id, userSystem.email, userSystem.role, newMessage.trim())
      setNewMessage('')
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setSending(false)
    }
  }

  if (!userSystem || !chat) {
    return <LoadingContentLayer />
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mr-2">
              Back
            </Button>
            <h1 className="text-xl font-semibold">
              {userSystem.role === RoleEnum.CUSTOMER ? `Chat with ${chat.brandName}` : `Chat with ${chat.customerName}`}
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        <div className="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-y-auto max-h-[calc(100vh-240px)]">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No messages yet. Start the conversation!
            </p>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === userSystem.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.senderId === userSystem.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">
                      {message.senderName}
                      {message.senderRole !== RoleEnum.CUSTOMER &&
                        ` (${message.senderRole === RoleEnum.MANAGER ? 'Manager' : 'Staff'})`}
                    </div>
                    <div>{message.content}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="mt-4 flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={sending}
            className="flex-grow"
          />
          <Button type="submit" disabled={sending || !newMessage.trim()}>
            {sending ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </main>
    </div>
  )
}
