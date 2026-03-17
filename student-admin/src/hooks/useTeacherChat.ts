// Teacher-specific chat hook for managing assigned conversations
import { useState, useCallback, useEffect, useMemo } from 'react'
import { Conversation, Message } from '@/types/chat'
import {
  getConversationById,
  sendMessage,
  markAsRead,
  updateLastMessage,
} from '@/lib/chatService'
import { useChatMessages } from './useChatMessages'
import { subscribeToTeacherConversations } from '@/lib/chatService'

interface UseTeacherChatOptions {
  userId: string
  userName: string
  enabled?: boolean
}

export const useTeacherChat = (options: UseTeacherChatOptions) => {
  const { userId, userName } = options
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

  // Load assigned conversations for teacher
  useEffect(() => {
    if (!userId || options.enabled === false) return

    // Reset load state when the user changes (avoids setState-in-effect lint)
    setTimeout(() => setHasLoaded(false), 0)

    const unsubscribe = subscribeToTeacherConversations(
      userId,
      (convs) => {
        setConversations(convs)
        setHasLoaded(true)
      }
    )

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [userId, options.enabled])

  useEffect(() => {
    const conversationId = selectedConversation?.id
    if (!conversationId) return

    markAsRead(conversationId, userId, 'teacher')
  }, [selectedConversation?.id, userId])

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
        const studentName = conv.studentName
        return studentName.toLowerCase().includes(searchQuery.toLowerCase())
      }),
    [sortedConversations, searchQuery]
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
        // Mark messages as read
        try {
          await markAsRead(conversationId, userId, 'teacher')
        } catch (err) {
          console.error('Error marking messages as read:', err)
        }
      }
    },
    [conversations, userId]
  )

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
          senderType: 'teacher',
          senderName: userName,
        })

        // Update last message in conversation
        await updateLastMessage(
          selectedConversation.id,
          content,
          userId,
          'teacher'
        )

        return messageId
      } catch (err) {
        console.error('Error sending message:', err)
        throw err
      }
    },
    [selectedConversation, userId]
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
