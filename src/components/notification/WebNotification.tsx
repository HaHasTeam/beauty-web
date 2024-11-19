import { Bell } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import emptyNotification from '@/assets/images/EmptyInbox.png'
import logo from '@/assets/images/logo.png'
import configs from '@/config'

import Empty from '../empty/Empty'

type Notification = {
  id: number
  message: string
  url: string
}

type WebNotificationProps = {
  notifications: Notification[]
  notificationCount: number
  className?: string
  style?: React.CSSProperties
  onNotificationClick?: (id: number) => void
}

const WebNotification: React.FC<WebNotificationProps> = ({
  notifications = [],
  notificationCount = 0,
  className,
  style,
  onNotificationClick,
}) => {
  const { t } = useTranslation()
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  // Toggle dropdown visibility
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen)

  // Handle click on individual notification
  const handleNotificationClick = (id: number) => {
    if (onNotificationClick) {
      onNotificationClick(id) // Trigger custom click handler
    }
    setDropdownOpen(false) // Close dropdown after click
  }

  return (
    <div className={`relative z-50 ${className}`} style={style}>
      {/* Bell Icon with Badge */}
      <div className="relative cursor-pointer" onClick={toggleDropdown}>
        <Bell className="text-gray-700" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </div>

      {/* Notification Dropdown */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-md z-10">
          {notifications.length > 0 ? (
            <>
              {notifications.map((notification) => (
                <Link to={notification.url} key={notification.id}>
                  <div
                    onClick={() => handleNotificationClick(notification.id)}
                    className="flex gap-2 align-middle text-black text-sm p-3 cursor-pointer hover:bg-gray-100 rounded-md"
                  >
                    <div className="h-6 w-6">
                      <img src={logo} className="object-contain" />
                    </div>
                    <div>{notification.message}</div>
                  </div>
                </Link>
              ))}
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
        </div>
      )}
    </div>
  )
}

export default WebNotification
