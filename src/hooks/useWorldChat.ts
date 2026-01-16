import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { ChatMessage } from '@/types/database';
import { useTranslation } from 'react-i18next';

export function useWorldChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  // Fetch initial messages - only from 'world' chat room
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('chat_room', 'world')
          .order('created_at', { ascending: true })
          .limit(100);

        if (error) throw error;
        setMessages((data as ChatMessage[]) || []);
      } catch (err) {
        console.error('Error fetching world chat messages:', err);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Real-time subscription for new messages in world chat
  useEffect(() => {
    const channel = supabase
      .channel('world-chat-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: 'chat_room=eq.world',
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Send a message to world chat
  const sendMessage = useCallback(
    async (content: string, username: string, walletAddress: string) => {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .insert({
            username,
            wallet_address: walletAddress,
            content,
            source_lang: i18n.language,
            message_type: 'user',
            chat_room: 'world',
          } as Record<string, unknown>)
          .select()
          .single();

        if (error) throw error;
        return data as ChatMessage;
      } catch (err) {
        console.error('Error sending world chat message:', err);
        throw err;
      }
    },
    [i18n.language]
  );

  return {
    messages,
    loading,
    error,
    sendMessage,
  };
}
