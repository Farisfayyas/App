import { create } from 'zustand';
import { Conversation, Message, Item } from '@/types';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '@/constants/mockData';

interface ChatStore {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  sendMessage: (conversationId: string, content: string, sharedItem?: Item) => void;
  loadConversations: () => void;
  totalUnread: () => number;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // Seed with mock data so chat tab looks populated before real backend is wired up
  conversations: MOCK_CONVERSATIONS,
  messages: {
    'conv-01': MOCK_MESSAGES.filter((m) => m.conversationId === 'conv-01'),
    'conv-02': MOCK_MESSAGES.filter((m) => m.conversationId === 'conv-02'),
  },

  loadConversations: () => {
    // Placeholder — will call Supabase real-time subscriptions once auth is set up
    set({ conversations: MOCK_CONVERSATIONS });
  },

  sendMessage: (conversationId, content, sharedItem) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'user-01', // replaced with auth user once auth is wired
      content,
      sharedItem,
      createdAt: Date.now(),
    };

    set((state) => {
      const existing = state.messages[conversationId] ?? [];
      const updatedMessages = { ...state.messages, [conversationId]: [...existing, newMessage] };

      const updatedConversations = state.conversations.map((c) =>
        c.id === conversationId ? { ...c, lastMessage: newMessage } : c
      );

      return { messages: updatedMessages, conversations: updatedConversations };
    });
  },

  totalUnread: () =>
    get().conversations.reduce((sum, c) => sum + c.unreadCount, 0),
}));
