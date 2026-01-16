import { useState } from 'react';
import { WalletProvider, useWallet } from '@/contexts/WalletContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap, Crown, Clock, Calendar, CalendarDays, MessageSquare } from 'lucide-react';
import { DEV_TIERS, BASIC_ORACLE_PRICE, TOKEN_INFO } from '@/lib/constants';
import { PaymentModal } from '@/components/PaymentModal';
import { Link } from 'react-router-dom';

const tierIcons = {
  shortrun: Clock,
  standard: Calendar,
  monthly: CalendarDays,
};

function PricingContent() {
  const { isConnected, hasBasicAccess, hasDevAccess, devTier, connectWallet } = useWallet();
  const [selectedDevTier, setSelectedDevTier] = useState<'shortrun' | 'standard' | 'monthly'>('standard');
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; type: 'basic' | 'shortrun' | 'standard' | 'monthly' | null }>({ open: false, type: null });

  const handlePayment = (type: 'basic' | 'shortrun' | 'standard' | 'monthly') => {
    if (!isConnected) {
      connectWallet();
      return;
    }
    setPaymentModal({ open: true, type });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 glass-card rounded-full text-sm text-accent mb-4">
                Simple Pricing
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                <span className="text-foreground">Choose Your</span>
                <br />
                <span className="text-primary neon-text">Access Level</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                All payments are made in WOVER on OverProtocol. 
                DEV subscribers earn OHL rewards from their subscription.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {/* Free Tier */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">Free</h3>
                    <p className="text-xs text-muted-foreground">World Chat</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="font-display text-4xl font-bold text-foreground">$0</span>
                  <span className="text-muted-foreground ml-1">forever</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {['Wallet authentication', 'Username creation', 'World Chat access', 'View discussions'].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/chat">
                  <Button variant="outline" className="w-full">
                    {isConnected ? 'Enter Chat' : 'Connect Wallet'}
                  </Button>
                </Link>
              </motion.div>

              {/* Basic Oracle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative glass-card rounded-2xl p-6 gradient-border"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyber-gradient rounded-full text-xs font-semibold text-primary-foreground uppercase tracking-wide">
                  Most Popular
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">Basic Oracle</h3>
                    <p className="text-xs text-muted-foreground">AI Q&A Access</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="font-display text-4xl font-bold text-foreground">${BASIC_ORACLE_PRICE}</span>
                  <span className="text-muted-foreground ml-1">one-time</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {['Everything in Free', 'Unlimited Oracle questions', 'Basic AI responses', 'Community support', 'Lifetime access'].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant="cyber" 
                  className="w-full"
                  disabled={hasBasicAccess}
                  onClick={() => handlePayment('basic')}
                >
                  {hasBasicAccess ? 'Purchased' : 'Buy Now'}
                </Button>
              </motion.div>

              {/* DEV Mode Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative glass-card rounded-2xl p-6 lg:col-span-2 gradient-border"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-oracle-gradient rounded-full text-xs font-semibold text-primary-foreground uppercase tracking-wide">
                  Pro Developer + Token Rewards
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">DEV AI Mode</h3>
                    <p className="text-xs text-muted-foreground">Advanced AI + Earn OHL Tokens</p>
                  </div>
                </div>

                {/* Tier Selector */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {(Object.keys(DEV_TIERS) as Array<'shortrun' | 'standard' | 'monthly'>).map((tierKey) => {
                    const tier = DEV_TIERS[tierKey];
                    const TierIcon = tierIcons[tierKey];
                    const isSelected = selectedDevTier === tierKey;
                    
                    return (
                      <button
                        key={tierKey}
                        onClick={() => setSelectedDevTier(tierKey)}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                          isSelected 
                            ? 'border-accent bg-accent/10' 
                            : 'border-border/50 hover:border-accent/50 bg-background/50'
                        }`}
                      >
                        {tier.badge && (
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-accent rounded-full text-[10px] font-bold text-accent-foreground whitespace-nowrap">
                            {tier.badge}
                          </div>
                        )}
                        <TierIcon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-accent' : 'text-muted-foreground'}`} />
                        <div className={`text-sm font-medium ${isSelected ? 'text-accent' : 'text-muted-foreground'}`}>
                          {tier.label}
                        </div>
                        <div className={`text-2xl font-bold ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                          ${tier.price}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Features</h4>
                    <ul className="space-y-2">
                      {['Everything in Basic', 'Advanced AI assistant', 'Code review & debugging', 'Priority responses', 'Architecture advice'].map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Token Rewards</h4>
                    <ul className="space-y-2">
                      {['Earn OHL tokens while subscribed', 'Rewards until 100% circulation', 'Governance voting rights', 'LP position growth', 'Community airdrops'].map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button 
                  variant="oracle" 
                  className="w-full mt-6"
                  disabled={hasDevAccess && devTier === selectedDevTier}
                  onClick={() => handlePayment(selectedDevTier)}
                >
                  {hasDevAccess && devTier === selectedDevTier ? 'Active' : `Subscribe - $${DEV_TIERS[selectedDevTier].price}`}
                </Button>
              </motion.div>
            </div>

            {/* Token info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16 text-center"
            >
              <div className="glass-card inline-flex items-center gap-6 px-8 py-4 rounded-2xl flex-wrap justify-center">
                <div className="text-left">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Platform Token</div>
                  <div className="font-display text-lg font-semibold text-primary">{TOKEN_INFO.symbol}</div>
                </div>
                <div className="w-px h-10 bg-border hidden sm:block" />
                <div className="text-left">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Initial Circulation</div>
                  <div className="font-display text-lg font-semibold text-foreground">50%</div>
                </div>
                <div className="w-px h-10 bg-border hidden sm:block" />
                <div className="text-left">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Network</div>
                  <div className="font-display text-lg font-semibold text-foreground">{TOKEN_INFO.network}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />

      <PaymentModal 
        isOpen={paymentModal.open}
        onClose={() => setPaymentModal({ open: false, type: null })}
        paymentType={paymentModal.type || 'basic'}
      />
    </div>
  );
}

const Pricing = () => {
  return (
    <WalletProvider>
      <PricingContent />
    </WalletProvider>
  );
};

export default Pricing;
