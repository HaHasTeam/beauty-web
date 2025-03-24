'use client'

import { formatDistanceToNow } from 'date-fns'

import { Chat } from '@/types/chat'
import { RoleEnum } from '@/types/enum'
import { IUser } from '@/types/user'

interface ChatListProps {
  chats: Chat[]
  onChatSelect: (chatId: string) => void
  currentUser: IUser
}

export default function ChatList({ chats, onChatSelect, currentUser }: ChatListProps) {
  if (chats.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400 text-center py-4">No chats found</p>
  }

  return (
    <div className="space-y-2">
      {chats.map((chat) => {
        // Check if this chat is assigned to the current staff member
        const isAssigned = currentUser?.role === RoleEnum.MANAGER && chat.assignedTo === currentUser.id

        return (
          <div
            key={chat.id}
            className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              isAssigned ? 'border-primary/50 bg-primary/5' : ''
            }`}
            onClick={() => onChatSelect(chat.id)}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium">
                {chat.customerName}
                {isAssigned && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">Assigned</span>
                )}
              </h3>
              {chat.lastMessageTime && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(chat.lastMessageTime), { addSuffix: true })}
                </span>
              )}
            </div>
            {chat.lastMessage && (
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">{chat.lastMessage}</p>
            )}
            {chat.unreadCount && chat.unreadCount > 0 && (
              <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">
                {chat.unreadCount} new
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
