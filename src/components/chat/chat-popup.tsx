/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { ChevronDown, ChevronUp, MessageCircle, Plus, Send, Settings, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { useStore } from '@/store/store'
import { TBrand } from '@/types/brand'
import { Chat, Message } from '@/types/chat'
import { RoleEnum } from '@/types/enum'
import { listenToChatMessages, listenToChats, sendMessage } from '@/utils/firebase/chat-service'
import { formatRelativeTime } from '@/utils/time'

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
            const timeA = a.lastMessageTime || 0
            const timeB = b.lastMessageTime || 0
            return timeB - timeA
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

  const toggleSettings = () => {
    setShowSettings(!showSettings)
    if (showSettings) {
      setSelectedChat(null)
    }
  }

  const togglePopupEnabled = () => {
    setSettings((prev) => ({
      ...prev,
      enabled: !prev.enabled,
    }))
  }

  const selectBrand = (brandId: string) => {
    setSelectedBrandId(brandId)
    setSelectedChat(null)
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
            isMinimized ? 'h-14' : 'w-80 sm:w-96'
          }`}
          style={{ maxHeight: isMinimized ? '3.5rem' : '500px' }}
        >
          {/* Chat header */}
          <div className="bg-primary text-primary-foreground p-3 flex justify-between items-center">
            <div className="font-medium truncate flex items-center">
              {showSettings ? (
                'Chat Settings'
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
                (selectedBrandId && brands.find((b) => b.id === selectedBrandId)?.name) || 'Recent Conversations'
              )}
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleSettings}
                className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
              >
                <Settings size={16} />
              </button>
              <button
                onClick={toggleChat}
                className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
              >
                {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <button onClick={closeChat} className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat content - only shown when not minimized */}
          {!isMinimized && (
            <div className="flex flex-col h-[calc(500px-3.5rem)]">
              {showSettings ? (
                // Settings panel
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="popup-enabled" className="text-base font-medium">
                          Enable Chat Popup
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Show the chat popup button on all pages
                        </p>
                      </div>
                      <Switch id="popup-enabled" checked={settings.enabled} onCheckedChange={togglePopupEnabled} />
                    </div>

                    <div>
                      <h3 className="text-base font-medium mb-2">Available Brands</h3>
                      <div className="space-y-2 mt-3">
                        {brands.length === 0 ? (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No brands available. Start a chat with a brand first.
                          </p>
                        ) : (
                          brands.map((brand) => (
                            <div
                              key={brand.id}
                              onClick={() => selectBrand(brand.id)}
                              className={`p-2 rounded cursor-pointer flex items-center justify-between ${
                                selectedBrandId === brand.id
                                  ? 'bg-primary/10 border border-primary/30'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              <span>{brand.name}</span>
                              {selectedBrandId === brand.id && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button
                        onClick={() => {
                          setShowSettings(false)
                          setSelectedChat(null)
                        }}
                        className="w-full"
                      >
                        Back to Chats
                      </Button>
                    </div>
                  </div>
                </div>
              ) : !selectedChat ? (
                // Brand chats list
                <div className="flex-1 overflow-y-auto p-2">
                  {!selectedBrandId || !chatsByBrand[selectedBrandId] || chatsByBrand[selectedBrandId].length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                      No conversations yet with this brand
                      <div className="mt-4">
                        <Button onClick={() => navigate('/new-chat')} size="sm" className="flex items-center">
                          <Plus size={16} className="mr-1" />
                          Start New Chat
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {chatsByBrand[selectedBrandId].map((chat) => (
                        <div
                          key={chat.id}
                          onClick={() => selectChat(chat)}
                          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <div className="font-medium">
                            {currentUser.role === 'customer' ? chat.brandName : chat.customerName}
                          </div>
                          {chat.lastMessage && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{chat.lastMessage}</div>
                          )}
                          {chat.lastMessageTime && (
                            <div className="text-xs text-gray-400 dark:text-gray-500">
                              {formatRelativeTime(chat.lastMessageTime)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Chat messages
                <>
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    <div className="text-center">
                      <Button variant="link" size="sm" onClick={viewFullChat}>
                        View full conversation
                      </Button>
                    </div>
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                        No messages yet. Start the conversation!
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
                              <div className="text-xs font-medium mb-1">
                                {message.senderName}
                                {message.senderRole !== RoleEnum.CUSTOMER &&
                                  ` (${message.senderRole === RoleEnum.MANAGER ? 'Manager' : 'Staff'})`}
                              </div>
                              <div className="text-sm">{message.content}</div>
                              <div className="text-xs mt-1 opacity-70">{formatRelativeTime(message.timestamp)}</div>
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
                        placeholder="Type a message..."
                        disabled={sending}
                        className="flex-1"
                      />
                      <Button type="submit" size="icon" disabled={sending || !newMessage.trim()} className="h-10 w-10">
                        <Send size={16} />
                      </Button>
                    </div>
                  </form>
                </>
              )}
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
