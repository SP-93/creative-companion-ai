import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, Smartphone, ExternalLink, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { isMetaMaskInstalled, isMobileDevice } from '@/lib/walletconnect';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectMetaMask: () => Promise<void>;
  onConnectWalletConnect: () => Promise<void>;
  connecting: boolean;
  connectionType: 'metamask' | 'walletconnect' | null;
}

export function WalletModal({
  isOpen,
  onClose,
  onConnectMetaMask,
  onConnectWalletConnect,
  connecting,
  connectionType,
}: WalletModalProps) {
  const hasMetaMask = isMetaMaskInstalled();
  const isMobile = isMobileDevice();

  const handleMetaMaskConnect = async () => {
    await onConnectMetaMask();
    onClose();
  };

  const handleWalletConnectConnect = async () => {
    await onConnectWalletConnect();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-card border-primary/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-display text-primary neon-text text-center">
            Connect Wallet
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Choose how you want to connect your wallet to O'HippoLab Oracle
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* MetaMask Option */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              className="w-full h-20 flex items-center justify-between px-6 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all"
              onClick={handleMetaMaskConnect}
              disabled={connecting || !hasMetaMask}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-orange-500" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">MetaMask</div>
                  <div className="text-xs text-muted-foreground">
                    {hasMetaMask ? 'Browser Extension' : 'Not Installed'}
                  </div>
                </div>
              </div>
              {connecting && connectionType === 'metamask' ? (
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              ) : !hasMetaMask ? (
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              ) : null}
            </Button>
          </motion.div>

          {/* WalletConnect Option */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              className="w-full h-20 flex items-center justify-between px-6 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all"
              onClick={handleWalletConnectConnect}
              disabled={connecting}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">WalletConnect</div>
                  <div className="text-xs text-muted-foreground">
                    {isMobile ? 'Mobile Wallet' : 'Scan QR Code'}
                  </div>
                </div>
              </div>
              {connecting && connectionType === 'walletconnect' ? (
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              ) : null}
            </Button>
          </motion.div>

          {/* Info Text */}
          <div className="text-center text-xs text-muted-foreground mt-2">
            <p>By connecting, you agree to the O'HippoLab Terms of Service</p>
            <p className="mt-1">
              Network: <span className="text-primary font-medium">OverProtocol</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
