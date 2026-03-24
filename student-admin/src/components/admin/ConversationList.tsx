'use client'

import { Conversation } from '@/types/chat'
import { Search, User, Circle } from 'lucide-react'

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
  onSearch: (query: string) => void
  loading: boolean
  searchQuery: string
}

export const ConversationList = ({
  conversations,
  selectedId,
  onSelect,
  onSearch,
  loading,
  searchQuery,
}: ConversationListProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="relative mb-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#f0f2f5] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a884] focus:border-transparent"
        />
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No conversations yet</p>
            <p className="text-sm text-gray-400 mt-2">Start a new conversation</p>
          </div>
        ) : (
          <div className="space-y-1 ">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelect(conversation.id)}
                className={`
                  p-3 rounded-lg cursor-pointer transition-colors relative
                  ${selectedId === conversation.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {conversation.studentName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-black truncate">{conversation.studentName}</p>
                    </div>
<div className="mt-1 flex items-center justify-between">
  <p className="text-sm text-gray-600 truncate max-w-[75%]">
    {conversation.lastMessage || 'No messages yet'}
  </p>

  {conversation.adminUnreadCount > 0 && (
    <span className="ml-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shrink-0">
      {conversation.adminUnreadCount}
    </span>
  )}
</div>

<div className="mt-1 flex justify-end">
  <div className="text-xs text-gray-500 text-right">
    <div>{formatTime(conversation.lastMessageTime)}</div>
    <div className="text-gray-400">{formatDate(conversation.lastMessageTime)}</div>
  </div>
</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

const formatDate = (date: Date): string => {
  const now = new Date()
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
