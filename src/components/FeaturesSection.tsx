import { motion } from 'framer-motion';
import { MessageSquare, Brain, Coins, Shield, Zap, Users } from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Overworld Chat',
    description: 'Real-time community chat with username-based identity. Connect with developers and enthusiasts.',
    color: 'primary',
  },
  {
    icon: Brain,
    title: 'AI Oracle',
    description: 'GPT-4 powered Q&A system. Get instant, intelligent answers to any development question.',
    color: 'accent',
  },
  {
    icon: Coins,
    title: 'Liquidity Mining',
    description: 'DEV subscribers earn LP rewards. Your subscription funds grow the OH.L/WOVER pool.',
    color: 'neon-green',
  },
  {
    icon: Shield,
    title: 'Web3 Security',
    description: 'Wallet-based authentication. Your identity, your control. No passwords needed.',
    color: 'neon-blue',
  },
  {
    icon: Zap,
    title: 'DEV Mode',
    description: 'Advanced AI assistant for developers. Code review, debugging help, architecture advice.',
    color: 'neon-orange',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'Built by developers, for developers. Open governance through OH.L token holders.',
    color: 'neon-pink',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 glass-card rounded-full text-sm text-primary mb-4">
            Platform Features
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Everything You Need to</span>
            <br />
            <span className="text-primary neon-text">Build & Connect</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            OHL-Oracle combines the power of AI with blockchain technology to create 
            the ultimate developer community platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 rounded-2xl hover-lift group"
            >
              <div 
                className={`w-14 h-14 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                style={{ backgroundColor: `hsl(var(--${feature.color}) / 0.1)` }}
              >
                <feature.icon 
                  className="w-7 h-7" 
                  style={{ color: `hsl(var(--${feature.color}))` }}
                />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
