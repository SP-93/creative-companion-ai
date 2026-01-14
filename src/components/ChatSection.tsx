import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/contexts/WalletContext';
import { useSupabaseChat } from '@/hooks/useSupabaseChat';
import { useTranslation } from 'react-i18next';
import { Send, Bot, User, Lock, Sparkles, Loader2 } from 'lucide-react';

export function ChatSection() {
  const { isConnected, username, address, hasBasicAccess, connectWallet } = useWallet();
  const { messages, loading, sendMessage } = useSupabaseChat();
  const { t } = useTranslation();
  const [newMessage, setNewMessage] = useState('');
  const [isOracleMode, setIsOracleMode] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isConnected || !address) return;

    setSending(true);
    try {
      await sendMessage(
        newMessage,
        username || 'Anon',
        address,
        isOracleMode && hasBasicAccess ? 'user' : 'user'
      );

      // TODO: If Oracle mode, trigger Edge Function for AI response
      if (isOracleMode && hasBasicAccess) {
        // Will be implemented with Edge Functions
      }

      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section id="chat" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 glass-card rounded-full text-sm text-primary mb-4">
            {t('chat.livePreview', 'Live Preview')}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">{t('chat.overworld', 'Overworld')}</span>{' '}
            <span className="text-primary neon-text">{t('chat.chatTitle', 'Chat')}</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card rounded-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse" />
                <span className="font-display text-lg font-semibold">
                  {t('chat.overworldChat', 'Overworld Chat')}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({messages.length} {t('chat.messages', 'messages')})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={isOracleMode ? 'cyber' : 'outline'}
                  size="sm"
                  onClick={() => setIsOracleMode(!isOracleMode)}
                  disabled={!hasBasicAccess}
                >
                  <Bot className="w-4 h-4" />
                  {t('chat.oracleMode', 'Oracle Mode')}
                  {!hasBasicAccess && <Lock className="w-3 h-3 ml-1" />}
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  {t('chat.noMessages', 'No messages yet. Be the first to say hello!')}
                </div>
              ) : (
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex items-start gap-3 ${
                        message.message_type === 'oracle' ? 'bg-secondary/30 p-3 rounded-xl' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.message_type === 'oracle'
                            ? 'bg-oracle-gradient'
                            : 'bg-primary/20'
                        }`}
                      >
                        {message.message_type === 'oracle' ? (
                          <Sparkles className="w-4 h-4 text-foreground" />
                        ) : (
                          <User className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`font-semibold text-sm ${
                              message.message_type === 'oracle' ? 'text-accent' : 'text-primary'
                            }`}
                          >
                            {message.username}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(message.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground break-words">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              {isConnected ? (
                <div className="flex gap-3">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
                    placeholder={
                      isOracleMode
                        ? t('chat.askOracle', 'Ask the Oracle a question...')
                        : t('chat.typePlaceholder', 'Type your message...')
                    }
                    className="flex-1 bg-input border-border"
                    disabled={sending}
                  />
                  <Button variant="cyber" onClick={handleSendMessage} disabled={sending}>
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-2">
                    {t('chat.connectPrompt', 'Connect your wallet to join the chat')}
                  </p>
                  <Button variant="cyber" onClick={connectWallet}>
                    {t('nav.connectWallet', 'Connect Wallet')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
