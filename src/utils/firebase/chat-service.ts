import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'

import { Chat, Message } from '@/types/chat'

import { db } from './firestore'

// Chat functions
export const createChat = async (
  customerId: string,
  customerName: string,
  brandId: string,
  brandName: string,
): Promise<string> => {
  const chatRef = await addDoc(collection(db, 'chats'), {
    customerId,
    customerName,
    brandId,
    brandName,
    createdAt: serverTimestamp(),
    lastMessageTime: serverTimestamp(),
  })

  return chatRef.id
}

export const getChat = async (chatId: string): Promise<Chat | null> => {
  const chatDoc = await getDoc(doc(db, 'chats', chatId))
  if (!chatDoc.exists()) return null

  return { id: chatDoc.id, ...chatDoc.data() } as Chat
}

export const assignChatToStaff = async (chatId: string, staffId: string): Promise<void> => {
  await updateDoc(doc(db, 'chats', chatId), {
    assignedTo: staffId,
  })
}

export const getCustomerChats = async (customerId: string): Promise<Chat[]> => {
  const chatsQuery = query(
    collection(db, 'chats'),
    where('customerId', '==', customerId),
    orderBy('lastMessageTime', 'desc'),
  )

  const chatDocs = await getDocs(chatsQuery)
  return chatDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Chat)
}

export const getBrandChats = async (brandId: string): Promise<Chat[]> => {
  const chatsQuery = query(collection(db, 'chats'), where('brandId', '==', brandId), orderBy('lastMessageTime', 'desc'))

  const chatDocs = await getDocs(chatsQuery)
  return chatDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Chat)
}

export const getStaffAssignedChats = async (staffId: string): Promise<Chat[]> => {
  const chatsQuery = query(
    collection(db, 'chats'),
    where('assignedTo', '==', staffId),
    orderBy('lastMessageTime', 'desc'),
  )

  const chatDocs = await getDocs(chatsQuery)
  return chatDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Chat)
}

export const listenToChats = (
  userId: string,
  role: string,
  brandId: string | undefined,
  callback: (chats: Chat[]) => void,
) => {
  let chatsQuery

  if (role === 'customer') {
    chatsQuery = query(collection(db, 'chats'), where('customerId', '==', userId), orderBy('lastMessageTime', 'desc'))
  } else if ((role === 'brand_manager' || role === 'brand_staff') && brandId) {
    // Both brand managers and staff can see all chats related to their brand
    chatsQuery = query(collection(db, 'chats'), where('brandId', '==', brandId), orderBy('lastMessageTime', 'desc'))
  } else {
    return () => {}
  }

  return onSnapshot(chatsQuery, (snapshot) => {
    const chats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Chat)
    callback(chats)
  })
}

// Message functions
export const sendMessage = async (
  chatId: string,
  senderId: string,
  senderName: string,
  senderRole: string,
  content: string,
): Promise<string> => {
  const messageRef = await addDoc(collection(db, 'messages'), {
    chatId,
    senderId,
    senderName,
    senderRole,
    content,
    timestamp: Date.now(),
  })

  // Update the chat with the last message
  await updateDoc(doc(db, 'chats', chatId), {
    lastMessage: content,
    lastMessageTime: serverTimestamp(),
  })

  return messageRef.id
}

export const getChatMessages = async (chatId: string): Promise<Message[]> => {
  const messagesQuery = query(collection(db, 'messages'), where('chatId', '==', chatId), orderBy('timestamp', 'asc'))

  const messageDocs = await getDocs(messagesQuery)
  return messageDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Message)
}

export const listenToChatMessages = (chatId: string, callback: (messages: Message[]) => void) => {
  const messagesQuery = query(collection(db, 'messages'), where('chatId', '==', chatId), orderBy('timestamp', 'asc'))

  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Message)
    callback(messages)
  })
}
