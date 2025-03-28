import { RoleEnum } from './enum'

export interface Message {
  id: string
  chatId: string
  senderId: string
  senderName: string
  senderRole: RoleEnum
  content: string
  timestamp: number
}

export interface Chat {
  id: string
  customerId: string
  customerName: string
  brandId: string
  brandName: string
  lastMessage?: string
  lastMessageTime?: number
  unreadCount?: number
  assignedTo?: string // ID of the brand staff/manager assigned to this chat
}
