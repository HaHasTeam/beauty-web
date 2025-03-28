import type { Timestamp } from 'firebase/firestore'

import { RoleEnum } from './enum'

/**
 * Represents a chat between a customer and a brand
 */
export interface Chat {
  id: string
  customerId: string
  customerName: string
  customerEmail?: string
  brandId: string
  brandName: string
  brandLogo?: string | null
  createdAt: Timestamp | string | number
  updatedAt: Timestamp | string | number
  lastMessageTime: Timestamp | string | number
  lastMessage: string | null
  status: 'pending' | 'active' | 'closed'
  userMessageCount: number
  messageCount: number
  ttl?: Timestamp
  assignedTo?: string
}
/**
 * Represents a message in a chat
 */
export interface Message {
  id: string
  chatId: string
  senderId: string
  senderName: string
  senderRole: RoleEnum
  content: string
  timestamp: Timestamp | number | string
}
