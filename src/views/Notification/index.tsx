import { collection, doc, onSnapshot, orderBy, query, type Timestamp, updateDoc, where } from 'firebase/firestore'
import {
  AlertCircle,
  CheckCircle,
  CheckSquare,
  InboxIcon,
  PackageCheck,
  RefreshCcw,
  ShoppingBag,
  XCircle,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import emptyNotification from '@/assets/images/EmptyInbox.png'
import fallBackImage from '@/assets/images/fallBackImage.jpg'
import logo from '@/assets/images/logo.png'
import Empty from '@/components/empty/Empty'
import ImageWithFallback from '@/components/ImageFallback'
import configs from '@/config'
import { useStore } from '@/store/store'
import { db } from '@/utils/firebase/firestore'

export enum NotificationTypeEnum {
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  GROUP_BUYING_ORDER_SUCCESS = 'GROUP_BUYING_ORDER_SUCCESS',
  GROUP_BUYING_ORDER_FAILED = 'GROUP_BUYING_ORDER_FAILED',
  REFUND_APPROVED = 'REFUND_APPROVED',
  REFUND_SUCCESS = 'REFUND_SUCCESS',
  BRAND_RECEIVED_RETURN = 'BRAND_RECEIVED_RETURN',
}

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

const NotificationAttachmentsPage = () => {
  const { t } = useTranslation()
  const { user, isAuthenticated } = useStore(
    useShallow((state) => ({
      authData: state.authData,
      user: state.user,
      isAuthenticated: state.isAuthenticated,
    })),
  )
  const [notifications, setNotifications] = useState<NotificationDto[]>([])
  const [loading, setLoading] = useState(true)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  // Load notifications from Firestore
  const loadNotifications = useCallback(() => {
    if (!user?.id) return

    setLoading(true)
    const notificationQuery = query(
      collection(db, 'notifications'),
      where('accountIds', 'array-contains', user.id),
      orderBy('createdAt', 'desc'),
    )

    const unsubscribe = onSnapshot(notificationQuery, (querySnapshot) => {
      const fetchedNotifications: NotificationDto[] = []
      querySnapshot.forEach((doc) => {
        fetchedNotifications.push({ id: doc.id, ...doc.data() } as NotificationDto)
      })

      setNotifications(fetchedNotifications)
      setLoading(false)
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
    const unsubscribe = loadNotifications()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [loadNotifications])

  // Handle click on individual notification
  const handleNotificationClick = (id: string) => {
    markAsRead(id)
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

  //   // Get notification URL based on type
  //   const getNotificationUrl = (notification: NotificationDto) => {
  //     // If notification has a specific URL, use it
  //     if (notification.url) return notification.url

  //     // Otherwise determine URL based on notification type
  //     switch (notification.data?.type) {
  //       case NotificationTypeEnum.ORDER_CANCELLED:
  //       case NotificationTypeEnum.GROUP_BUYING_ORDER_SUCCESS:
  //       case NotificationTypeEnum.GROUP_BUYING_ORDER_FAILED:
  //         return configs.routes.orders
  //       case NotificationTypeEnum.REFUND_APPROVED:
  //       case NotificationTypeEnum.REFUND_SUCCESS:
  //       case NotificationTypeEnum.BRAND_RECEIVED_RETURN:
  //         return configs.routes.refunds
  //       default:
  //         return configs.routes.notification
  //     }
  //   }

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case NotificationTypeEnum.ORDER_CANCELLED:
        return <XCircle className="h-5 w-5 text-red-500" />
      case NotificationTypeEnum.GROUP_BUYING_ORDER_SUCCESS:
        return <CheckSquare className="h-5 w-5 text-green-500" />
      case NotificationTypeEnum.GROUP_BUYING_ORDER_FAILED:
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case NotificationTypeEnum.REFUND_APPROVED:
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case NotificationTypeEnum.REFUND_SUCCESS:
        return <RefreshCcw className="h-5 w-5 text-green-500" />
      case NotificationTypeEnum.BRAND_RECEIVED_RETURN:
        return <PackageCheck className="h-5 w-5 text-purple-500" />
      default:
        return <ShoppingBag className="h-5 w-5 text-gray-500" />
    }
  }

  // Get notification color based on type
  const getNotificationColor = (type: string) => {
    switch (type) {
      case NotificationTypeEnum.ORDER_CANCELLED:
        return 'bg-red-100 text-red-800'
      case NotificationTypeEnum.GROUP_BUYING_ORDER_SUCCESS:
        return 'bg-green-100 text-green-800'
      case NotificationTypeEnum.GROUP_BUYING_ORDER_FAILED:
        return 'bg-amber-100 text-amber-800'
      case NotificationTypeEnum.REFUND_APPROVED:
        return 'bg-blue-100 text-blue-800'
      case NotificationTypeEnum.REFUND_SUCCESS:
        return 'bg-green-100 text-green-800'
      case NotificationTypeEnum.BRAND_RECEIVED_RETURN:
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get notification type display name
  const getNotificationTypeName = (type: string) => {
    switch (type) {
      case NotificationTypeEnum.ORDER_CANCELLED:
        return t('notification.types.orderCancelled')
      case NotificationTypeEnum.GROUP_BUYING_ORDER_SUCCESS:
        return t('notification.types.groupBuyingSuccess')
      case NotificationTypeEnum.GROUP_BUYING_ORDER_FAILED:
        return t('notification.types.groupBuyingFailed')
      case NotificationTypeEnum.REFUND_APPROVED:
        return t('notification.types.refundApproved')
      case NotificationTypeEnum.REFUND_SUCCESS:
        return t('notification.types.refundSuccess')
      case NotificationTypeEnum.BRAND_RECEIVED_RETURN:
        return t('notification.types.brandReceivedReturn')
      default:
        return type
    }
  }

  // Calculate notification statistics
  const calculateNotificationStats = () => {
    const total = notifications.length
    const read = notifications.filter((n) => n.isRead).length
    const unread = total - read

    return { total, read, unread }
  }

  //   // Count notifications by type
  //   const countNotificationsByType = () => {
  //     const counts = {
  //       [NotificationTypeEnum.ORDER_CANCELLED]: 0,
  //       [NotificationTypeEnum.GROUP_BUYING_ORDER_SUCCESS]: 0,
  //       [NotificationTypeEnum.GROUP_BUYING_ORDER_FAILED]: 0,
  //       [NotificationTypeEnum.REFUND_APPROVED]: 0,
  //       [NotificationTypeEnum.REFUND_SUCCESS]: 0,
  //       [NotificationTypeEnum.BRAND_RECEIVED_RETURN]: 0,
  //       other: 0,
  //     }

  //     notifications.forEach((notification) => {
  //       const type = notification.data?.type
  //       if (type && Object.values(NotificationTypeEnum).includes(type as NotificationTypeEnum)) {
  //         counts[type as keyof typeof counts]++
  //       } else {
  //         counts.other++
  //       }
  //     })

  //     return counts
  //   }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">{t('notification.title')}</h1>
        <div className="p-6 flex flex-col items-center justify-center bg-white rounded-lg shadow-md w-full max-w-md">
          <p className="text-center text-gray-600 mb-4">{t('notification.loginRequired')}</p>
          <Link
            to={configs.routes.signIn}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            {t('header.loginOrRegister')}
          </Link>
        </div>
      </div>
    )
  }

  // Calculate stats
  const stats = calculateNotificationStats()
  //   const typeCounts = countNotificationsByType()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{t('notification.title')}</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Notification List Header with Stats */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{t('notification.list')}</h2>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <InboxIcon className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm font-medium">{stats.total}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium">{stats.read}</span>
                </div>
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm font-medium">{stats.unread}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notification List */}
          {notifications.length > 0 ? (
            <>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-200 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex gap-4">
                    <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center">
                      {notification.data?.type ? (
                        getNotificationIcon(notification.data.type)
                      ) : (
                        <ImageWithFallback
                          src={logo || '/placeholder.svg'}
                          className="object-contain rounded-full"
                          fallback={fallBackImage}
                          alt="Notification"
                        />
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium">{notification.title}</h3>
                        <span className="text-sm text-gray-500">{formatDate(notification.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{notification.body}</p>

                      {notification.url && (
                        <div className="mt-2">
                          <Link
                            to={notification.url}
                            className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="text-lg mr-1">📎</span>
                            {t('notification.viewDetails')}
                          </Link>
                        </div>
                      )}

                      {notification.data?.type && (
                        <div className="mt-1">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${getNotificationColor(notification.data.type)}`}
                          >
                            {getNotificationTypeName(notification.data.type)}
                          </span>
                        </div>
                      )}
                    </div>
                    {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full self-start mt-2"></div>}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="p-6">
              <Empty
                title={t('empty.notification.title')}
                description={t('empty.notification.description')}
                icon={emptyNotification}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationAttachmentsPage
