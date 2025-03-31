import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  type Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { Bell, LogIn } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import emptyNotification from '@/assets/images/EmptyInbox.png'
import fallBackImage from '@/assets/images/fallBackImage.jpg'
import logo from '@/assets/images/logo.png'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import configs from '@/config'
import { useStore } from '@/store/store'
import { db } from '@/utils/firebase/firestore'

import Empty from '../empty/Empty'
import ImageWithFallback from '../ImageFallback'

type NotificationDto = {
  id: string
  accountIds: string[]
  body: string
  createdAt: Timestamp
  data: {
    message: string
    type: string
  }
  isRead: boolean
  title: string
  url?: string
}

type WebNotificationProps = {
  className?: string
  style?: React.CSSProperties
}

const WebNotification: React.FC<WebNotificationProps> = ({ className, style }) => {
  const { t } = useTranslation()
  const { user, isAuthenticated } = useStore(
    useShallow((state) => ({
      authData: state.authData,
      user: state.user,
      isAuthenticated: state.isAuthenticated,
    })),
  )
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationDto[]>([])
  const unsubscribeRef = useRef<(() => void) | null>(null)

  // Calculate unread notification count
  const notificationCount = notifications.filter((notification) => !notification.isRead).length

  // Load notifications from Firestore
  const loadNotification = useCallback(() => {
    if (!user?.id) return

    const notificationQuery = query(
      collection(db, 'notifications'),
      where('accountIds', 'array-contains', user.id),
      orderBy('createdAt', 'desc'),
      limit(100),
    )

    const unsubscribe = onSnapshot(notificationQuery, (querySnapshot) => {
      const fetchedNotifications: NotificationDto[] = []
      querySnapshot.forEach((doc) => {
        fetchedNotifications.push({ id: doc.id, ...doc.data() } as NotificationDto)
      })

      setNotifications(fetchedNotifications)
    })

    unsubscribeRef.current = unsubscribe
    return unsubscribe
  }, [user?.id])

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId)
      await updateDoc(notificationRef, {
        isRead: true,
      })
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Load notifications when component mounts
  useEffect(() => {
    const unsubscribe = loadNotification()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [loadNotification])

  // Handle click on individual notification
  const handleNotificationClick = (id: string) => {
    markAsRead(id)
    setDropdownOpen(false) // Close dropdown after click
  }

  // Format date for display
  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate()

    // If today, show time only
    const today = new Date()
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    // If this year, show month and day
    if (date.getFullYear() === today.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }

    // Otherwise show full date
    return date.toLocaleDateString()
  }

  // Get notification URL based on type
  const getNotificationUrl = (notification: NotificationDto) => {
    // If notification has a specific URL, use it
    if (notification.url) return notification.url

    // Otherwise determine URL based on notification type
    switch (notification.data?.type) {
      case 'TEST':
        return configs.routes.home
      default:
        return configs.routes.notification
    }
  }

  return (
    <div className={`relative z-50 ${className}`} style={style}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <div className="relative cursor-pointer">
            <Bell className="text-gray-700" />
            {isAuthenticated && notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 rounded-full bg-primary text-white text-xs w-4 h-4 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-0 max-h-[80vh] overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-semibold">{t('notification.title')}</h3>
          </div>

          {!isAuthenticated ? (
            <div className="p-6 flex flex-col items-center justify-center">
              <LogIn className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-center text-gray-600 mb-4">{t('notification.loginRequired')}</p>
              <Link
                to={configs.routes.signIn}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                {t('header.loginOrRegister')}
              </Link>
            </div>
          ) : notifications.length > 0 ? (
            <>
              <div className="max-h-[60vh] overflow-y-auto">
                {notifications.map((notification) => (
                  <Link to={getNotificationUrl(notification)} key={notification.id}>
                    <div
                      onClick={() => handleNotificationClick(notification.id)}
                      className={`flex gap-2 p-3 cursor-pointer hover:bg-gray-100 border-b border-gray-100 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                    >
                      <div className="h-10 w-10 flex-shrink-0">
                        <ImageWithFallback
                          src={logo || '/placeholder.svg'}
                          className="object-contain rounded-full"
                          fallback={fallBackImage}
                          alt="Notification"
                        />
                      </div>
                      <div className="flex flex-col flex-grow">
                        <div className="text-sm font-medium">{notification.title}</div>
                        <div className="text-sm">{notification.body}</div>
                        <div className="text-xs text-gray-500 mt-1">{formatDate(notification.createdAt)}</div>
                      </div>
                      {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full self-start mt-2"></div>}
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                to={configs.routes.notification}
                className="text-primary w-full flex justify-center align-middle text-sm font-semibold hover:bg-gray-100 p-3"
              >
                {t('notification.viewAll')}
              </Link>
            </>
          ) : (
            <Empty
              title={t('empty.notification.title')}
              description={t('empty.notification.description')}
              icon={emptyNotification}
            />
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default WebNotification
