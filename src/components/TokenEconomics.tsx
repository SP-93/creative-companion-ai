import { motion } from 'framer-motion';
import { Coins, Users, Zap, Lock, Gift, TrendingUp } from 'lucide-react';
import { TOKEN_INFO } from '@/lib/constants';

const distribution = [
  { label: 'Initial Circulation', percent: 50, color: 'primary', icon: TrendingUp },
  { label: 'Rewards Pool', percent: 25, color: 'accent', icon: Gift },
  { label: 'Team & Development', percent: 15, color: 'neon-green', icon: Users },
  { label: 'Reserve', percent: 10, color: 'neon-blue', icon: Lock },
];

const utilities = [
  {
    icon: Zap,
    title: 'DEV Mode Access',
    description: 'Stake OHL to unlock advanced AI features and priority responses.',
  },
  {
    icon: Gift,
    title: 'Rewards Distribution',
    description: 'DEV subscribers earn OHL tokens proportional to their subscription duration.',
  },
  {
    icon: Users,
    title: 'Governance',
    description: 'Token holders can vote on platform features, pricing, and development priorities.',
  },
  {
    icon: TrendingUp,
    title: 'Liquidity Mining',
    description: 'Provide liquidity to OHL/WOVER pool and earn additional rewards.',
  },
];

export function TokenEconomics() {
  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 glass-card rounded-full text-sm text-primary mb-4">
            Token Economics
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">{TOKEN_INFO.symbol}</span>{' '}
            <span className="text-primary neon-text">Distribution</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Total supply of {TOKEN_INFO.maxSupply.toLocaleString()} OHL tokens with 50% 
            entering circulation from day one.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Coins className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">Token Allocation</h3>
                <p className="text-xs text-muted-foreground">250,000,000 OHL Total Supply</p>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4">
              {distribution.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" style={{ color: `hsl(var(--${item.color}))` }} />
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: `hsl(var(--${item.color}))` }}>
                      {item.percent}%
                    </span>
                  </div>
                  <div className="h-3 bg-background/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: `hsl(var(--${item.color}))` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((TOKEN_INFO.maxSupply * item.percent) / 100).toLocaleString()} OHL
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Token Utility */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="font-display text-xl font-semibold text-foreground mb-6">Token Utility</h3>
            
            {utilities.map((utility, index) => (
              <motion.div
                key={utility.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl p-4 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <utility.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{utility.title}</h4>
                  <p className="text-sm text-muted-foreground">{utility.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {[
            { label: 'Total Supply', value: '250M' },
            { label: 'Initial Circulation', value: '125M (50%)' },
            { label: 'DEV Rewards Pool', value: '62.5M' },
            { label: 'Decimals', value: '18' },
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl p-4 text-center"
            >
              <div className="font-display text-xl font-bold text-primary">{metric.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
