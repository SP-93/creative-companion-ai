import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { ChatMessage } from '@/types/database';
import { useTranslation } from 'react-i18next';

export function useSupabaseChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(100);

        if (error) throw error;
        setMessages((data as ChatMessage[]) || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Real-time subscription for new messages
  useEffect(() => {
    const channel = supabase
      .channel('chat-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages((prev) => {
            // Avoid duplicates
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

  // Send a message
  const sendMessage = useCallback(
    async (
      content: string,
      username: string,
      walletAddress: string,
      messageType: 'user' | 'oracle' | 'system' = 'user'
    ) => {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .insert({
            username,
            wallet_address: walletAddress,
            content,
            source_lang: i18n.language,
            message_type: messageType,
          } as Record<string, unknown>)
          .select()
          .single();

        if (error) throw error;
        return data as ChatMessage;
      } catch (err) {
        console.error('Error sending message:', err);
        throw err;
      }
    },
    [i18n.language]
  );

  // Get translation for a message (from cache or Edge Function)
  const getTranslation = useCallback(
    async (messageId: string, targetLang: string): Promise<string | null> => {
      try {
        // First check cache
        const { data: cached } = await supabase
          .from('message_translations')
          .select('translated_content')
          .eq('message_id', messageId)
          .eq('target_lang', targetLang)
          .single();

        if (cached) return (cached as { translated_content: string }).translated_content;

        // TODO: Call Edge Function for translation when deployed
        // const { data } = await supabase.functions.invoke('translate-message', {
        //   body: { message_id: messageId, target_lang: targetLang }
        // });
        // return data?.translated_content;

        return null;
      } catch {
        return null;
      }
    },
    []
  );

  return {
    messages,
    loading,
    error,
    sendMessage,
    getTranslation,
  };
}
