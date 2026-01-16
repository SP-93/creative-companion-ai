import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { ChatMessage } from '@/types/database';
import { useTranslation } from 'react-i18next';

export function useOracleChat(walletAddress: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const { i18n } = useTranslation();

  // Fetch initial messages - only from 'oracle' chat room for this user
  useEffect(() => {
    if (!walletAddress) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('chat_room', 'oracle')
          .eq('wallet_address', walletAddress)
          .order('created_at', { ascending: true })
          .limit(100);

        if (error) throw error;
        setMessages((data as ChatMessage[]) || []);
      } catch (err) {
        console.error('Error fetching oracle chat messages:', err);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [walletAddress]);

  // Real-time subscription for new messages in oracle chat for this user
  useEffect(() => {
    if (!walletAddress) return;

    const channel = supabase
      .channel(`oracle-chat-${walletAddress}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_room=eq.oracle`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          // Only add messages for this user
          if (newMessage.wallet_address === walletAddress) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMessage.id)) return prev;
              return [...prev, newMessage];
            });
            // Stop AI loading when oracle responds
            if (newMessage.message_type === 'oracle') {
              setAiLoading(false);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [walletAddress]);

  // Send a message to oracle chat and trigger AI response
  const sendMessage = useCallback(
    async (content: string, username: string) => {
      if (!walletAddress) throw new Error('Wallet not connected');

      try {
        // Insert user message
        const { data, error } = await supabase
          .from('chat_messages')
          .insert({
            username,
            wallet_address: walletAddress,
            content,
            source_lang: i18n.language,
            message_type: 'user',
            chat_room: 'oracle',
          } as Record<string, unknown>)
          .select()
          .single();

        if (error) throw error;

        // Trigger Oracle AI response via Edge Function
        setAiLoading(true);
        try {
          const { error: fnError } = await supabase.functions.invoke('oracle-response', {
            body: {
              wallet_address: walletAddress,
              message: content,
              language: i18n.language,
            },
          });

          if (fnError) {
            console.error('Oracle response error:', fnError);
            setAiLoading(false);
          }
          // AI response will be added via real-time subscription
        } catch (fnErr) {
          console.error('Failed to invoke oracle function:', fnErr);
          setAiLoading(false);
        }

        return data as ChatMessage;
      } catch (err) {
        console.error('Error sending oracle chat message:', err);
        throw err;
      }
    },
    [walletAddress, i18n.language]
  );

  return {
    messages,
    loading,
    error,
    aiLoading,
    sendMessage,
  };
}
