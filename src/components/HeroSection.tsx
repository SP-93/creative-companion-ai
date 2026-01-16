import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { Wallet, Sparkles, MessageSquare, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import hippoHero from '@/assets/hippo-hero.png';

export function HeroSection() {
  const { isConnected, connectWallet, connecting } = useWallet();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-50" />
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/50 rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              opacity: 0 
            }}
            animate={{ 
              y: [null, '-100vh'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-6"
            >
              <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">Powered by OverProtocol</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              <span className="text-foreground">AI-Powered</span>
              <br />
              <span className="text-primary neon-text">Oracle</span>
              <br />
              <span className="text-foreground">Community</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground mb-8 max-w-lg"
            >
              Join the next generation of Web3 community chat. Get instant AI-powered answers, 
              connect with developers, and earn through liquidity mining.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              {!isConnected ? (
                <Button 
                  variant="cyber" 
                  size="xl"
                  onClick={connectWallet}
                  disabled={connecting}
                  className="animate-pulse-glow"
                >
                  <Wallet className="w-5 h-5" />
                  {connecting ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              ) : (
                <Link to="/chat">
                  <Button variant="cyber" size="xl">
                    <MessageSquare className="w-5 h-5" />
                    Enter Chat
                  </Button>
                </Link>
              )}
              
              <Link to="/pricing">
                <Button variant="neon" size="xl">
                  <Sparkles className="w-5 h-5" />
                  View Pricing
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6 mt-12"
            >
              {[
                { label: 'Active Users', value: '2.5K+' },
                { label: 'Questions Answered', value: '50K+' },
                { label: 'OH.L Staked', value: '$1.2M' },
              ].map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="font-display text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-primary/10 to-transparent blur-3xl" />
              
              <motion.img
                src={hippoHero}
                alt="OHL Oracle Hippo"
                className="relative z-10 w-full max-w-2xl mx-auto rounded-2xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute top-10 -left-4 glass-card px-4 py-3 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">GPT-4 Powered</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-20 -right-4 glass-card px-4 py-3 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">Earn OH.L Rewards</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
