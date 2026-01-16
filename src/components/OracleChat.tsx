import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/contexts/WalletContext';
import { useOracleChat } from '@/hooks/useOracleChat';
import { Send, Bot, User, Lock, Sparkles, Loader2, Zap, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

export function OracleChat() {
  const { isConnected, username, address, hasBasicAccess, hasDevAccess, devTier, connectWallet } = useWallet();
  const { messages, loading, aiLoading, sendMessage } = useOracleChat(address);
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
    if (!newMessage.trim() || !isConnected || !address || !hasBasicAccess) return;

    setSending(true);
    try {
      // Send user message and trigger Oracle AI response
      await sendMessage(newMessage, username || 'Anon');
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

  // All messages are now per-user oracle messages (filtered by hook)
  const oracleMessages = messages;

  const hasAccess = hasBasicAccess || hasDevAccess;

  return (
    <section className="min-h-[calc(100vh-5rem)] py-8 relative">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent">AI-Powered Assistant</span>
            {hasDevAccess && (
              <span className="ml-2 px-2 py-0.5 bg-oracle-gradient rounded-full text-[10px] font-bold text-foreground flex items-center gap-1">
                <Crown className="w-3 h-3" /> DEV MODE
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            <span className="text-foreground">Oracle</span>{' '}
            <span className="text-accent neon-text">AI</span>
          </h1>
          <p className="text-muted-foreground">
            {hasDevAccess 
              ? 'Advanced AI assistant with code review, debugging, and architecture advice.'
              : hasBasicAccess
                ? 'Ask any question and get instant AI-powered answers.'
                : 'Unlock AI-powered answers with Basic or DEV access.'
            }
          </p>
        </motion.div>

        {!hasAccess ? (
          // Locked State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 mx-auto mb-6 flex items-center justify-center">
                <Lock className="w-10 h-10 text-accent" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                Oracle Access Required
              </h2>
              <p className="text-muted-foreground mb-6">
                Purchase Basic Oracle ($1.99 one-time) for lifetime AI access, 
                or subscribe to DEV Mode to earn OHL tokens while using advanced AI features.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!isConnected ? (
                  <Button variant="cyber" size="lg" onClick={connectWallet}>
                    Connect Wallet
                  </Button>
                ) : (
                  <>
                    <Link to="/pricing">
                      <Button variant="cyber" size="lg">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get Basic Access
                      </Button>
                    </Link>
                    <Link to="/pricing">
                      <Button variant="oracle" size="lg">
                        <Zap className="w-4 h-4 mr-2" />
                        Subscribe to DEV
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          // Chat Interface
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
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                  <span className="font-display text-lg font-semibold">Oracle AI</span>
                  <span className="text-xs text-muted-foreground">
                    ({oracleMessages.length} messages)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hasDevAccess ? (
                    <span className="px-3 py-1 bg-oracle-gradient rounded-full text-xs font-semibold text-foreground flex items-center gap-1">
                      <Crown className="w-3 h-3" /> DEV - {devTier}
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-primary/20 rounded-full text-xs font-semibold text-primary flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Basic
                    </span>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="h-[500px] overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                  </div>
                ) : oracleMessages.length === 0 && !aiLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Bot className="w-12 h-12 mb-4 opacity-50" />
                    <p>Ask the Oracle anything!</p>
                    <p className="text-sm mt-2">Try: "How do I create a React component?"</p>
                  </div>
                ) : (
                  <>
                    <AnimatePresence>
                      {oracleMessages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`flex items-start gap-3 ${
                            message.message_type === 'oracle' ? 'bg-accent/5 p-4 rounded-xl' : ''
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
                                {message.message_type === 'oracle' ? 'Oracle AI' : message.username}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(message.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-foreground break-words whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {/* AI Loading indicator */}
                    {aiLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3 bg-accent/5 p-4 rounded-xl"
                      >
                        <div className="w-8 h-8 rounded-full bg-oracle-gradient flex items-center justify-center flex-shrink-0">
                          <Loader2 className="w-4 h-4 text-foreground animate-spin" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-sm text-accent">Oracle AI</span>
                          <p className="text-sm text-muted-foreground mt-1">Thinking...</p>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-3">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
                    placeholder={hasDevAccess ? "Ask anything - code review, debugging, architecture..." : "Ask the Oracle a question..."}
                    className="flex-1 bg-input border-border"
                    disabled={sending}
                  />
                  <Button variant="oracle" onClick={handleSendMessage} disabled={sending}>
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {hasDevAccess && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    <Zap className="w-3 h-3 inline mr-1 text-primary" />
                    Earning OHL tokens while subscribed to DEV mode
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
