import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, User, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ohlLogo from '@/assets/ohl-logo.png';
import { motion } from 'framer-motion';
import { LanguageSelector } from './LanguageSelector';
export function Navbar() {
  const {
    isConnected,
    address,
    username,
    connecting,
    connectWallet,
    disconnectWallet,
    hasBasicAccess,
    hasDevAccess
  } = useWallet();
  const {
    t
  } = useTranslation();
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };
  return <motion.nav initial={{
    y: -100
  }} animate={{
    y: 0
  }} className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-primary/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img alt="OHL Logo" className="w-10 h-10" src="/lovable-uploads/2ba87114-f880-4a2b-8d4e-80499e0d3f57.jpg" />
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold text-primary neon-text">OHL-Oracle</span>
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase">O'HippoLab</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('nav.features')}</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('nav.pricing')}</a>
          <a href="#oracle" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('nav.oracle')}</a>
        </div>

        {/* Wallet Connection */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <LanguageSelector />

          {isConnected ? <>
              {/* Access Badges */}
              <div className="hidden sm:flex items-center gap-2">
                {hasDevAccess && <span className="px-2 py-1 text-xs font-display bg-oracle-gradient rounded-full text-foreground flex items-center gap-1">
                    <Zap className="w-3 h-3" /> DEV
                  </span>}
                {hasBasicAccess && !hasDevAccess && <span className="px-2 py-1 text-xs font-display bg-primary/20 text-primary rounded-full flex items-center gap-1">
                    <User className="w-3 h-3" /> Basic
                  </span>}
              </div>

              {/* User Info */}
              <div className="glass-card px-3 py-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                <span className="text-sm font-medium text-foreground">
                  {username || formatAddress(address!)}
                </span>
              </div>

              <Button variant="ghost" size="icon" onClick={disconnectWallet} title={t('nav.disconnect')}>
                <LogOut className="w-4 h-4" />
              </Button>
            </> : <Button variant="cyber" onClick={connectWallet} disabled={connecting}>
              <Wallet className="w-4 h-4" />
              {connecting ? t('nav.connecting') : t('nav.connectWallet')}
            </Button>}
        </div>
      </div>
    </motion.nav>;
}