import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';

const pricingPlans = [
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
    popular: false,
  },
  {
    name: 'Basic Oracle',
    price: '$1.99',
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
  {
    name: 'DEV Mode',
    price: '$19.99',
    period: '/month',
    description: 'Pro Developer Tools',
    features: [
      'Everything in Basic',
      'Advanced AI assistant',
      'Code review & debugging',
      'Priority responses',
      'Liquidity mining rewards',
      'LP position growth',
      'Governance voting',
    ],
    icon: Crown,
    variant: 'oracle' as const,
    popular: false,
  },
];

export function PricingSection() {
  const { isConnected, hasBasicAccess, hasDevAccess } = useWallet();

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

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
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
                <div className={`w-12 h-12 rounded-xl bg-${plan.variant === 'oracle' ? 'accent' : 'primary'}/10 flex items-center justify-center`}>
                  <plan.icon className={`w-6 h-6 ${plan.variant === 'oracle' ? 'text-accent' : 'text-primary'}`} />
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
                  (plan.name === 'Basic Oracle' && hasBasicAccess) ||
                  (plan.name === 'DEV Mode' && hasDevAccess)
                }
              >
                {plan.name === 'Free' && isConnected && 'Active'}
                {plan.name === 'Free' && !isConnected && 'Connect Wallet'}
                {plan.name === 'Basic Oracle' && (hasBasicAccess ? 'Purchased' : 'Buy Now')}
                {plan.name === 'DEV Mode' && (hasDevAccess ? 'Active' : 'Subscribe')}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Token info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass-card inline-flex items-center gap-6 px-8 py-4 rounded-2xl">
            <div className="text-left">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Platform Token</div>
              <div className="font-display text-lg font-semibold text-primary">OH.L (OverHippo.Lab)</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-left">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Max Supply</div>
              <div className="font-display text-lg font-semibold text-foreground">250,000,000</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-left">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Network</div>
              <div className="font-display text-lg font-semibold text-foreground">OverProtocol</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
