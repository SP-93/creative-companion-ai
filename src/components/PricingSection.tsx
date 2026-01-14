import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { Check, Sparkles, Zap, Crown, Clock, Calendar, CalendarDays } from 'lucide-react';
import { DEV_TIERS, BASIC_ORACLE_PRICE, DevTierType, TOKEN_INFO } from '@/lib/constants';

const basePlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Connect & Chat',
    features: [
      'Wallet-based authentication',
      'Username creation',
      'Overworld Chat access',
      'View community discussions',
    ],
    icon: Sparkles,
    variant: 'outline' as const,
  },
  {
    name: 'Basic Oracle',
    price: `$${BASIC_ORACLE_PRICE}`,
    period: 'one-time',
    description: 'Unlock AI Q&A',
    features: [
      'Everything in Free',
      'Unlimited Oracle questions',
      'Basic AI responses',
      'Community support',
      'Lifetime access',
    ],
    icon: Zap,
    variant: 'cyber' as const,
    popular: true,
  },
];

const devFeatures = [
  'Everything in Basic',
  'Advanced AI assistant',
  'Code review & debugging',
  'Priority responses',
  'Liquidity mining rewards',
  'LP position growth',
  'Governance voting',
];

const tierIcons = {
  shortrun: Clock,
  standard: Calendar,
  monthly: CalendarDays,
};

export function PricingSection() {
  const { isConnected, hasBasicAccess, hasDevAccess, devTier } = useWallet();
  const [selectedDevTier, setSelectedDevTier] = useState<'shortrun' | 'standard' | 'monthly'>('standard');

  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 glass-card rounded-full text-sm text-accent mb-4">
            Simple Pricing
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Choose Your</span>
            <br />
            <span className="text-primary neon-text">Access Level</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All payments are made in WOVER on OverProtocol. 
            DEV subscribers earn LP rewards from their subscription.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free & Basic Oracle Cards */}
          {basePlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative glass-card rounded-2xl p-8 ${
                plan.popular ? 'gradient-border' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyber-gradient rounded-full text-xs font-semibold text-primary-foreground uppercase tracking-wide">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center`}>
                  <plan.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="font-display text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground ml-1">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.variant} 
                className="w-full"
                disabled={
                  (plan.name === 'Basic Oracle' && hasBasicAccess)
                }
              >
                {plan.name === 'Free' && isConnected && 'Active'}
                {plan.name === 'Free' && !isConnected && 'Connect Wallet'}
                {plan.name === 'Basic Oracle' && (hasBasicAccess ? 'Purchased' : 'Buy Now')}
              </Button>
            </motion.div>
          ))}

          {/* DEV Mode Card with Tier Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative glass-card rounded-2xl p-8 lg:row-span-1 gradient-border"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-oracle-gradient rounded-full text-xs font-semibold text-primary-foreground uppercase tracking-wide">
              Pro Developer
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Crown className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">DEV Mode</h3>
                <p className="text-xs text-muted-foreground">Pro Developer Tools</p>
              </div>
            </div>

            {/* Tier Selector */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {(Object.keys(DEV_TIERS) as Array<'shortrun' | 'standard' | 'monthly'>).map((tierKey) => {
                const tier = DEV_TIERS[tierKey];
                const TierIcon = tierIcons[tierKey];
                const isSelected = selectedDevTier === tierKey;
                
                return (
                  <button
                    key={tierKey}
                    onClick={() => setSelectedDevTier(tierKey)}
                    className={`relative p-3 rounded-xl border-2 transition-all duration-200 ${
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
                    <TierIcon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-accent' : 'text-muted-foreground'}`} />
                    <div className={`text-xs font-medium ${isSelected ? 'text-accent' : 'text-muted-foreground'}`}>
                      {tier.label}
                    </div>
                    <div className={`text-lg font-bold ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                      ${tier.price}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Tier Info */}
            <div className="text-center mb-6 p-3 rounded-lg bg-accent/5 border border-accent/20">
              <span className="text-sm text-muted-foreground">Selected: </span>
              <span className="text-sm font-semibold text-accent">
                {DEV_TIERS[selectedDevTier].label} - ${DEV_TIERS[selectedDevTier].price}
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                {DEV_TIERS[selectedDevTier].description}
              </p>
            </div>

            <ul className="space-y-2 mb-6">
              {devFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              variant="oracle" 
              className="w-full"
              disabled={hasDevAccess && devTier === selectedDevTier}
            >
              {hasDevAccess && devTier === selectedDevTier ? 'Active' : 'Subscribe Now'}
            </Button>
          </motion.div>
        </div>

        {/* Token info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass-card inline-flex items-center gap-6 px-8 py-4 rounded-2xl flex-wrap justify-center">
            <div className="text-left">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Platform Token</div>
              <div className="font-display text-lg font-semibold text-primary">{TOKEN_INFO.symbol} ({TOKEN_INFO.name})</div>
            </div>
            <div className="w-px h-10 bg-border hidden sm:block" />
            <div className="text-left">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Max Supply</div>
              <div className="font-display text-lg font-semibold text-foreground">{TOKEN_INFO.maxSupply.toLocaleString()}</div>
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
  );
}
