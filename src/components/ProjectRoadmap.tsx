import { motion } from 'framer-motion';
import { Check, Clock, Circle } from 'lucide-react';

const phases = [
  {
    phase: 'Phase 1',
    title: 'Foundation',
    status: 'completed',
    items: [
      'Platform Architecture',
      'Wallet Integration',
      'World Chat',
      'Basic Oracle AI',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Token Launch',
    status: 'current',
    items: [
      'OHL Token Deployment',
      'DEV Mode Subscriptions',
      'Token Rewards System',
      'Payment Integration',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Growth',
    status: 'upcoming',
    items: [
      'Advanced AI Features',
      'Code Review Integration',
      'Multi-language Support',
      'Mobile App',
    ],
  },
  {
    phase: 'Phase 4',
    title: 'Expansion',
    status: 'upcoming',
    items: [
      'DAO Governance',
      'Cross-chain Bridge',
      'NFT Rewards',
      'API Marketplace',
    ],
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <Check className="w-5 h-5 text-neon-green" />;
    case 'current':
      return <Clock className="w-5 h-5 text-accent animate-pulse" />;
    default:
      return <Circle className="w-5 h-5 text-muted-foreground" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'border-neon-green/50 bg-neon-green/5';
    case 'current':
      return 'border-accent/50 bg-accent/5 gradient-border';
    default:
      return 'border-border/50 bg-background/30';
  }
};

export function ProjectRoadmap() {
  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 cyber-grid opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 glass-card rounded-full text-sm text-accent mb-4">
            Development Timeline
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">Project</span>{' '}
            <span className="text-primary neon-text">Roadmap</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our journey to building the ultimate Web3 developer community platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card rounded-2xl p-6 border ${getStatusColor(phase.status)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {phase.phase}
                </span>
                {getStatusIcon(phase.status)}
              </div>
              
              <h3 className="font-display text-xl font-bold text-foreground mb-4">
                {phase.title}
              </h3>

              <ul className="space-y-3">
                {phase.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span 
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                        phase.status === 'completed' ? 'bg-neon-green' : 
                        phase.status === 'current' ? 'bg-accent' : 'bg-muted-foreground'
                      }`} 
                    />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              {phase.status === 'current' && (
                <div className="mt-4 pt-4 border-t border-border">
                  <span className="text-xs text-accent font-semibold uppercase tracking-wide">
                    In Progress
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
