/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChevronDown, ChevronUp, Maximize, MessageCircle, Send, Settings, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { useStore } from '@/store/store'
import type { TBrand } from '@/types/brand'
import type { Chat, Message } from '@/types/chat'
import { listenToChatMessages, listenToChats, sendMessage } from '@/utils/firebase/chat-service'
import { formatMessageTime } from '@/utils/time'

import { Avatar, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'

// Create a local storage key for popup settings
const POPUP_SETTINGS_KEY = 'chat_popup_settings'

// Default settings
const defaultSettings = {
  enabled: true,
}

export function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState(defaultSettings)
  const [chatsByBrand, setChatsByBrand] = useState<Record<string, Chat[]>>({})
  const [brands, setBrands] = useState<TBrand[]>([])
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { t } = useTranslation()

  // Get user from Zustand store
  const { currentUser } = useStore(
    useShallow((state) => ({
      currentUser: state.user,
    })),
  )

  // Load settings from local storage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(POPUP_SETTINGS_KEY)
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error('Error parsing saved settings:', e)
      }
    }
  }, [])

  // Save settings to local storage when they change
  useEffect(() => {
    localStorage.setItem(POPUP_SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  // Fetch user's chats
  useEffect(() => {
    if (currentUser) {
      const unsubscribe = listenToChats(
        currentUser.id,
        currentUser.role,
        currentUser.brands?.[0]?.id || '',
        (updatedChats) => {
          // Sort chats by last message time (newest first)
          const sortedChats = [...updatedChats].sort((a, b) => {
            // Use the timestamp directly, formatRelativeTime will handle conversion
            const timeA = a.lastMessageTime || 0
            const timeB = b.lastMessageTime || 0

            // Convert to comparable numbers if they're not already
            const numA =
              typeof timeA === 'number'
                ? timeA
                : typeof timeA === 'object' && 'toDate' in timeA
                  ? timeA.toDate().getTime()
                  : new Date(timeA).getTime()

            const numB =
              typeof timeB === 'number'
                ? timeB
                : typeof timeB === 'object' && 'toDate' in timeB
                  ? timeB.toDate().getTime()
                  : new Date(timeB).getTime()

            return numB - numA
          })
          setChats(sortedChats)

          // Group chats by brand
          const chatGroups: Record<string, Chat[]> = {}
          const uniqueBrands = new Set<string>()

          sortedChats.forEach((chat) => {
            if (!chatGroups[chat.brandId]) {
              chatGroups[chat.brandId] = []
              uniqueBrands.add(chat.brandId)
            }
            chatGroups[chat.brandId].push(chat)
          })

          setChatsByBrand(chatGroups)

          // If we don't have a selected brand yet, select the first one
          if (!selectedBrandId && uniqueBrands.size > 0) {
            setSelectedBrandId(Array.from(uniqueBrands)[0])
          }

          // Fetch brand details for each unique brand
          Promise.all(
            Array.from(uniqueBrands).map(async (brandId) => {
              try {
                // This would be a function to get brand details
                // For now, we'll just create a simple object with the name from the first chat
                const brandChat = sortedChats.find((chat) => chat.brandId === brandId)
                return {
                  id: brandId,
                  name: brandChat?.brandName || 'Unknown Brand',
                  managerId: '',
                  staffIds: [],
                }
              } catch (error) {
                console.error('Error fetching brand details:', error)
                return null
              }
            }),
          ).then((brandDetails) => {
            setBrands(brandDetails.filter(Boolean) as any[])
          })
        },
      )

      return () => unsubscribe()
    }
  }, [currentUser, selectedBrandId])

  // Listen to messages for the selected chat
  useEffect(() => {
    if (selectedChat) {
      const unsubscribe = listenToChatMessages(selectedChat.id, (updatedMessages) => {
        setMessages(updatedMessages)
      })

      return () => unsubscribe()
    } else {
      setMessages([])
    }
  }, [selectedChat])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen && !isMinimized && !showSettings) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isMinimized, showSettings])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !currentUser || !selectedChat) return

    setSending(true)
    try {
      await sendMessage(selectedChat.id, currentUser.id, currentUser.email, currentUser.role, newMessage.trim())
      setNewMessage('')
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setSending(false)
    }
  }

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true)
      setIsMinimized(false)
      setShowSettings(false)
    } else {
      setIsMinimized(!isMinimized)
    }
  }

  const closeChat = () => {
    setIsOpen(false)
    setSelectedChat(null)
    setShowSettings(false)
  }

  const selectChat = (chat: Chat) => {
    setSelectedChat(chat)
    setIsMinimized(false)
    setShowSettings(false)
  }

  const viewFullChat = () => {
    if (selectedChat) {
      navigate(`/chat/${selectedChat.id}`)
    }
  }

  const backToChats = () => {
    setSelectedChat(null)
  }

  // const toggleSettings = () => {
  //   setShowSettings(!showSettings)
  //   if (showSettings) {
  //     setSelectedChat(null)
  //   }
  // }

  const togglePopupEnabled = () => {
    setSettings((prev) => ({
      ...prev,
      enabled: !prev.enabled,
    }))
  }

  const selectBrand = (brandId: string) => {
    setSelectedBrandId(brandId)

    // If there are chats for this brand, select the most recent one
    if (chatsByBrand[brandId] && chatsByBrand[brandId].length > 0) {
      selectChat(chatsByBrand[brandId][0])
    } else {
      // If no chats exist for this brand, just show the brand selected but no chat
      setSelectedChat(null)
    }
  }

  // Don't show the chat popup on the chat page
  if (window.location.pathname.includes('/chat/')) {
    return null
  }

  // Don't show for unauthenticated users or if disabled
  if (!currentUser || !settings.enabled) {
    // Still show the settings button if the user is authenticated
    if (currentUser) {
      return (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => {
              setIsOpen(true)
              setShowSettings(true)
              setIsMinimized(false)
            }}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full p-3 shadow-lg transition-colors"
          >
            <Settings size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      )
    }
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Chat popup */}
      {isOpen && (
        <div
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-2 transition-all duration-300 overflow-hidden ${
            isMinimized ? 'h-14' : 'w-[400px] sm:w-[500px]'
          }`}
          style={{ maxHeight: isMinimized ? '3.5rem' : '500px' }}
        >
          {/* Chat header */}
          <div className="bg-primary text-primary-foreground p-3 flex justify-between items-center">
            <div className="font-medium truncate flex items-center">
              {showSettings ? (
                t('chat.settings')
              ) : selectedChat ? (
                <>
                  <button
                    onClick={backToChats}
                    className="mr-2 p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
                  >
                    <ChevronUp className="rotate-90" size={16} />
                  </button>
                  {currentUser.role === 'customer' ? selectedChat.brandName : selectedChat.customerName}
                </>
              ) : (
                (selectedBrandId && brands.find((b) => b.id === selectedBrandId)?.name) || t('chat.recentConversations')
              )}
            </div>
            <div className="flex items-center space-x-1">
              {/* <button
                onClick={toggleSettings}
                className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
                title={t('chat.settings')}
              >
                <Settings size={16} />
              </button> */}
              <button
                onClick={toggleChat}
                className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
                title={isMinimized ? t('chat.expand') : t('chat.minimize')}
              >
                {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <button
                onClick={closeChat}
                className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
                title={t('chat.close')}
              >
                <X size={16} />
              </button>
              <button
                onClick={() => (selectedChat ? navigate(`/chat/${selectedChat.id}`) : navigate('/chat'))}
                className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
                title={t('chat.openFullChat')}
              >
                <Maximize size={16} />
              </button>
            </div>
          </div>

          {/* Chat content - only shown when not minimized */}
          {!isMinimized && (
            <div className="flex h-[calc(500px-3.5rem)]">
              {/* Left sidebar with chat icons */}
              <div className="w-16 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex flex-col">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    onClick={() => selectBrand(brand.id)}
                    className={`p-2 cursor-pointer flex flex-col items-center justify-center h-16 ${
                      selectedBrandId === brand.id
                        ? 'bg-primary/10 border-l-2 border-l-primary'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    title={brand.name}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback
                        className={selectedBrandId === brand.id ? 'bg-primary text-primary-foreground' : ''}
                      >
                        {brand.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs mt-1 truncate w-full text-center">
                      {brand.name.length > 6 ? `${brand.name.substring(0, 6)}...` : brand.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Right side with chat content */}
              <div className="flex-1 flex flex-col">
                {showSettings ? (
                  // Settings panel
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="popup-enabled" className="text-base font-medium">
                            {t('chat.enablePopup')}
                          </Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t('chat.enablePopupDescription')}</p>
                        </div>
                        <Switch id="popup-enabled" checked={settings.enabled} onCheckedChange={togglePopupEnabled} />
                      </div>

                      <div className="pt-4 border-t">
                        <Button
                          onClick={() => {
                            setShowSettings(false)
                            setSelectedChat(null)
                          }}
                          className="w-full"
                        >
                          {t('chat.backToChats')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : !selectedChat ? (
                  // Welcome message when no chat is selected
                  <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <MessageCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">{t('chat.welcome')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-xs">
                      {t('chat.selectBrandToChat')}
                    </p>
                    {/* {brands.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2 mt-2">
                        {brands.slice(0, 3).map((brand) => (
                          <Button
                            key={brand.id}
                            variant="outline"
                            size="sm"
                            onClick={() => selectBrand(brand.id)}
                            className="flex items-center gap-2"
                          >
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-xs">{brand.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{brand.name}</span>
                          </Button>
                        ))}
                      </div>
                    )} */}
                    <Button onClick={() => navigate('/chat/new')} className="mt-4">
                      {t('chat.startNewChat')}
                    </Button>
                  </div>
                ) : (
                  // Chat messages
                  <>
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      <div className="text-center">
                        <Button variant="link" size="sm" onClick={viewFullChat}>
                          {t('chat.viewFullConversation')}
                        </Button>
                      </div>
                      {messages.length === 0 ? (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                          {t('chat.noMessagesYet')}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg p-2 ${
                                  message.senderId === currentUser.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                              >
                                <div className="text-xs font-medium mb-1">{message.senderName}</div>
                                <div className="text-sm">{message.content}</div>
                                <div className="text-xs mt-1 opacity-70">{formatMessageTime(message.timestamp)}</div>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      )}
                    </div>

                    {/* Message input */}
                    <form onSubmit={handleSendMessage} className="p-2 border-t">
                      <div className="flex space-x-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder={t('chat.typePlaceholder')}
                          disabled={sending}
                          className="flex-1"
                        />
                        <Button
                          type="submit"
                          size="icon"
                          disabled={sending || !newMessage.trim()}
                          className="h-10 w-10"
                        >
                          <Send size={16} />
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-3 shadow-lg transition-colors"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  )
}
