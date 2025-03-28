'use client'

import {
  IconArrowLeft,
  IconMaximize,
  IconMenu2,
  IconMessageCircle,
  IconMinimize,
  IconPaperclip,
  IconPlus,
  IconSearch,
  IconSend,
  IconX,
} from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/store'
import type { Chat, Message } from '@/types/chat'
import { RoleEnum } from '@/types/enum'
import { auth } from '@/utils/firebase/auth'
import { createChat, getChat, listenToChatMessages, listenToChats, sendMessage } from '@/utils/firebase/chat-service'
import { formatMessageTime, formatRelativeTime } from '@/utils/time'

interface PendingChatInfo {
  customerId: string
  customerName: string
  customerEmail: string
  customerRole: RoleEnum
  brandId: string
  brandName: string
  brandLogo?: string
}

export default function ChatPage() {
  const { t } = useTranslation()
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
  const [userChats, setUserChats] = useState<Chat[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [pendingChatInfo, setPendingChatInfo] = useState<PendingChatInfo | null>(null)
  const [isNewChat, setIsNewChat] = useState(false)

  // Check if we're on mobile
  const isMobile = useMediaQuery('(max-width: 768px)')

  // Auto-close sidebar on mobile when a chat is selected
  useEffect(() => {
    if (isMobile && chatId && chatId !== 'new') {
      setSidebarOpen(false)
    }
  }, [chatId, isMobile])

  // Set initial sidebar state based on screen size and chat selection
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(!chatId || chatId === 'new')
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile, chatId])

  useEffect(() => {
    if (!user && !userSystem) {
      navigate('/signin')
    }
  }, [navigate, user, userSystem])

  // Setup fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (chatContainerRef.current?.requestFullscreen) {
        chatContainerRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`)
        })
      }
    }
  }

  // Handle going back to previous screen
  const handleGoBack = () => {
    navigate(-1) // Navigate back to previous page in history
  }

  // Auto-focus input when chat is selected
  useEffect(() => {
    if (chatId && chatId !== 'new' && !isMobile) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [chatId, isMobile])

  // Handle viewport resize for mobile keyboards
  useEffect(() => {
    const handleResize = () => {
      // On mobile, when keyboard opens, scroll to bottom
      if (isMobile) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isMobile])

  // Replace the current useEffect for fetching user chats with this:
  useEffect(() => {
    const setupChatListener = () => {
      if (!userSystem) return () => {}

      // Use the real-time listener instead of one-time fetch
      const unsubscribe = listenToChats(
        userSystem.id,
        userSystem.role,
        userSystem.brands && userSystem.brands.length > 0 ? userSystem.brands[0].id : undefined,
        (updatedChats) => {
          // Sort chats by last message time (newest first)
          const sortedChats = [...updatedChats].sort((a, b) => {
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

          setUserChats(sortedChats)
          setLoading(false)
        },
      )

      return unsubscribe
    }

    const unsubscribe = setupChatListener()
    return () => unsubscribe()
  }, [userSystem])

  // Handle the "new" chat route
  useEffect(() => {
    if (id === 'new') {
      setIsNewChat(true)

      try {
        const pendingChatData = localStorage.getItem('pendingChat')
        if (!pendingChatData) {
          navigate('/dashboard')
          return
        }

        const chatInfo = JSON.parse(pendingChatData) as PendingChatInfo
        setPendingChatInfo(chatInfo)

        // Create a temporary chat object for UI display
        setChat({
          id: 'new',
          customerId: chatInfo.customerId,
          customerName: chatInfo.customerName,
          customerEmail: chatInfo.customerEmail,
          brandId: chatInfo.brandId,
          brandName: chatInfo.brandName,
          brandLogo: chatInfo.brandLogo,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastMessageTime: new Date().toISOString(),
          lastMessage: null,
          status: 'pending',
          userMessageCount: 0,
          messageCount: 0,
        } as Chat)
      } catch (error) {
        console.error('Error parsing pending chat:', error)
        navigate('/dashboard')
      }
    } else {
      setIsNewChat(false)
      setPendingChatInfo(null)
    }
  }, [id, navigate])

  // Fetch existing chat data (for non-new chats)
  useEffect(() => {
    const fetchChatData = async () => {
      if (chatId && chatId !== 'new' && user) {
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

    if (!isNewChat) {
      fetchChatData()
    }
  }, [chatId, navigate, user, userSystem?.role, userSystem?.id, userSystem?.brands, isNewChat])

  // Listen for messages (only for existing chats)
  useEffect(() => {
    if (chatId && chatId !== 'new') {
      const unsubscribe = listenToChatMessages(chatId, (updatedMessages) => {
        setMessages(updatedMessages)
      })

      return () => unsubscribe()
    }
  }, [chatId])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Modified handleSendMessage for new chats with better handling
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !userSystem) return

    setSending(true)
    try {
      // If this is a new chat, create it first
      if (isNewChat && pendingChatInfo) {
        const { customerId, customerName, customerEmail, brandId, brandName, brandLogo } = pendingChatInfo

        // Create the chat
        const newChatId = await createChat(customerId, customerName, customerEmail, brandId, brandName, brandLogo)

        // Send the message to the new chat
        await sendMessage(newChatId, userSystem.id, userSystem.email, userSystem.role, newMessage.trim())

        // Clear the pending chat from localStorage
        localStorage.removeItem('pendingChat')

        // Navigate to the actual chat
        navigate(`/chat/${newChatId}`, { replace: true })

        // The chat list will update automatically through the listener
      } else if (chatId && chatId !== 'new') {
        // Normal message sending for existing chats
        await sendMessage(chatId, userSystem.id, userSystem.email, userSystem.role, newMessage.trim())

        // The chat list will update automatically through the listener
      }

      setNewMessage('')

      // Ensure we scroll to the bottom after sending
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setSending(false)
    }
  }

  const focusMessageInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const filteredChats = userChats.filter((chat) => {
    const searchTerm = searchQuery.toLowerCase()
    const otherPartyName =
      userSystem?.role === RoleEnum.CUSTOMER ? chat.brandName.toLowerCase() : chat.customerName.toLowerCase()

    return (
      otherPartyName.includes(searchTerm) || (chat.lastMessage && chat.lastMessage.toLowerCase().includes(searchTerm))
    )
  })

  if (!userSystem) {
    return <LoadingContentLayer />
  }

  return (
    <div
      ref={chatContainerRef}
      className={cn(
        'flex flex-col bg-gray-50 dark:bg-gray-900',
        isFullscreen ? 'fixed inset-0 z-50' : 'h-[calc(100vh-4rem)]',
      )}
    >
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Chat List */}
        <div
          className={cn(
            'border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out',
            isMobile ? (sidebarOpen ? 'w-full absolute inset-0 z-20' : 'w-0 hidden') : 'w-80',
          )}
        >
          <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-secondary text-secondary-foreground flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGoBack}
              className="mr-2 text-secondary-foreground hover:bg-secondary-foreground/10"
            >
              <IconArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold flex-1">{t('chat.inbox')}</h1>
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="text-secondary-foreground hover:bg-secondary-foreground/10 md:hidden"
              >
                <IconX className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t('chat.search.placeholder')}
                className="pl-9 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Chat List */}
          <ScrollArea className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-20">
                <LoadingContentLayer />
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">{t('chat.empty.noChats')}</div>
            ) : (
              <div>
                {filteredChats.map((chatItem) => {
                  const isActive = chatItem.id === chatId
                  const otherPartyName =
                    userSystem.role === RoleEnum.CUSTOMER ? chatItem.brandName : chatItem.customerName
                  const otherPartyAvatar = userSystem.role === RoleEnum.CUSTOMER ? chatItem.brandLogo : undefined

                  return (
                    <div
                      key={chatItem.id}
                      className={cn(
                        'p-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700',
                        isActive && 'bg-primary/10 border-l-4 border-l-primary',
                      )}
                      onClick={() => navigate(`/chat/${chatItem.id}`)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={otherPartyAvatar ?? undefined} alt={otherPartyName} />
                          <AvatarFallback className={isActive ? 'bg-primary text-primary-foreground' : ''}>
                            {otherPartyName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline gap-2">
                            <h3
                              className={cn(
                                'font-medium truncate max-w-[120px]',
                                isActive && 'text-primary font-semibold',
                              )}
                            >
                              {otherPartyName}
                            </h3>
                            {chatItem.lastMessageTime && (
                              <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                                {formatRelativeTime(chatItem.lastMessageTime)}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {userSystem.role !== RoleEnum.CUSTOMER && (
                              <span className="font-medium mr-1">{t('chat.messageStatus.you')}:</span>
                            )}
                            {chatItem.lastMessage || t('chat.noMessages.title')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Right Side - Chat Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 relative">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-primary text-primary-foreground">
            <div className="flex items-center max-w-7xl mx-auto w-full">
              {isMobile && !sidebarOpen ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="mr-2 text-primary-foreground hover:bg-primary-foreground/10 md:hidden"
                >
                  <IconMenu2 className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleGoBack}
                  className="mr-2 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <IconArrowLeft className="h-5 w-5" />
                </Button>
              )}

              {chat && (
                <>
                  <Avatar className="h-10 w-10 mr-3 flex-shrink-0 border-2 border-primary-foreground/20">
                    <AvatarImage
                      src={userSystem.role === RoleEnum.CUSTOMER ? (chat.brandLogo ?? undefined) : undefined}
                      alt={userSystem.role === RoleEnum.CUSTOMER ? chat.brandName : chat.customerName}
                    />
                    <AvatarFallback>
                      {userSystem.role === RoleEnum.CUSTOMER ? chat.brandName.charAt(0) : chat.customerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold truncate">
                      {userSystem.role === RoleEnum.CUSTOMER ? chat.brandName : chat.customerName}
                    </h2>
                    <p className="text-sm text-primary-foreground/80 truncate">
                      {userSystem.role === RoleEnum.CUSTOMER ? t('chat.roles.brandSupport') : t('chat.roles.customer')}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFullscreen}
                      className="text-primary-foreground hover:bg-primary-foreground/10"
                      title={isFullscreen ? t('chat.fullscreen.exit') : t('chat.fullscreen.enter')}
                    >
                      {isFullscreen ? <IconMinimize className="h-5 w-5" /> : <IconMaximize className="h-5 w-5" />}
                    </Button>
                  </div>
                </>
              )}

              {!chat && !isMobile && (
                <div className="flex items-center justify-between w-full">
                  <h2 className="font-semibold">{t('chat.empty.selectChat')}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="text-primary-foreground hover:bg-primary-foreground/10"
                    title={isFullscreen ? t('chat.fullscreen.exit') : t('chat.fullscreen.enter')}
                  >
                    {isFullscreen ? <IconMinimize className="h-5 w-5" /> : <IconMaximize className="h-5 w-5" />}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Messages Area */}
          {chat ? (
            <>
              <ScrollArea className="flex-1 p-2 sm:p-4 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-3xl mx-auto">
                  {isNewChat ? (
                    <div className="flex flex-col items-center justify-center h-full py-10 sm:py-20">
                      <div className="text-center max-w-md px-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <IconSend className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2 text-primary">
                          {t('chat.newChat.startConversation')}
                        </h2>
                        <p className="text-muted-foreground mb-6">
                          {t('chat.newChat.sendMessageToBegin', { brandName: chat.brandName })}
                        </p>
                        <Button onClick={focusMessageInput} className="bg-primary hover:bg-primary/90">
                          {t('chat.newChat.newMessage')}
                        </Button>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-10 sm:py-20">
                      <div className="text-center max-w-md px-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <IconSend className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2 text-primary">{t('chat.noMessages.title')}</h2>
                        <p className="text-muted-foreground mb-6">{t('chat.noMessages.description')}</p>
                        <Button onClick={focusMessageInput} className="bg-primary hover:bg-primary/90">
                          {t('chat.noMessages.newMessage')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 py-2">
                      {messages.map((message) => {
                        const isCurrentUser = message.senderId === userSystem.id
                        const messageTime = formatMessageTime(message.timestamp)

                        return (
                          <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            {!isCurrentUser && (
                              <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0 hidden sm:block">
                                <AvatarImage
                                  src={
                                    userSystem.role === RoleEnum.CUSTOMER ? (chat.brandLogo ?? undefined) : undefined
                                  }
                                  alt={userSystem.role === RoleEnum.CUSTOMER ? chat.brandName : chat.customerName}
                                />
                                <AvatarFallback>
                                  {userSystem.role === RoleEnum.CUSTOMER
                                    ? chat.brandName.charAt(0)
                                    : chat.customerName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={cn(
                                'max-w-[85%] sm:max-w-[70%] break-words px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-sm',
                                isCurrentUser
                                  ? 'bg-primary text-primary-foreground rounded-tr-none'
                                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none',
                              )}
                            >
                              <div className="text-sm">{message.content}</div>
                              <div className={cn('text-xs mt-1 opacity-70', isCurrentUser ? 'text-right' : '')}>
                                {messageTime}
                              </div>
                            </div>
                            {isCurrentUser && (
                              <Avatar className="h-8 w-8 ml-2 mt-1 flex-shrink-0 hidden sm:block">
                                <AvatarFallback className="bg-primary/20 text-primary">
                                  {userSystem.email.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        )
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Message Input - Fixed at bottom */}
              <div className="p-2 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky bottom-0 left-0 right-0 z-10">
                <div className="max-w-3xl mx-auto">
                  <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-9 w-9 flex-shrink-0 text-primary hover:bg-primary/10 hidden sm:flex"
                    >
                      <IconPlus className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-9 w-9 flex-shrink-0 text-primary hover:bg-primary/10"
                    >
                      <IconPaperclip className="h-5 w-5" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t('chat.input.placeholder')}
                        disabled={sending}
                        className="pr-10 py-2 min-h-[44px] focus-visible:ring-primary"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="icon"
                      disabled={sending || !newMessage.trim()}
                      className="rounded-full h-9 w-9 flex-shrink-0 bg-primary hover:bg-primary/90"
                    >
                      <IconSend className="h-5 w-5" />
                    </Button>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center px-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconMessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-primary">{t('chat.empty.selectChat')}</h2>
                <p className="text-gray-500 mb-6">{t('chat.empty.selectChatDescription')}</p>
                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  {t('chat.empty.backToDashboard')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
