import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/contexts/WalletContext';
import { useSupabaseChat } from '@/hooks/useSupabaseChat';
import { Send, User, Loader2, Users, Globe } from 'lucide-react';

export function WorldChat() {
  const { isConnected, username, address, connectWallet } = useWallet();
  const { messages, loading, sendMessage } = useSupabaseChat();
  const [newMessage, setNewMessage] = useState('');
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
      await sendMessage(newMessage, username || 'Anon', address, 'user');
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

  // Filter only user messages (not oracle)
  const worldMessages = messages.filter(m => m.message_type === 'user');

  return (
    <section className="min-h-[calc(100vh-5rem)] py-8 relative">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-4">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">Public Chat Room</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            <span className="text-foreground">World</span>{' '}
            <span className="text-primary neon-text">Chat</span>
          </h1>
          <p className="text-muted-foreground">
            Connect with the community. No AI, just humans.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card rounded-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse" />
                <span className="font-display text-lg font-semibold">World Chat</span>
                <span className="text-xs text-muted-foreground">
                  ({worldMessages.length} messages)
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm">Public</span>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[500px] overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : worldMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Globe className="w-12 h-12 mb-4 opacity-50" />
                  <p>No messages yet. Be the first to say hello!</p>
                </div>
              ) : (
                <AnimatePresence>
                  {worldMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-primary">
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
                    placeholder="Type your message..."
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
                  <p className="text-muted-foreground mb-3">
                    Connect your wallet to join the conversation
                  </p>
                  <Button variant="cyber" onClick={connectWallet}>
                    Connect Wallet
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
