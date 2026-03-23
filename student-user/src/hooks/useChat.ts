// Main chat hook for managing chat state and operations
import { useState, useCallback, useEffect, useMemo } from 'react'
import { Conversation, Message } from '@/types/chat'
import {
  getConversations,
  getConversationById,
  sendMessage,
  markAsRead,
  updateLastMessage,
} from '@/lib/chatService'
import { markConversationAsRead } from '@/lib/conversationService'
import { useChatMessages } from './useChatMessages'
import { subscribeToConversations } from '@/lib/chatService'

interface UseChatOptions {
  userId: string
  userType: 'admin' | 'student'
  userName: string
}

export const useChat = (options: UseChatOptions) => {
  const { userId, userType, userName } = options
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Get messages for selected conversation
  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
  } = useChatMessages({
    conversationId: selectedConversation?.id || null,
  })

  // Load conversations
  
useEffect(() => {
  if (!userId) return

  // Reset load state when the user changes (avoid setState-in-effect lint)
  setTimeout(() => setHasLoaded(false), 0)

  const unsubscribe = subscribeToConversations(
    userId,
    userType,
    (convs) => {
      setConversations(convs)
      setHasLoaded(true)
    }
  )

  return () => unsubscribe()
}, [userId, userType])
  // Sort conversations by most recent message (memoized)
  const sortedConversations = useMemo(
    () =>
      [...conversations].sort(
        (a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
      ),
    [conversations]
  )

  // Filter conversations based on search query (memoized)
  const filteredConversations = useMemo(
    () =>
      sortedConversations.filter((conv) => {
        const participantName = userType === 'admin' ? conv.studentName : conv.adminName
        return participantName.toLowerCase().includes(searchQuery.toLowerCase())
      }),
    [sortedConversations, searchQuery, userType]
  )

  const selectConversation = useCallback(
    async (conversationId: string) => {
      if (!conversationId) {
        setSelectedConversation(null)
        return
      }

      let conv = conversations.find((c) => c.id === conversationId) || null
      if (!conv) {
        try {
          conv = await getConversationById(conversationId)
        } catch (err) {
          console.error('Error fetching conversation:', err)
        }
      }

      if (conv) {
        setSelectedConversation(conv)
        // Mark conversation as read - Firestore will update unread count to 0
        markConversationAsRead(conversationId, userType).catch(err => {
          console.error('Error marking conversation as read:', err)
        })
      }
    },
    [conversations, userId, userType]
  )

  // Mark as read when conversation is selected
  useEffect(() => {
    if (!selectedConversation) return
    
    markConversationAsRead(selectedConversation.id, userType).catch(err => {
      console.error('Error marking conversation as read:', err)
    })
  }, [selectedConversation?.id, userType])

  const sendChatMessage = useCallback(
    async (content: string) => {
      if (!selectedConversation || !content.trim()) {
        throw new Error('No conversation selected or empty message')
      }

      try {
        const messageId = await sendMessage({
          conversationId: selectedConversation.id,
          content,
          senderId: userId,
          senderType: userType,
          senderName: userName,
        })

        // Update last message in conversation
        await updateLastMessage(
          selectedConversation.id,
          content,
          userId,
          userType
        )

        return messageId
      } catch (err) {
        console.error('Error sending message:', err)
        throw err
      }
    },
    [selectedConversation, userId, userType]
  )

  const searchConversations = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  return {
    allConversations: sortedConversations,
    conversations: filteredConversations,
    selectedConversation,
    messages,
    loading: !hasLoaded || messagesLoading,
    error: error || messagesError,
    searchQuery,
    selectConversation,
    sendMessage: sendChatMessage,
    searchConversations,
  }
}
