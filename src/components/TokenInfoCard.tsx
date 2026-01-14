import { motion } from 'framer-motion';
import { Coins, Hash, Layers, Database, Globe } from 'lucide-react';
import ohlTokenLogo from '@/assets/ohl-token-logo.png';

const TokenInfoCard = () => {
  const tokenInfo = [
    { icon: Coins, label: 'Token Name', value: 'OverHippo.Lab' },
    { icon: Hash, label: 'Symbol', value: 'OH.L' },
    { icon: Layers, label: 'Decimals', value: '18' },
    { icon: Database, label: 'Max Supply', value: '250,000,000 OH.L' },
    { icon: Globe, label: 'Blockchain', value: 'OverProtocol' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 neon-glow"
    >
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          <img 
            src={ohlTokenLogo} 
            alt="OH.L Token Logo" 
            className="relative w-24 h-24 rounded-full object-cover border-2 border-primary/50"
          />
        </div>
      </div>

      {/* Title */}
      <h2 className="font-orbitron text-xl font-bold text-center mb-6 text-primary">
        Token Specifikacije
      </h2>

      {/* Info List */}
      <div className="space-y-4">
        {tokenInfo.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground text-sm">{item.label}</span>
            </div>
            <span className="font-medium text-foreground">{item.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Chain ID Badge */}
      <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Chain ID</span>
          <code className="font-mono text-primary font-bold">54176 (0xD3A0)</code>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-muted-foreground">RPC URL</span>
          <code className="font-mono text-xs text-primary">rpc.overprotocol.com</code>
        </div>
      </div>
    </motion.div>
  );
};

export default TokenInfoCard;
