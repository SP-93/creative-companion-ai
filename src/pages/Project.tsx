import { WalletProvider } from '@/contexts/WalletContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TokenEconomics } from '@/components/TokenEconomics';
import { ProjectRoadmap } from '@/components/ProjectRoadmap';
import { motion } from 'framer-motion';
import { TOKEN_INFO, ADMIN_WALLET, OVER_PROTOCOL } from '@/lib/constants';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

function ProjectContent() {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(ADMIN_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 cyber-grid opacity-30" />
          <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <span className="inline-block px-4 py-2 glass-card rounded-full text-sm text-primary mb-6">
                About the Project
              </span>
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">O'HippoLab</span>{' '}
                <span className="text-primary neon-text">Oracle</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                AI-powered community platform built on OverProtocol. Get instant answers, 
                connect with developers, and earn rewards through liquidity mining.
              </p>

              {/* Token Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-6 max-w-2xl mx-auto"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Token</div>
                    <div className="font-display text-xl font-bold text-primary">{TOKEN_INFO.symbol}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Supply</div>
                    <div className="font-display text-xl font-bold text-foreground">250M</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Network</div>
                    <div className="font-display text-xl font-bold text-foreground">{TOKEN_INFO.network}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Initial Circ.</div>
                    <div className="font-display text-xl font-bold text-accent">50%</div>
                  </div>
                </div>

                {/* Contract Address */}
                <div className="flex items-center justify-center gap-2 p-3 bg-background/50 rounded-lg">
                  <span className="text-xs text-muted-foreground">Contract:</span>
                  <code className="text-xs text-primary font-mono">{ADMIN_WALLET.slice(0, 10)}...{ADMIN_WALLET.slice(-8)}</code>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={copyAddress}>
                    {copied ? <Check className="w-3 h-3 text-neon-green" /> : <Copy className="w-3 h-3" />}
                  </Button>
                  <a 
                    href={`${OVER_PROTOCOL.explorer}/address/${ADMIN_WALLET}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Token Economics */}
        <TokenEconomics />

        {/* Roadmap */}
        <ProjectRoadmap />

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 glass-card rounded-full text-sm text-accent mb-4">
                Team
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                <span className="text-foreground">Built by</span>{' '}
                <span className="text-primary neon-text">Developers</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A passionate team dedicated to building the future of Web3 community tools.
              </p>
            </motion.div>

            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                  <span className="font-display text-2xl font-bold text-primary">OH</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">O'Hippo</h3>
                <p className="text-sm text-muted-foreground mb-3">Founder & Lead Developer</p>
                <p className="text-xs text-muted-foreground">
                  Building decentralized AI tools for the OverProtocol ecosystem.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

const Project = () => {
  return (
    <WalletProvider>
      <ProjectContent />
    </WalletProvider>
  );
};

export default Project;
