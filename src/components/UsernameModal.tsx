import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/contexts/WalletContext';
import { Check, X, User, Loader2 } from 'lucide-react';

interface UsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UsernameModal({ isOpen, onClose }: UsernameModalProps) {
  const { setUsername, address } = useWallet();
  const [inputValue, setInputValue] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const validateUsername = (name: string) => {
    if (name.length < 3) return 'Username must be at least 3 characters';
    if (name.length > 20) return 'Username must be under 20 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(name)) return 'Only letters, numbers, and underscores allowed';
    return '';
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setIsAvailable(null);
    
    const validationError = validateUsername(value);
    setError(validationError);

    if (!validationError && value.length >= 3) {
      // Simulate checking username availability
      setIsChecking(true);
      setTimeout(() => {
        // In production, this would be an API call
        const taken = ['admin', 'oracle', 'hippo', 'ohl'].includes(value.toLowerCase());
        setIsAvailable(!taken);
        setIsChecking(false);
      }, 500);
    }
  };

  const handleSubmit = () => {
    if (isAvailable && !error) {
      setUsername(inputValue);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-md glass-card rounded-2xl p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Choose Your Username
              </h2>
              <p className="text-sm text-muted-foreground">
                This will be your identity in Overworld Chat
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Input
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Enter username (3-20 chars)"
                  className="pr-10 bg-input border-border"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isChecking && <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />}
                  {!isChecking && isAvailable === true && <Check className="w-5 h-5 text-neon-green" />}
                  {!isChecking && isAvailable === false && <X className="w-5 h-5 text-destructive" />}
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              
              {!error && isAvailable === true && (
                <p className="text-sm text-neon-green">✓ Username available!</p>
              )}
              
              {!error && isAvailable === false && (
                <p className="text-sm text-destructive">✗ Username already taken</p>
              )}

              <div className="pt-4">
                <Button
                  variant="cyber"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={!isAvailable || !!error}
                >
                  Confirm Username
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Connected: {address?.slice(0, 10)}...{address?.slice(-8)}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
